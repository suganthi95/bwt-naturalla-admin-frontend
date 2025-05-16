import { Icons } from "@/assets/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Loader from "@/components/ui/Loader";
import { SearchBox } from "@/components/ui/SearchBox"
import { useAppContext } from "@/contexts/AuthContext"
import { getAllBusiness, removeBusiness, setActiveBusiness } from "@/lib/apis"
import { initializeGA, trackEvent, trackpPageView } from "@/lib/google_analytics";
import { GetBusinessType, ValidateUserType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { EllipsisVertical } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

function Business() {
 const location = useLocation();
 const { auth } = useAppContext();

  useEffect(() => {
    initializeGA();
    trackpPageView(location.pathname,auth?.data.email ?? '');
  }, []);
  dayjs.extend(relativeTime);
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData([ "validateUser" ]) as AxiosResponse<{ data: ValidateUserType }>;

  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: [ "getAllBusiness" ],
    queryFn: () => getAllBusiness(auth?.token as string),
    retry: 2,
    refetchOnWindowFocus: false
  });

  const { mutate } = useMutation({
    mutationKey: [ "removeBusiness" ],
    mutationFn: removeBusiness,
    onSuccess: () => {
      toast.success("Request Success", { description: "Business Deleted Successfully" });
      trackEvent('button','click','business removed')
      window.location.reload();

    },
    onError: (error) => console.log(error),
  });


  // set active business
  const { mutate: setActiveBusinessMutate } = useMutation({
      mutationKey: [ "setActiveBusiness" ],
      mutationFn: setActiveBusiness,
      onSuccess: async () => {
          window.location.reload();
      },
      onError: (error: AxiosError<any>) => {
          toast.error("Request Failed", { description: error?.response?.data?.message })
      }
  });

  let content;

  if(isLoading){
    content = <div className="mx-auto mt-[10%]"><Loader/></div>

  }

  if(isError){
    content = <p>{error?.message}</p>
  }

  if(isSuccess && data?.data?.data?.length === 0){
      content = (
        <div className="flex flex-col items-center justify-center p-2 ml-1 mr-2 mb-2 flex-1 overflow-hidden">
          <h1 className="text-xl font-semibold">No Business added</h1>
          <p className="text-slate-300">Search or Add your business account</p>
        </div>
      )
  }

  if(isSuccess && data?.data?.data?.length > 0){
    content = (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
      {data?.data?.data?.map((item: GetBusinessType, index: number) => (
        <Card key={item.place_id + index}>
          <CardHeader>
            <CardTitle className="flex items-center text-secondary justify-between gap-2">
              <div className="border p-2 rounded-full">
                <Icons.googleIcon/>
              </div>

              <div className="flex flex-row items-center gap-2">
                {item.active_business && <Badge className="bg-primary hover:bg-primary">Primary</Badge>}
                {query?.data?.data?.plan_name === "pro-plan" && <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="rounded-full">
                      <EllipsisVertical/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      {!item.active_business && <DropdownMenuItem onClick={() => setActiveBusinessMutate({ place_id: item.place_id, token: auth?.token as string })}>
                        <span>Set Primary Business</span>
                      </DropdownMenuItem>}
                      <DropdownMenuItem onClick={() => mutate({ place_id: item.place_id, email: auth?.data?.email as string, token: auth?.token as string})}>
                        <span>Remove Business</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>}
              </div>
              
            </CardTitle>
            <CardDescription className="flex items-center text-secondary justify-between gap-2">
              <span className="text-xl font-bold mt-3">{item.business_name}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
              <span className="text-sm text-slate-400">{item?.street_number}, {item?.street}, {item?.city}, {item?.zip_code}</span>
              <p className="text-sm text-slate-400">Added {dayjs(item.created_at).fromNow()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
    )

  }

  return (
    <div className="p-3 flex flex-col flex-1 overflow-y-scroll pb-20">
        {query?.data?.data?.plan_name === "pro-plan" && query.data.data.businessList.length < 3 && <SearchBox/>}
        {content}
    </div>
  )
}

export default Business