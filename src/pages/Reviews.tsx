import ReviewCard from "@/components/reviews/ReviewCard"
import Loader from "@/components/ui/Loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/contexts/AuthContext";
import { getReviews } from "@/lib/apis"
import { ReviewType } from "@/types";
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom";
import Home from "./Home";
import { useState } from "react";

function Reviews() {

    const { activeBusiness, auth } = useAppContext();
    const [ sortKey, setSortKey ] = useState<string>("newest");

    const { isLoading, isError, isSuccess, data, error, isRefetching } = useQuery({
        queryKey: [ "getReviews", sortKey ],
        queryFn: () => getReviews({
            placeId: activeBusiness?.placeId as string,
            sort: sortKey,
            token: auth?.token as string
        }),
        retry: 3,
        refetchOnWindowFocus: false,
        enabled: Boolean(activeBusiness?.placeId)
    });

    console.log(isRefetching)

    if(!activeBusiness){
        return <Home/>
    }

    let content;

    if(isLoading){
        content = <Loader/>
    }

    if(isRefetching){
        content = <Loader/>
    }

    if(isError){
        content = <p className="mt-[10%] mx-auto text-center text-secondary font-bold">{error?.message}</p>
    }

    if(isSuccess && data?.data?.data.length === 0 && !isRefetching){
        content = <p className="mt-[10%] mx-auto text-center text-secondary font-bold">There are no reviews at this time.</p>
    }

    if(isSuccess && data?.data?.data.length > 0 && !isRefetching){
        content = data?.data?.data?.map((item : ReviewType) => (
            <Link to="/reviews/generate-response" key={item.review_id} state={item}>
                <ReviewCard {...item}/>
            </Link>
        ))
    }


  return (
    <div className="p-2 border-2 border-slate-200 rounded-xl ml-1 mr-2 mb-2 flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-row items-center justify-between py-1">
            <h1 className="font-semibold">Reviews</h1>
            <Select value={sortKey} onValueChange={(value) => setSortKey(value)}>
                <SelectTrigger className="w-[100px] h-8">
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="highest_rating">Positive</SelectItem>
                    <SelectItem value="lowest_rating">Negative</SelectItem>
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