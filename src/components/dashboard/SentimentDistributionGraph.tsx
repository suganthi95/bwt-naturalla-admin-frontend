import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, Label, LabelList, XAxis, YAxis } from "recharts";
import { getSentimentDistribution } from "@/lib/apis";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Info } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

interface Props {
    placeId: string
}

function SentimentDistributionGraph({ placeId }: Props) {

    const { auth } = useAppContext();
   const {t} = useTranslation()
    const { isLoading, isSuccess, isError, data } = useQuery({
        queryKey: [ "getSentimentDistribution" ],
        queryFn: () => getSentimentDistribution({
            token: auth?.token as string,
            placeId: placeId,
            email:auth?.data?.email ?? ''
        }),
        retry: 3,
        refetchOnWindowFocus: true,
        select: (data) => data.data,
        enabled: Boolean(placeId) 
    });

    let content;

    if(isLoading){
        content = <Skeleton className="h-[350px] rounded-xl" />
    }

    if(isError || data?.length === 0){
        content = (
            <Card>
                <CardContent className="h-[350px] flex items-center justify-center">
                  <p className="text-center text-sm text-slate-500"><Trans i18nKey={'no_data_found'}/></p>
                </CardContent>
            </Card>
        )
    }

    if(isSuccess){
        
        const chartConfig = {
            pv: {
                label: t("sentiment"),
                color: "bg-primary",
            },
        } satisfies ChartConfig

        content = (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg md:text-balance"><Trans i18nKey={'sentimentDistribution.title'}/></CardTitle>
                    <Popover>
                            <PopoverTrigger>
                            <Info className="h-4 w-4 text-primary " />
                            </PopoverTrigger>
                            <PopoverContent className="md:w-[400px] -translate-x-7 md:-translate-x-20">
                                <div className="bg-white rounded-lg dark:bg-slate-700  text-justify  ">
                                     <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white"><Trans i18nKey={'sentimentDistribution.title'}/></h3>
                                     <div className="space-y-2">
                                         <div>
                                            <strong className="text-sm"><Trans i18nKey={'what_it_shows'}/></strong>
                                            <p className="text-xs text-gray-500 dark:text-slate-300"><Trans i18nKey={'sentimentDistribution.description1'}/></p>
                                         </div>
                                         <div>
                                            <strong className="text-sm"><Trans i18nKey={'what_it_shows'}/></strong>
                                            <p className="text-xs text-gray-500 dark:text-slate-300"><Trans i18nKey={'sentimentDistribution.description2'}/></p>
                                         </div>
                                         <div>
                                            <strong  className="text-sm"><Trans i18nKey={'how_to_read_it'}/></strong>
                                            <p className="text-xs text-gray-500 dark:text-slate-300"><Trans i18nKey={'sentimentDistribution.description3'}/></p>
                                         </div>
                                     </div>
                                </div>
                            </PopoverContent>
                    </Popover>

                    </div>
                    <p className="  hidden md:block  text-xs !mt-5 text-slate-500"><strong><Trans i18nKey={'what_it_shows'}/></strong> <Trans i18nKey={'sentimentDistribution.description1'}/></p>
                </CardHeader>
                <CardContent className="p-0 lg:p-3">
                <ChartContainer config={chartConfig}>
                    <BarChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        top: 20,
                    }}
                    >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="sentiment_score"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        // tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis 
                        dataKey="position_y"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    >
                        <Label
                            value={t('review.count')}
                            className="!text-[10px]   md:text-lg "
                            offset={-10}
                            angle={270}
                            dx={20}
                            dy={-100}
                            position="insideBottomLeft"
                            fontSize={14}
                        />
                    </YAxis>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey={t('review_count')} fill="orange" radius={8}>
                        <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                        />
                    </Bar>
                    </BarChart>
                </ChartContainer>
                <p className="text-center text-sm text-slate-500"><Trans i18nKey={'sentimentScore'}/></p>
                </CardContent>
                {/* <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
                </CardFooter> */}
            </Card>
        )
    }


    return content
}

export default SentimentDistributionGraph


