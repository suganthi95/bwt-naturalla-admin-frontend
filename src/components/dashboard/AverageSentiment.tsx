import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { avgSentiment } from "@/lib/apis";
import dayjs from "dayjs";
import { Skeleton } from "../ui/skeleton";

interface Props {
    placeId: string
}

function AverageSentiment({ placeId }: Props) {

    const { auth } = useAppContext();

    const { isLoading, isError, isSuccess, data, error } = useQuery({
        queryKey: [ "avgSentiment" ],
        queryFn: () => avgSentiment({
            token: auth?.token as string,
            placeId: placeId,
        }),
        retry: 3,
        refetchOnWindowFocus: true,
        select: (data) => data.data,
        enabled: Boolean(placeId) 
    });

    let content;

    if(!placeId){
        return (
            <div className="flex flex-col items-center justify-center p-2 flex-1 overflow-hidden">
                <h1 className="text-xl font-semibold">No Business added</h1>
                <p className="text-slate-300">Search or Add your business account</p>
            </div>
        )
    }

    if(isLoading){
        content = <Skeleton className="h-[350px] rounded-xl" />
    }

    if(isError){
        content = <p className="mt-[10%] mx-auto text-center text-secondary font-bold">{error?.message}</p>
    }

    if(isSuccess){

        const chartData = data.map((item: any) => ({ month: dayjs(item.timestamp).format("MMM"), sentiment: item.average_sentiment }));

        console.log(chartData)
        
        const chartConfig = {
            sentiment: {
                label: "average sentiment",
                color: "bg-primary",
            },
        } satisfies ChartConfig

        content = (
            <Card>
                <CardHeader>
                <CardTitle>Average Sentiment</CardTitle>
                {/* <CardDescription>January - June 2024</CardDescription> */}
                </CardHeader>
                <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                            left: 20,
                            right: 5
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="sentiment"
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

export default AverageSentiment