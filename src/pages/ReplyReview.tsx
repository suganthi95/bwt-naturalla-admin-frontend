import ResponseCard from "@/components/reviews/ResponseCard";
import ReviewCard from "@/components/reviews/ReviewCard"
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppContext } from "@/contexts/AuthContext";
import { getReviewById, getSuggestions } from "@/lib/apis";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";
import { ValidateUserType } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

function ReplyReview() {
  const location = useLocation();
  const user = localStorage.getItem("auth");
  const parsedUser = user ? JSON.parse(user) : null;
  const Mail = parsedUser?.data?.email;
   useEffect(() => {
     initializeGA();
     trackpPageView(location.pathname,Mail);
   }, []);

    const { state }: { state: { placeId: string, reviewId: string } } = useLocation();

    const navigate = useNavigate();
    const [ generate, setGenerate ] = useState<number>(0);
    const { auth } = useAppContext();

    const queryClient = useQueryClient();
    const query = queryClient.getQueryData([ "validateUser" ]) as AxiosResponse<{ data: ValidateUserType }>;

    const { isLoading: isReviewLoading, isSuccess: isReviewSuccess, isError: isReviewError, data: reviewData } = useQuery({
      queryKey: [ "getReviewById", state.placeId, state.reviewId ],
      queryFn: () => getReviewById({
        token: auth?.token as string,
        placeId: state.placeId,
        reviewId: state.reviewId
      }),
      select: (data) => data?.data,
      retry: 3,
      refetchOnWindowFocus: false,
    });

    const { isLoading, isSuccess, isError, data, error } = useQuery({
      queryKey: [ "getSuggestions", generate ],
      queryFn: () => getSuggestions({
          prompt: reviewData?.review_text,
          username: reviewData?.author_title,
          token: auth?.token
      }),
      retry: 3,
      refetchOnWindowFocus: false,
      gcTime: 0,
      enabled: Boolean(generate) && isReviewSuccess
    });

    useEffect(() => {
      if(isSuccess){
        queryClient.invalidateQueries({ queryKey: [ "validateUser" ] });
      }
    }, [isSuccess])

    let content;

    if(isLoading || isReviewLoading){
      content = <div className="mt-[10%]">
        <Loader/>
      </div>
    }

    if(isError || isReviewError){
      content = <p>{error?.message}</p>
    }

    if(isSuccess){
      content = <ResponseCard {...data?.data} reviewData={reviewData}/>
    }

  return (
    <div className="p-2 flex flex-1 h-full overflow-y-scroll flex-col  relative">
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <Button onClick={() => navigate(-1)} title="Go Back" className="h-6 w-6" variant="secondary" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
              <h1 className="font-semibold"><Trans i18nKey={'suggestions'}/></h1>
            </div>
            {[ undefined, null, 0 ].includes(query.data.data.remaining_credits) ?
              <Popover>
                <PopoverTrigger>
                  <Button className="bg-gradient-to-r from-[#CD84F1] to-[#7158E2]">{isSuccess ? <Trans i18nKey={'regenerate'}/> : <Trans i18nKey={'generate'}/>}</Button>
                </PopoverTrigger>
                <PopoverContent className="text-sm bg-red-400 text-white"><Trans i18nKey={'out_of_credits'}/></PopoverContent>
              </Popover> :
              <Button disabled={isLoading} onClick={() => setGenerate(prev => prev + 1)} className="bg-gradient-to-r from-[#CD84F1] to-[#7158E2]">{isSuccess ? <Trans i18nKey={'regenerate'}/> : <Trans i18nKey={'generate'}/>}</Button>
            }
            
        </div>

        <div className="pt-1  overflow-y-auto flex flex-col flex-1">
            {isReviewSuccess && <ReviewCard {...reviewData}/>}
            <div>
              {content}
            </div>
            {/* <div className="flex flex-row items-center gap-2 border-2 border-slate-200 rounded-md px-2 py-1">
              <Textarea className="h-14 border-none focus-visible:ring-none focus-visible:ring-transparent focus-visible:ring-offset-none" />
              <div className="h-10 w-[1px] bg-slate-200"></div>
              <Button size="icon" className="bg-secondary hover:bg-secondary/90">
                <Send />
              </Button>
            </div> */}
        </div>
          
    </div>
  )
}

export default ReplyReview