import ReviewCard from "@/components/reviews/ReviewCard"
import Loader from "@/components/ui/Loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/contexts/AuthContext";
import { getReviews } from "@/lib/apis"
import { ReviewType } from "@/types";
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom";

function Reviews() {

    const { activeBusiness } = useAppContext();

    const { isLoading, isError, isSuccess, data, error } = useQuery({
        queryKey: [ "getReviews" ],
        queryFn: () => getReviews(activeBusiness?.placeId as string),
        refetchInterval: 0,
        retry: 3,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false
    });

    let content;

    if(isLoading){
        content = <Loader/>
    }

    if(isError){
        content = <p>{error?.message}</p>
    }

    if(isSuccess){
        content = data?.data?.map((item : ReviewType) => (
            <Link to="/reviews/generate-response" key={item.review_id} state={item}>
                <ReviewCard {...item}/>
            </Link>
        ))
    }


  return (
    <div className="p-2 border-2 border-slate-200 rounded-xl ml-1 mr-2 mb-2 flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-row items-center justify-between">
            <h1 className="font-semibold">Reviews</h1>
            <Select>
                <SelectTrigger className="w-[100px] h-8">
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="zds">Newest</SelectItem>
                    <SelectItem value="light">Positive</SelectItem>
                    <SelectItem value="dark">Negative</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="py-3 overflow-y-scroll h-full">
            {content}
        </div>
    </div>
  )
}

export default Reviews