import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { reviewLenAnalysis } from "@/lib/apis";
import { Skeleton } from "../ui/skeleton";

interface Props {
    placeId: string
}

function ReviewLengthAnalysis({ placeId }: Props) {

    const { auth } = useAppContext();

    const { isLoading, isSuccess, isError, data } = useQuery({
        queryKey: [ "ReviewLenAnalysis" ],
        queryFn: () => reviewLenAnalysis({
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

    if(isError || data?.length === 0){
        content = (
            <Card>
                <CardContent className="h-[350px] flex items-center justify-center">
                    <p className="text-center text-sm text-slate-500">No data found</p>
                </CardContent>
            </Card>
        )
    }

    if(isSuccess){
        
        const chartConfig = {
            positive_reviews: {
                label: "positive reviews",
                color: "bg-primary",
            },
            negative_reviews: {
                label: "negative reviews",
                color: "red",
            },
        } satisfies ChartConfig
        
        content = (
            <Card>
                <CardHeader>
                    <CardTitle>Review Length Analysis</CardTitle>
                </CardHeader>
                <CardContent>
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
                <p className="text-center text-sm text-slate-500">Review length range</p>
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