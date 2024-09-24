import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { reviewActiveTime } from "@/lib/apis";
import { Skeleton } from "../ui/skeleton";
import Chart from "react-apexcharts"

interface Props {
    placeId: string
}

function ReviewsActiveTime({ placeId }: Props) {

    const { auth } = useAppContext();

    const { isLoading, isSuccess, data } = useQuery({
        queryKey: [ "reviewActiveTime" ],
        queryFn: () => reviewActiveTime({
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

        const dataSeries = (arr: any, weekday: number) => arr.filter((item: any) => item.day_of_week === weekday).sort((a: any, b: any) => a.hour_of_day - b.hour_of_day).map((item: any) => item.review_count);

        const state = {
            options: {
              chart: {
                id: "basic-bar",
                toolbar: {
                  show: false,
                },
              },
              xaxis: {
                categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
              }
            },
            series: [
              {
                name: "Sun",
                data: dataSeries(data, 0)
              },
              {
                name: "Mon",
                data: dataSeries(data, 1)
              },
              {
                name: "Tue",
                data: dataSeries(data, 2)
              },
              {
                name: "Wed",
                data: dataSeries(data, 3)
              },
              {
                name: "Thu",
                data: dataSeries(data, 4)
              },
              {
                name: "Fri",
                data:  dataSeries(data, 5)
              },
              {
                name: "Sat",
                data:  dataSeries(data, 6)
              },
            ]
        };

        content = (
            <Card>
                <CardHeader>
                <CardTitle>Reviews Active Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <Chart
                        options={state.options}
                        series={state.series}
                        type="heatmap"
                    />
                    <p className="text-center text-sm -mt-5 text-slate-500">hours</p>
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

export default ReviewsActiveTime