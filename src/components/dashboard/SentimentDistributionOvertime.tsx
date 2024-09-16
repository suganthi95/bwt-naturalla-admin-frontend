import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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
        
        const chartConfig = {
            nameY: {
                label: "sentiment distribution",
                color: "bg-primary",
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
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 20,
                            left: 20,
                            right: 5
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="nameX"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            // tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="nameY"
                            type="natural"
                            stroke="orange"
                            strokeWidth={2}
                            dot={false}
                        >
                        </Line>
                    </LineChart>
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

export default SentimentDistributionOvertime