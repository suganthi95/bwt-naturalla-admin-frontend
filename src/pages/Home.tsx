import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CircleAlert, CircleCheck, Star, Zap } from "lucide-react"
import { Bar, BarChart, XAxis } from "recharts"

function Home() {

  const chartData = [
    { date: "Jan", credits: 450, creditsLeft: 300 },
    { date: "Feb", credits: 380, creditsLeft: 420 },
    { date: "Mar", credits: 520, creditsLeft: 120 },
    { date: "Apr", credits: 140, creditsLeft: 550 },
    { date: "May", credits: 600, creditsLeft: 350 },
    { date: "Jun", credits: 700, creditsLeft: 421 },
    { date: "Jul", credits: 550, creditsLeft: 563 },
    { date: "Aug", credits: 200, creditsLeft: 123 },
    { date: "Sept", credits: 670, creditsLeft: 852 },
    { date: "Oct", credits: 285, creditsLeft: 896 },
    { date: "Nov", credits: 654, creditsLeft: 236 },
    { date: "Dec", credits: 289, creditsLeft: 789 },
  ]
  const chartConfig = {
    credits: {
      label: "credits spent",
      color: "bg-primary",
    },
    creditsLeft: {
      label: "credits left",
      color: "bg-sandal",
    },
  } satisfies ChartConfig

  return (
    <div className="flex flex-col gap-3 p-2 border border-slate-200 w-full h-fit">
      <div className="grid grid-cols-4 gap-5">
          <Card className="p-3 rounded-xl">
              <div className="flex flex-row items-center justify-between">
                <h1 className="text-sm font-medium text-slate-500">Total Reviews</h1>
                <Star strokeWidth={0.5} className="h-5 w-5 stroke-none fill-yellow-400"/>
              </div>
              <p className="text-2xl text-secondary font-bold mt-8">846</p>
          </Card>
          <Card className="p-3 rounded-xl">
              <div className="flex flex-row items-center justify-between">
                <h1 className="text-sm font-medium text-slate-500">Credits Used</h1>
                <Zap className="stroke-transparent fill-primary h-5 w-5" />
              </div>
              <p className="text-2xl text-secondary font-bold mt-8">59 / 100</p>
          </Card>
          <Card className="p-3 rounded-xl">
              <div className="flex flex-row items-center justify-between">
                <h1 className="text-sm font-medium text-slate-500">Responded</h1>
                <CircleCheck className="h-5 w-5 stroke-white fill-green-400" />
              </div>
              <p className="text-2xl text-secondary font-bold mt-8">576</p>
          </Card>
          <Card className="p-3 rounded-xl">
              <div className="flex flex-row items-center justify-between">
                <h1 className="text-sm font-medium text-slate-500">Yet to Respond</h1>
                <CircleAlert className="h-5 w-5 stroke-white fill-red-400" />
              </div>
              <p className="text-2xl text-secondary font-bold mt-8">300</p>
          </Card>
          
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Spendings</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    return value
                  }}
                />
                <Bar
                  dataKey="credits"
                  stackId="a"
                  fill="#FF840F"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="creditsLeft"
                  stackId="a"
                  fill="#F7EFE8"
                  radius={[4, 4, 0, 0]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name, item, index) => (
                        <>
                          <div
                            className={`h-2.5 w-2.5 shrink-0 rounded-[2px] ${chartConfig[name as keyof typeof chartConfig]?.color}`}
                          />
                          {chartConfig[name as keyof typeof chartConfig]?.label ||
                            name}
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {value}
                            <span className="font-normal text-muted-foreground">
                              cr
                            </span>
                          </div>
                          {/* Add this after the last item */}
                          {index === 1 && (
                            <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                              Total
                              <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                {item.payload.credits + item.payload.creditsLeft}
                                <span className="font-normal text-muted-foreground">
                                  cr
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    />
                  }
                  cursor={false}
                  defaultIndex={1}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Home