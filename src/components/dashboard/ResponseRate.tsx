import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { responseRate } from "@/lib/apis";
import { Skeleton } from "../ui/skeleton";

interface Props {
    placeId: string
}

function ResponseRate({ placeId }: Props) {

    const { auth } = useAppContext();

    const { isLoading, isSuccess, data } = useQuery({
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

    if(isSuccess){
        
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
                <CardTitle>Response Rate</CardTitle>
                {/* <CardDescription>January - June 2024</CardDescription> */}
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