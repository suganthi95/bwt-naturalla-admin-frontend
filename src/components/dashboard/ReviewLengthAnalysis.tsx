import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { reviewLenAnalysis } from "@/lib/apis";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Info } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

interface Props {
    placeId: string
}

function ReviewLengthAnalysis({ placeId }: Props) {

    const { auth } = useAppContext();
    const {t} = useTranslation()
    const { isLoading, isSuccess, isError, data } = useQuery({
        queryKey: [ "ReviewLenAnalysis" ],
        queryFn: () => reviewLenAnalysis({
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
            positive_reviews: {
                label:t('review.positive'),
                color: "bg-primary",
            },
            negative_reviews: {
                label:t('review.negative'),
                color: "red",
            },
        } satisfies ChartConfig
        
        content = (
            <Card className="relative">
                <CardHeader>
                    <div className="flex items-center  justify-between">
                        <CardTitle className="text-lg md:text-balance"><Trans i18nKey={'review_length_analysis'}/></CardTitle>
                        <Popover >
                            <PopoverTrigger>
                            <Info className="h-4 w-4 text-primary " />
                            </PopoverTrigger>
                            <PopoverContent className="md:w-[400px] absolute   -translate-x-7 md:-translate-x-20 "> 
                                 <div className="bg-white rounded-lg dark:bg-slate-700   text-justify">
                                      <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white"><Trans i18nKey={'review_length_analysis'}/></h3>
                                      <div className="space-y-2">
                                          <div>
                                              <strong className="text-sm"><Trans i18nKey={'purpose'}/></strong>
                                               <p className="text-xs text-gray-500 dark:text-slate-300"><Trans i18nKey={'purpose_description'}/></p>
                                           </div>
                                            <div>
                                                <strong className="text-sm"><Trans i18nKey={'what_it_shows'}/></strong>
                                                <p className="text-xs text-gray-500 dark:text-slate-300"><Trans i18nKey={'what_it_shows_description'}/></p>
                                            </div>
                                             <div>
                                                 <strong  className="text-sm"><Trans i18nKey={'how_to_read_it'}/></strong>
                                                  <p className="text-xs text-gray-500 dark:text-slate-300"><Trans i18nKey={'how_to_read_it_description'}/></p>
                                            </div>
                                                </div>
                                 </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <p className="  hidden md:block  text-xs !mt-5 text-slate-500"><strong><Trans i18nKey={'what_it_shows'}/></strong><Trans i18nKey={'what_it_shows_description'}/></p>
                </CardHeader>
                <CardContent className="p-0 lg:p-3">
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="review_length_range"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            // tickFormatter={(value) => value.slice(0, 3)}
                        >
                            {/* <Label
                                value='review length range'
                                offset={-5}
                                dx={20}
                                dy={20}
                                fontSize={14}
                            /> */}
                        </XAxis>
                        
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                         <Bar
                            dataKey="positive_reviews"
                            stackId="a"
                            fill="orange"
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            dataKey="negative_reviews"
                            stackId="a"
                            fill="red"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
                <p className="text-center text-sm text-slate-500"><Trans i18nKey={'review_length_range'}/></p>
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

export default ReviewLengthAnalysis