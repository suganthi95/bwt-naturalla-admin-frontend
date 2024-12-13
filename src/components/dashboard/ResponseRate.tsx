import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { responseRate } from "@/lib/apis";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Info } from "lucide-react";

interface Props {
    placeId: string
}

function ResponseRate({ placeId }: Props) {

    const { auth } = useAppContext();

    const { isLoading, isSuccess, isError, data } = useQuery({
        queryKey: [ "responseRate" ],
        queryFn: () => responseRate({
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

    if(isError || !Array.isArray(data)){
        content = (
            <Card>
                <CardContent className="h-[350px] flex items-center justify-center">
                    <p className="text-center text-sm text-slate-500">No data found</p>
                </CardContent>
            </Card>
        )
    }

    if(isSuccess && Array.isArray(data)){

        const color = [ "green", "orange", "yellow", "red" ];
        const chartData = data.map((item: any, index: any) => ({ category: item.category, percentage: item.percentage, fill: color[index] }))

        const chartConfig = {
            "Responded Positive": {
              label: "Responded (Positive)",
              color: "yellow",
            },
            "Not Responded Positive": {
              label: "Yet to Respond (Positive)",
              color: "green",
            },
            "Responded Negative": {
              label: "Responded (Negative)",
              color: "orange",
            },
            "Not Responded Negative": {
              label: "Yet to Respond (Negative)",
              color: "red",
            },
        } satisfies ChartConfig

        // const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0)

        content = (
            <Card>
                <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg md:text-balance">Response Rate</CardTitle>
                    <Popover>
                            <PopoverTrigger>
                            <Info className="h-4 w-4 text-gray-500 hover:text-gray-800" />
                            </PopoverTrigger>
                            <PopoverContent className="md:w-[400px] -translate-x-7 md:-translate-x-20"> 
                                            <div className="bg-white rounded-lg  text-justify">
                                                <h3 className="text-md font-semibold mb-2 text-gray-800">Response Rate</h3>
                                                <div className="space-y-2">
                                                    <div>
                                                        <strong className="text-sm">Purpose:</strong>
                                                        <p className="text-xs text-gray-500">This pie chart breaks down the percentage of reviews that have been responded to, categorized by sentiment.</p>
                                                    </div>
                                                    <div>
                                                        <strong className="text-sm">What it shows:</strong>
                                                        <p className="text-xs text-gray-500">The donut chart divides reviews into categories: positive, negative, and not yet responded to, based on whether responses have been made to the reviews.</p>
                                                    </div>
                                                    <div>
                                                        <strong  className="text-sm">How to read it:</strong>
                                                        <p className="text-xs text-gray-500"> The chart shows how many reviews have been responded to (positive, negative, or neutral) and how many are still awaiting a response. This helps you evaluate the effectiveness of your engagement efforts and identify areas where follow-up may be needed.</p>
                                                    </div>
                                                </div>
                                            </div>
                            </PopoverContent>
                    </Popover>

                </div>
                {/* <CardDescription>January - June 2024</CardDescription> */}
                <p className="text-xs  hidden md:block  !mt-5 text-slate-500"><strong>What it shows:</strong>The donut chart divides reviews into categories: positive, negative, and not yet responded to, based on whether responses have been made to the reviews.</p>
                </CardHeader>
                <CardContent>
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
                                        className="fill-muted-foreground"
                                        >
                                            Response Rate
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