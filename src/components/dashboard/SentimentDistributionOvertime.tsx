import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { sentimentDistributionOvertime } from "@/lib/apis";
import { Skeleton } from "../ui/skeleton";

interface Props {
    placeId: string
}

function SentimentDistributionOvertime({ placeId }: Props) {

    const { auth } = useAppContext();

    const { isLoading, isSuccess, data } = useQuery({
        queryKey: [ "sentimentDistributionOvertime" ],
        queryFn: () => sentimentDistributionOvertime({
            token: auth?.token as string,
            placeId: placeId,
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

    if(isSuccess){

        const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];

        const chartData = data.map((item: any) => ({ month: months[item.month - 1], positive: item.positive, negative: item.negative }))
        
        const chartConfig = {
            positive: {
                label: "positive",
                color: "orange",
            },
            negative: {
                label: "negative",
                color: "red",
            },
        } satisfies ChartConfig

        content = (
            <Card>
                <CardHeader>
                <CardTitle>Sentiment Distribution Over Time</CardTitle>
                {/* <CardDescription>January - June 2024</CardDescription> */}
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                            left: 12,
                            right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                offset="5%"
                                stopColor="red"
                                stopOpacity={0.8}
                                />
                                <stop
                                offset="95%"
                                stopColor="red"
                                stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                offset="5%"
                                stopColor="orange"
                                stopOpacity={0.8}
                                />
                                <stop
                                offset="95%"
                                stopColor="orange"
                                stopOpacity={0.1}
                                />
                            </linearGradient>
                            </defs>
                            <Area
                                dataKey="positive"
                                type="step"
                                fill="url(#fillMobile)"
                                fillOpacity={0.4}
                                stroke="orange"
                            />
                            <Area
                                dataKey="negative"
                                type="step"
                                fill="url(#fillDesktop)"
                                fillOpacity={0.4}
                                stroke="red"
                            />
                        </AreaChart>
                        </ChartContainer>
                    {/* <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                offset="5%"
                                stopColor="red"
                                stopOpacity={0.8}
                                />
                                <stop
                                offset="95%"
                                stopColor="red"
                                stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                offset="5%"
                                stopColor="orange"
                                stopOpacity={0.8}
                                />
                                <stop
                                offset="95%"
                                stopColor="orange"
                                stopOpacity={0.1}
                                />
                            </linearGradient>
                            </defs>
                            <Area
                                dataKey="positive"
                                type="natural"
                                fill="url(#fillMobile)"
                                fillOpacity={0.4}
                                stroke="orange"
                                stackId="a"
                            />
                            <Area
                                dataKey="negative"
                                type="natural"
                                fill="url(#fillDesktop)"
                                fillOpacity={0.4}
                                stroke="red"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer> */}
                    <p className="text-center text-sm text-slate-500">Month</p>
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

export default SentimentDistributionOvertime