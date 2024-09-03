import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Loader from "@/components/ui/Loader"
import { useAppContext } from "@/contexts/AuthContext"
import { getDashboard } from "@/lib/apis"
import { BusinessList, DashboardDataType, ValidateUserType, WorkspaceList } from "@/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { CircleAlert, CircleCheck, Star, Zap } from "lucide-react"
import { Bar, BarChart, XAxis } from "recharts"
import { v4 as uuid } from "uuid";
// import {
//   TableauViz,
//   TableauEventType,
// } from 'https://my-server/javascripts/api/tableau.embedding.3.latest.min.js';

function Home() {

  const { auth } = useAppContext();
  const queryClient = useQueryClient();
  const validateUser = queryClient.getQueryData<AxiosResponse<{ data: ValidateUserType }>>([ "validateUser" ]);
  const [ activeWorkspace ] = validateUser?.data?.data?.workspaceList.filter(item => item.workspace_id === validateUser?.data?.data?.active_workspace) as WorkspaceList[];
  const [ activeBusiness ] = validateUser?.data?.data?.businessList.filter(item => item.place_id === activeWorkspace.active_business) as BusinessList[];

  const { isLoading, isError, isSuccess, data, error } = useQuery({
    queryKey: [ "getDashboard" ],
    queryFn: () => getDashboard({
      token: auth?.token as string,
      placeId: activeBusiness.place_id,
      sessionToken: uuid()
    }),
    retry: 3,
    refetchOnWindowFocus: true,
    select: (data): DashboardDataType => data.data.data,
    enabled: Boolean(activeBusiness?.place_id) 
  });

  let content;

  if(!activeBusiness?.place_id){
    return (
        <div className="flex flex-col items-center justify-center p-2 flex-1 overflow-hidden">
            <h1 className="text-xl font-semibold">No Business added</h1>
            <p className="text-slate-300">Search or Add your business account</p>
        </div>
    )
  }

  if(isLoading){
    content = <Loader/>
  }

  if(isError){
    content = <p className="mt-[10%] mx-auto text-center text-secondary font-bold">{error?.message}</p>
  }

  if(isSuccess){

    const chartData = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec" ].map(item => ({ date: item, credits: data?.chartData["2024"]?.[item]?.credits_used }));

    const chartConfig = {
      credits: {
        label: "credits spent",
        color: "bg-primary",
      },
      // creditsLeft: {
      //   label: "credits left",
      //   color: "bg-sandal",
      // },
    } satisfies ChartConfig

    content = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Card className="p-3 rounded-xl">
              <div className="flex flex-row items-center justify-between">
                <h1 className="text-sm font-medium text-slate-500">Total Reviews</h1>
                <Star strokeWidth={0.5} className="h-5 w-5 stroke-none fill-yellow-400"/>
              </div>
              <p className="text-2xl text-secondary font-bold mt-8">{data.totalRatings}</p>
          </Card>
          <Card className="p-3 rounded-xl">
              <div className="flex flex-row items-center justify-between">
                <h1 className="text-sm font-medium text-slate-500">Credits Remaining</h1>
                <Zap className="stroke-transparent fill-primary h-5 w-5" />
              </div>
              <p className="text-2xl text-secondary font-bold mt-8">{data.credits} / {data.total_credits}</p>
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
        <div className="pb-20">
          <Card>
            <CardHeader>
              <CardTitle>Spendings</CardTitle>
            </CardHeader>
            <CardContent className="pb-20">
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
                  {/* <Bar
                    dataKey="creditsLeft"
                    stackId="a"
                    fill="#F7EFE8"
                    radius={[4, 4, 0, 0]}
                  /> */}
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
                              name}:
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              {value}
                            </div>
                            {/* Add this after the last item */}
                            {index === 1 && (
                              <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                                Total
                                <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                  {item.payload.credits}
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
      </>
    )
  }

  console.log(content)

  // useEffect(() => {
  //   var divElement = document.getElementById('viz1725260367225') as HTMLDivElement;                    
  //   var vizElement = divElement.getElementsByTagName('object')[0] as any;                    
  //   if ( divElement.offsetWidth > 800 ) { 
  //     vizElement.style.width='100%';
  //     vizElement.style.height= "100%";
  //   } else if ( divElement.offsetWidth > 500 ) { 
  //     vizElement.style.width='100%';
  //     vizElement.style.height="100%";
  //   } else { 
  //     vizElement.style.width='100%';
  //     vizElement.style.height='2177px';
  //   }                     
    
  //   var scriptElement = document.createElement('script') as HTMLScriptElement;                    
  //   scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    
  //   vizElement.parentNode.insertBefore(scriptElement, vizElement); 
  // }, []);

  // var vizList = ["http://public.tableau.com/views/RegionalSampleWorkbook/Flights",
  //   "http://public.tableau.com/views/RegionalSampleWorkbook/Obesity",
  //   "http://public.tableau.com/views/RegionalSampleWorkbook/College",
  //   "http://public.tableau.com/views/RegionalSampleWorkbook/Stocks",
  //   "http://public.tableau.com/views/RegionalSampleWorkbook/Storms"];

  // var viz: any,
  //     vizLen = vizList.length,
  //     vizCount = 0;

  // function createViz(vizPlusMinus: number) {
  //     var vizDiv = document.getElementById("vizContainer") as HTMLDivElement,
  //     options = {
  //         hideTabs: true
  //     };

  //     vizCount = vizCount + vizPlusMinus;

  //     if (vizCount >= vizLen) {
  //     // Keep the vizCount in the bounds of the array index.
  //         vizCount = 0;
  //     } else if (vizCount < 0) {
  //         vizCount = vizLen - 1;
  //     }

  //     if (viz) { // If a viz object exists, delete it.
  //         viz.dispose();
  //     }

  //     var vizURL = vizList[vizCount];
  //     viz = new window.tableau.Viz(vizDiv, vizURL, options);
  // } 

  // useEffect(() => {
  //   createViz(0);
  // }, [])

  // useEffect(() => {
  //   const viz = new TableauViz();

  //   viz.src = 'https://my-server/views/my-workbook/my-view';
  //   viz.toolbar = 'hidden';
  //   viz.addEventListener(TableauEventType.MarkSelectionChanged, () => {});

  //   document.getElementById('tableauViz').appendChild(viz);
  // }, [])
  


  return (
    <div className="flex flex-col flex-1 gap-3 p-2 w-full h-full pb-52">
      {content}
      {/* <div className='relative' id='viz1725260367225'><noscript>
        <a href='#'>
          <img 
            alt='Overall Dashboard ' 
            src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Ho&#47;HolidayInnYanbu_reviewsDashboard_17252603375630&#47;OverallDashboard&#47;1_rss.png' 
            className="border-none" 
          />
        </a>
        </noscript>
          <object className='tableauViz hidden'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='HolidayInnYanbu_reviewsDashboard_17252603375630&#47;OverallDashboard' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Ho&#47;HolidayInnYanbu_reviewsDashboard_17252603375630&#47;OverallDashboard&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en-GB' /><param name='filter' value='publish=yes' /></object>
      </div> */}

      {/* <div id="vizContainer" className="w-[800px] h-[700px]"></div>
      <div id="controls" className="p-[20px]">
          <Button className="w-[100px]" onClick={() => createViz(-1)}>Previous</Button>
          <Button className="w-[100px]" onClick={() => createViz(1)}>Next</Button>
      </div> */}
      {/* <tableau-viz id="tableauViz"       
        src='https://public.tableau.com/views/Superstore_embedded_800x800/Overview'      
        toolbar="bottom" hide-tabs>
      </tableau-viz> */}

        {/* <TableauReport
          url="https://public.tableau.com/app/profile/lavanya.seetharaman/viz/HolidayInnYanbu_reviewsDashboard_17252603375630/OverallDashboard"
          filters={filters}
          options={options} // vizCreate options
          // Overwrite default query params
          // defaults to '?:embed=yes&:comments=no&:toolbar=yes&:refresh=yes'
          query="?:embed=yes&:comments=no&:toolbar=yes&:refresh=yes"
        /> */}
    </div>
  )
}

export default Home