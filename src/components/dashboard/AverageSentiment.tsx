import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { avgSentiment } from "@/lib/apis";
import dayjs from "dayjs";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Info, X } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import { Trans } from "react-i18next";

interface Props {
  placeId: string;
}

function AverageSentiment({ placeId }: Props) {

  const { auth } = useAppContext();

  const { isLoading, isSuccess, isError, data } = useQuery({
    queryKey: ["avgSentiment"],
    queryFn: () =>
      avgSentiment({
        token: auth?.token as string,
        placeId: placeId,
        email: auth?.data?.email ?? "",
      }),
    retry: 3,
    refetchOnWindowFocus: true,
    select: (data) => data.data,
    enabled: Boolean(placeId),
  });

  let content;

  if (isLoading) {
    content = <Skeleton className="h-[350px] rounded-xl" />;
  }

  if (isError || data?.length === 0) {
    content = (
      <Card>
        <CardContent className="h-[350px] flex items-center justify-center">
                  <p className="text-center text-sm text-slate-500"><Trans i18nKey={'no_data_found'}/></p>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess && data?.length > 0) {
    const chartData = data
      .filter((item: any) => item.year === 2024)
      .map((item: any) => ({
        month: dayjs(item.date).format("MMM"),
        sentiment: item.average_sentiment_score,
      }));

    const chartConfig = {
      average_sentiment_score: {
        label: "average sentiment",
        color: "bg-primary",
      },
    } satisfies ChartConfig;

    content = (
      <Card>
        <CardHeader>
          <div className="flex items-center  relative justify-between">
            <CardTitle className="text-lg md:text-balance">
             <Trans i18nKey={'averageSentiment.title'}/>
            </CardTitle>
            <Popover>
              <PopoverTrigger>
                <Info
                  className="h-4 w-4 text-primary cursor-pointer "
                
                />
              </PopoverTrigger>
              <PopoverContent className="md:w-[400px] -translate-x-7 md:-translate-x-20">
                <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white flex items-center justify-between w-full">
                              <Trans i18nKey={'averageSentiment.title'}/>

                  <PopoverClose>
                    <X className="w-4 cursor-pointer" />
                  </PopoverClose>
                </h3>
                <div className="space-y-2">
                  <div>
                    <strong className="text-sm"><Trans i18nKey={'purpose'}/></strong>
                    <p className="text-xs text-gray-500 dark:text-slate-300">
                     <Trans i18nKey={'averageSentiment.description1'}/>
                    </p>
                  </div>
                  <div>
                    <strong className="text-sm">  <Trans i18nKey={'what_it_shows'}/></strong>
                    <p className="text-xs text-gray-500 dark:text-slate-300">
                                         <Trans i18nKey={'averageSentiment.description2'}/>

                    </p>
                  </div>
                  <div>
                    <strong className="text-sm"> <Trans i18nKey={'how_to_read_it'}/></strong>
                    <p className="text-xs text-gray-500 dark:text-slate-300">
                      {" "}
                      <Trans i18nKey={'averageSentiment.description3'}/>
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {/* <CardDescription>January - June 2024</CardDescription> */}
          <p className="text-xs  hidden md:block  !mt-5 text-slate-500">
            <strong> <Trans i18nKey={'what_it_shows'}/></strong>
            <Trans i18nKey={'averageSentiment.description1'}/>
          </p>
        </CardHeader>
        <CardContent className="p-0 lg:p-3">
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
                left: 20,
                right: 5,
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
              ></Line>
            </LineChart>
          </ChartContainer>
          <p className="text-center text-sm text-slate-500"><Trans i18nKey={'month'}/></p>
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
    );
  }

  return content;
}

export default AverageSentiment;
