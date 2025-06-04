import { ASSETS } from "@/assets/assets";
import { Icons } from "@/assets/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

function Business() {
 const location = useLocation();
 const { auth } = useAppContext();
const [IsOpen,setIsOpen] = useState(false)
  const [businessLoading,setBusinessLoading] = useState(false)

  useEffect(() => {
    initializeGA();
    trackpPageView(location.pathname,auth?.data?.email ?? '');
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
      const messages = [
        <p className="text-slate-500 text-center" key={0}>
            <span className="text-primary"><Trans i18nKey="tip" />: </span>
            <Trans i18nKey="messages.0" />
        </p>,
        <p className="text-slate-500 text-center" key={1}>
            <span className="text-primary"><Trans i18nKey="pro_tip" />: </span>
            <Trans i18nKey="messages.1" />
        </p>,
        <p className="text-slate-500 text-center" key={2}>
            <span className="text-primary"><Trans i18nKey="quick_tip" />: </span>
            <Trans i18nKey="messages.2" />
        </p>,
        <p className="text-slate-500 text-center" key={3}>
            <span className="text-primary"><Trans i18nKey="tip" />: </span>
            <Trans i18nKey="messages.3" />
        </p>,
        <p className="text-slate-500 text-center" key={4}>
            <span className="text-primary"><Trans i18nKey="pro_tip" />: </span>
            <Trans i18nKey="messages.4" />
        </p>,
        <p className="text-slate-500 text-center" key={5}>
            <span className="text-primary"><Trans i18nKey="quick_tip" />: </span>
            <Trans i18nKey="messages.5" />
        </p>,
        <p className="text-slate-500 text-center" key={6}>
            <span className="text-primary"><Trans i18nKey="did_you_know" />: </span>
            <Trans i18nKey="messages.6" />
        </p>,
        <p className="text-slate-500 text-center" key={7}>
            <span className="text-primary"><Trans i18nKey="pro_tip" />: </span>
            <Trans i18nKey="messages.7" />
        </p>
        ];
    
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, 15000); // Change every 15 seconds
  
      return () => clearInterval(interval);
    }, []);

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
  if(businessLoading){
       return (
           <div className="h-screen flex items-center justify-center flex-col gap-3 w-full fixed top-0 left-0 z-[50] bg-transparent backdrop-brightness-[0.3]">
               <div>
                   <Loader/>
               </div>
               {messages[currentMessageIndex]}
           </div>
     )
}

  let content;

  if(isLoading){
    content = <div className="mx-auto mt-[10%]"><Loader/></div>

  }

  if(isError){
    content = <p>{error?.message}</p>
  }

  if(isSuccess && data?.data?.data?.length === 0){
      content = (
       <section className="container mx-auto mt-10 grid place-items-center">
            <div className="flex flex-col gap-y-1 items-center justify-center text-[#323232]">
              <img src={ASSETS.NO_BUSINESS} className="md:w-5/12" alt="No-Business" />
              <h2 className="font-bold text-xl md:text-2xl "><Trans i18nKey={'no_business_found'}/></h2>
              <p className="font-medium text-center text-xs md:text-sm text-[#323232]/50">
              <Trans i18nKey={'add_business_to_start'}/>
              </p>
              <p className="font-medium  text-center  text-xs md:text-sm text-[#323232]/50">
                <Trans i18nKey={'see_feedback_after_setup'}/>
                </p>
              <Button onClick={()=>setIsOpen(true)} className="bg-primary mt-3 md:p-3 md:px-6 rounded-lg hover:bg-primary">
                <Trans i18nKey={"add_business"} />
              </Button>
             
            </div>
          </section>
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
                {item.active_business && <Badge className="bg-primary hover:bg-primary"><Trans i18nKey={'primary'}/></Badge>}
                {query?.data?.data?.plan_name === "pro-plan" && <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="rounded-full">
                      <EllipsisVertical/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      {!item.active_business && <DropdownMenuItem onClick={() => setActiveBusinessMutate({ place_id: item.place_id, token: auth?.token as string })}>
                        <span><Trans i18nKey={'setPrimaryBusiness'}/></span>
                      </DropdownMenuItem>}
                      <DropdownMenuItem onClick={() => mutate({ place_id: item.place_id, email: auth?.data?.email as string, token: auth?.token as string})}>
                        <span><Trans i18nKey={'removeBusiness'}/></span>
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
              <p className="text-sm text-slate-400"><Trans i18nKey={'added'}/> {dayjs(item.created_at).fromNow()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
    )

  }

  return (
    <div className="p-3 flex flex-col flex-1 overflow-y-scroll pb-20">
        {query?.data?.data?.plan_name === "pro-plan" && query.data.data.businessList.length < 3 && <SearchBox onClose={setIsOpen} isWaiting={setIsOpen}/>}
        {content}
          <Dialog open={IsOpen} onOpenChange={setIsOpen}> 
          
            <DialogContent className="!w-full max-w-fit">
              <SearchBox onClose={setIsOpen} isWaiting={setBusinessLoading} />
            </DialogContent>
          </Dialog>
    </div>
  )
}

export default Business