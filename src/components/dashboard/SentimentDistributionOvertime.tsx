import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { sentimentDistributionOvertime } from "@/lib/apis";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Info } from "lucide-react";

interface Props {
    placeId: string
}
type ChartData = {
    title: string;
    purpose: string;
    whatItShows: string;
    howToReadIt: string;
  };
  

function SentimentDistributionOvertime({ placeId }: Props) {

    const { auth } = useAppContext();

    const { isLoading, isSuccess, isError, data } = useQuery({
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

    if(isError || data?.length === 0 || data?.filter((item: any) => item.positive === 0 && item.negative === 0).length === 12){
        content = (
            <Card>
                <CardContent className="h-[350px] flex items-center justify-center">
                    <p className="text-center text-sm text-slate-500">No data found</p>
                </CardContent>
            </Card>
        )
    }

    if(isSuccess && !(data?.filter((item: any) => item.positive === 0 && item.negative === 0).length === 12)){

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
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg md:text-balance">Sentiment Distribution Over Time</CardTitle>
                    <Popover>
                            <PopoverTrigger>
                            <Info className="h-4 w-4 text-gray-500 hover:text-gray-800" />
                            </PopoverTrigger>
                            <PopoverContent className="md:w-[400px] -translate-x-7 md:-translate-x-20">
                                 <div className="bg-white rounded-lg text-justify ">
                                            <h3 className="text-md font-semibold mb-2 text-gray-800">Sentiment Distribution Over Time</h3>
                                            <div className="space-y-2">
                                               <div>
                                                    <strong className="text-sm">What it shows:</strong>
                                                    <p className="text-xs text-gray-500">This chart displays how the sentiment of reviews changes over time, helping you track shifts in customer sentiment throughout the year.</p>
                                                </div>
                                                <div>
                                                    <strong className="text-sm">What it shows:</strong>
                                                    <p className="text-xs text-gray-500">The graph uses color coding to represent different sentiment levels (positive, neutral, negative) over the months. Red and orange shades indicate negative sentiments, while green shows positive sentiments.</p>
                                                </div>
                                                <div>
                                                    <strong  className="text-sm">How to read it:</strong>
                                                    <p className="text-xs text-gray-500">Each bar represents a month, with the height showing the volume of reviews and the color indicating the sentiment (red for negative, yellow for neutral, green for positive). This can help you identify trends or patterns in customer feedback and spot months with stronger positive or negative sentiment.</p>
                                                </div>
                                            </div>
                                 </div>
                            </PopoverContent>
                    </Popover>
                  </div>
                 
                  <p className="text-xs hidden md:block !mt-5 text-slate-500"><strong>What it shows:</strong> The graph uses color coding to represent different sentiment levels (positive, neutral, negative) over the months. Red and orange shades indicate negative sentiments, while green shows positive sentiments.</p>

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