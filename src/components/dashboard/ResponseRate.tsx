import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { responseRate } from "@/lib/apis";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Info } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

interface Props {
    placeId: string
}

function ResponseRate({ placeId }: Props) {

    const { auth } = useAppContext();
    const {t} = useTranslation()

    const { isLoading, isSuccess, isError, data } = useQuery({
        queryKey: [ "responseRate" ],
        queryFn: () => responseRate({
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

    if(isError || !Array.isArray(data) && data?.length === 0){
        content = (
            <Card>
                <CardContent className="h-[350px] flex items-center justify-center">
                  <p className="text-center text-sm text-slate-500"><Trans i18nKey={'no_data_found'}/></p>
                </CardContent>
            </Card>
        )
    }

    if(isSuccess && Array.isArray(data)){

        const color = [ "green", "orange", "yellow", "red" ];
        const chartData = data.map((item: any, index: any) => ({ category: item.category, percentage: item.percentage, fill: color[index] }))

        const chartConfig = {
            "Responded Positive": {
              label:t('respondedPositive'),
              color: "yellow",
            },
            "Not Responded Positive": {
              label:t('yetToRespondPositive'),
              color: "green",
            },
            "Responded Negative": {
              label:t('respondedNegative'),
              color: "orange",
            },
            "Not Responded Negative": {
              label:t('yetToRespondNegative'),
              color: "red",
            },
        } satisfies ChartConfig

        // const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0)

        content = (
            <Card>
                <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg md:text-balance"><Trans i18nKey={'responseRate.title'}/></CardTitle>
                    <Popover>
                            <PopoverTrigger>
                            <Info className="h-4 w-4 text-primary " />
                            </PopoverTrigger>
                            <PopoverContent className="md:w-[400px] -translate-x-7 md:-translate-x-20"> 
                                  <div className="bg-white dark:bg-slate-700 rounded-lg  text-justify">
                                       <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white"><Trans i18nKey={'responseRate.title'}/></h3>
                                       <div className="space-y-2">
                                            <div>
                                                <strong className="text-sm"><Trans i18nKey={'purpose'}/></strong>
                                                <p className="text-xs text-gray-500 dark:text-slate-300"><Trans i18nKey={'responseRate.description1'}/></p>
                                             </div>
                                             <div>
                                                 <strong className="text-sm"><Trans i18nKey={'what_it_shows'}/></strong>
                                                 <p className="text-xs text-gray-500 dark:text-slate-300"><Trans i18nKey={'responseRate.description2'}/></p>
                                             </div>
                                             <div>
                                                 <strong  className="text-sm"><Trans i18nKey={'how_to_read_it'}/></strong>
                                                 <p className="text-xs text-gray-500 dark:text-slate-300"><Trans i18nKey={'responseRate.description3'}/></p>
                                             </div>
                                        </div>
                                  </div>
                            </PopoverContent>
                    </Popover>

                </div>
                {/* <CardDescription>January - June 2024</CardDescription> */}
                <p className="text-xs  hidden md:block  !mt-5 text-slate-500"><strong><Trans i18nKey={'what_it_shows'}/></strong><Trans i18nKey={'responseRate.description1'}/></p>
                </CardHeader>
                <CardContent className="p-0 lg:p-3">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[350px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="percentage"
                                nameKey="category"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                            <Label
                            
                                content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className=" "
                                    >
                                        {/* <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-3xl font-bold"
                                        >
                                        {totalVisitors.toLocaleString()}
                                        </tspan> */}
                                        <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0)}
                                        className=" dark:fill-slate-300 "
                                        >
                                            <Trans i18nKey={'responseRate.title'}/>
                                        </tspan>
                                    </text>
                                    )
                                }
                                }}
                            />
                            </Pie>

                            <ChartLegend
                                
                                content={<ChartLegendContent nameKey="category" />}
                            />
                        </PieChart>
                        </ChartContainer>
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

export default ResponseRate