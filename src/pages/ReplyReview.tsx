import ResponseCard from "@/components/reviews/ResponseCard";
import ReviewCard from "@/components/reviews/ReviewCard"
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/contexts/AuthContext";
import { getSuggestions } from "@/lib/apis";
import { ReviewType } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function ReplyReview() {


    const { state }: { state: ReviewType } = useLocation();
    const [ generate, setGenerate ] = useState<number>(0);
    const queryClient = useQueryClient();
    const { auth } = useAppContext();

    const { isLoading, isSuccess, isError, data, error } = useQuery({
      queryKey: [ "getSuggestions", generate ],
      queryFn: () => getSuggestions({
          prompt: state.review_text,
          token: auth?.token
      }),
      retry: 3,
      refetchOnWindowFocus: false,
      gcTime: 0,
      enabled: Boolean(generate)
    });

    let content;

    if(isLoading){
      content = <div className="mt-[10%]">
        <Loader/>
      </div>
    }

    if(isError){
      content = <p>{error?.message}</p>
    }

    if(isSuccess){
      queryClient.invalidateQueries({ queryKey: [ "validateUser" ] })
      content = <ResponseCard {...data?.data?.data}/>
    }


  return (
    <div className="p-2 flex flex-1 flex-col relative">
        <div className="flex flex-row items-center justify-between">
            <h1 className="font-semibold">Suggestions</h1>
            <Button disabled={isLoading} onClick={() => setGenerate(prev => prev + 1)} className="bg-gradient-to-r from-[#CD84F1] to-[#7158E2]">{isSuccess ? "Regenerate" : "Generate"}</Button>
        </div>

        <div className="pt-1 flex flex-col flex-1 justify-between">
            <ReviewCard {...state}/>
            <div>
              {content}
            </div>
            <div className="flex flex-row items-center gap-2 border-2 border-slate-200 rounded-md px-2 py-1">
              <Textarea className="h-14 border-none focus-visible:ring-none focus-visible:ring-transparent focus-visible:ring-offset-none" />
              <div className="h-10 w-[1px] bg-slate-200"></div>
              <Button size="icon" className="bg-secondary hover:bg-secondary/90">
                <Send />
              </Button>
            </div>
        </div>
          
    </div>
  )
}

export default ReplyReview