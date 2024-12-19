import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { reviewActiveTime } from "@/lib/apis";
import { Skeleton } from "../ui/skeleton";
import Chart from "react-apexcharts"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Info } from "lucide-react";

interface Props {
    placeId: string
}

function ReviewsActiveTime({ placeId }: Props) {

    const { auth } = useAppContext();

    const { isLoading, isSuccess, isError, data } = useQuery({
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
              },
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg md:text-balance">Reviews Active Time</CardTitle>
                    <Popover>
                      <PopoverTrigger>
                      <Info className="h-4 w-4 text-primary " />
                      </PopoverTrigger>
                      <PopoverContent className="md:w-[400px] -translate-x-7 md:-translate-x-20">
                            <div  className="bg-white rounded-lg dark:bg-slate-700  text-justify   " >
                                <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white">Reviews Active Time</h3>
                                <div className="space-y-2">
                                    <div>
                                        <strong className="text-sm">What it shows:</strong>
                                        <p className="text-xs text-gray-500 dark:text-slate-300">This heatmap tracks the times of day and days of the week when most reviews are submitted, helping you understand your audience’s activity patterns.</p>
                                    </div>
                                      <div>
                                          <strong className="text-sm">What it shows:</strong>
                                          <p className="text-xs text-gray-500 dark:text-slate-300">The chart tracks review activity by hour and day, with colors indicating the number of reviews submitted at each time.</p>
                                      </div>
                                      <div>
                                          <strong  className="text-sm">How to read it:</strong>
                                          <p className="text-xs text-gray-500 dark:text-slate-300"> Each cell shows the number of reviews submitted during a specific hour on a specific day, with color intensity indicating the frequency. It can help you identify peak times for feedback and plan when to engage with customers for better responses.</p>
                                      </div>
                                </div>
                            </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <p className="text-xs  hidden md:block  !mt-5 text-slate-500"><strong>What it shows:</strong> The chart tracks review activity by hour and day, with colors indicating the number of reviews submitted at each time.</p>
                </CardHeader>
                <CardContent className="p-0 lg:p-3">
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