import AverageSentiment from "@/components/dashboard/AverageSentiment";
import ResponseRate from "@/components/dashboard/ResponseRate";
import ReviewLengthAnalysis from "@/components/dashboard/ReviewLengthAnalysis";
import ReviewsActiveTime from "@/components/dashboard/ReviewsActiveTime";
import SentimentDistributionGraph from "@/components/dashboard/SentimentDistributionGraph";
import SentimentDistributionOvertime from "@/components/dashboard/SentimentDistributionOvertime";
import TotalReviewsCard from "@/components/dashboard/TotalReviewsCard"
import { useAppContext } from "@/contexts/AuthContext";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";
import { BusinessList, ValidateUserType, WorkspaceList } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
function Home() {
  const location = useLocation();
  const { auth } = useAppContext();
   useEffect(() => {
     initializeGA();
     trackpPageView(location.pathname,auth?.data.email ?? '');
   }, []);
  const queryClient = useQueryClient();
  const validateUser = queryClient.getQueryData<AxiosResponse<{ data: ValidateUserType }>>([ "validateUser" ]);
  const [ activeWorkspace ] = validateUser?.data?.data?.workspaceList.filter(item => item.workspace_id === validateUser?.data?.data?.active_workspace) as WorkspaceList[];
  const [ activeBusiness ] = validateUser?.data?.data?.businessList.filter(item => item.place_id === activeWorkspace.active_business) as BusinessList[];

  if(!activeBusiness?.place_id){
    return (
        <div className="flex flex-col items-center justify-center p-2 flex-1 overflow-hidden">
            <h1 className="text-xl font-semibold">No Business added</h1>
            <p className="text-slate-300">Search or Add your business account</p>
        </div>
    )
   
  }

  return (
    <div className="flex flex-col p-4  gap-3 md:p-2 w-full overflow-y-scroll md:pb-20">
      <TotalReviewsCard placeId={activeBusiness?.place_id}/>

      <div className=" grid grid-cols-1 md:grid-cols-2 gap-5">
        <ReviewLengthAnalysis placeId={activeBusiness?.place_id}/>
        <ReviewsActiveTime placeId={activeBusiness?.place_id}/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SentimentDistributionGraph placeId={activeBusiness.place_id}/>
        <AverageSentiment placeId={activeBusiness?.place_id}/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SentimentDistributionOvertime placeId={activeBusiness?.place_id}/>
        <ResponseRate placeId={activeBusiness?.place_id}/>
      </div>
    </div>
  )
}

export default Home