import ReviewCard from "@/components/reviews/ReviewCard"
import Loader from "@/components/ui/Loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getReviews } from "@/lib/apis"
import { ReviewType } from "@/types";
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom";

function Reviews() {

    const { isLoading, isError, isSuccess, data, error } = useQuery({
        queryKey: [ "getReviews" ],
        queryFn: () => getReviews("ChIJzzO1xiQVrjsRhgWW90MYXak"),
        retry: 3,
        refetchOnWindowFocus: false
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
    <div className="p-2 pb-5 border-2 border-slate-200 rounded-xl ml-1 mr-2 h-[89.5%] overflow-hidden">
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