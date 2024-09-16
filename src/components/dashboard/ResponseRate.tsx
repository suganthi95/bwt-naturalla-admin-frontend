import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { responseRate } from "@/lib/apis";
import { Skeleton } from "../ui/skeleton";
import { useMemo } from "react";

interface Props {
    placeId: string
}

function ResponseRate({ placeId }: Props) {

    const { auth } = useAppContext();

    const { isLoading, isSuccess } = useQuery({
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
        
        const chartData = [
            { browser: "chrome", visitors: 275, fill: "yellow" },
            { browser: "safari", visitors: 200, fill: "orange" },
            { browser: "firefox", visitors: 287, fill: "green" },
            { browser: "edge", visitors: 173, fill: "red" },
            { browser: "other", visitors: 190, fill: "blue" },
        ];

        const chartConfig = {
            visitors: {
              label: "Visitors",
            },
            chrome: {
              label: "Chrome",
              color: "yellow",
            },
            safari: {
              label: "Safari",
              color: "orange",
            },
            firefox: {
              label: "Firefox",
              color: "green",
            },
            edge: {
              label: "Edge",
              color: "red",
            },
            other: {
              label: "Other",
              color: "blue",
            },
        } satisfies ChartConfig

        const totalVisitors = useMemo(() => {
            return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
        }, [])

        content = (
            <Card>
                <CardHeader>
                <CardTitle>Response Rate</CardTitle>
                {/* <CardDescription>January - June 2024</CardDescription> */}
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
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
                                        <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-3xl font-bold"
                                        >
                                        {totalVisitors.toLocaleString()}
                                        </tspan>
                                        <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground"
                                        >
                                        Visitors
                                        </tspan>
                                    </text>
                                    )
                                }
                                }}
                            />
                            </Pie>
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