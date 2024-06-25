import ResponseCard from "@/components/reviews/ResponseCard";
import ReviewCard from "@/components/reviews/ReviewCard"
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

function ReplyReview() {

    const { state } = useLocation();

  return (
    <div className="p-2 pb-5 border-2 border-slate-200 rounded-xl ml-1 mr-2 h-[89.5%] overflow-hidden">
        <div className="flex flex-row items-center justify-between">
            <h1 className="font-semibold">Suggestions</h1>
            <Button className="bg-gradient-to-r from-[#CD84F1] to-[#7158E2]">Generate</Button>
        </div>

        <div className="py-3 overflow-y-scroll h-full">
            <ReviewCard {...state}/>
            <ResponseCard/>
        </div>
    </div>
  )
}

export default ReplyReview