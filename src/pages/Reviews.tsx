import ReviewCard from "@/components/reviews/ReviewCard"
import Loader from "@/components/ui/Loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/contexts/AuthContext";
import { getReviews } from "@/lib/apis"
import { BusinessList, ReviewType, ValidateUserType, WorkspaceList } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosResponse } from "axios";

function Reviews() {

    const { auth } = useAppContext();
    const [ sortKey, setSortKey ] = useState<string>("newest");
    const queryClient = useQueryClient();
    const validateUser = queryClient.getQueryData<AxiosResponse<{ data: ValidateUserType }>>([ "validateUser" ]);
    const [ activeWorkspace ] = validateUser?.data?.data?.workspaceList.filter(item => item.workspace_id === validateUser?.data?.data?.active_workspace) as WorkspaceList[];
    const [ activeBusiness ] = validateUser?.data?.data?.businessList.filter(item => item.place_id === activeWorkspace.active_business) as BusinessList[];

    const [ actualData, setActualData ] = useState<ReviewType[]>([]);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [ page, setPage ] = useState(1);

    useEffect(() => {
      queryClient.cancelQueries({ queryKey: [ "getReviews" ] });
      setPage(1);
      setActualData([]);
    }, [ sortKey ])
    
    const { isLoading, isError, isSuccess, data, error, isRefetching, refetch } = useQuery({
        queryKey: [ "getReviews", sortKey, activeBusiness?.place_id ],
        queryFn: ({ signal }) => getReviews({
          placeId: activeBusiness?.place_id,
          sort: sortKey,
          page: page,
          token: auth?.token as string,
          signal
        }),
        retry: 3,
        gcTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        refetchOnReconnect: false,
        enabled: Boolean(activeBusiness?.place_id),
    });

    useEffect(() => {
      if(Array.isArray(data?.data?.data)){
        setActualData(prev => [ ...prev, ...data?.data?.data ]);
      }
    }, [data?.data?.data]);


    if(!activeBusiness){
      return (
          <div className="flex flex-col items-center justify-center p-2 flex-1 overflow-hidden">
              <h1 className="text-xl font-semibold">No Business added</h1>
              <p className="text-slate-300">Search or Add your business account</p>
          </div>
      )
    }

    let content;

    if(isLoading && !isRefetching){
        content = (
          <div className="flex flex-col items-center justify-center fixed bottom-0 gap-2 ">
            <Loader/>
            <h1 className="font-semibold text-secondary text-xl">Loading more reviews</h1>
            <p className="text-sm text-slate-400">We're fetching more reviews for you</p>
          </div>
        )
    }

    if(isError){
      content = <p className="mt-[10%] mx-auto text-center text-secondary font-bold">{error?.message}</p>
    }

    if(isSuccess && actualData.length === 0 && sortKey === "newest"){
      content = <p className="mt-[10%] mx-auto text-center text-secondary font-bold">There are no new reviews found.</p>
    }

    if(isSuccess && actualData.length === 0 && sortKey === "highest_rating"){
      content = <p className="mt-[10%] mx-auto text-center text-secondary font-bold">There are no positive reviews found.</p>
    }

    if(isSuccess && actualData.length === 0 && sortKey === "lowest_rating"){
      content = <p className="mt-[10%] mx-auto text-center text-secondary font-bold">There are no negative reviews found.</p>
    }

    if(isSuccess && actualData.length > 0){
      content = actualData?.map((item : ReviewType) => (
        <Link to="/reviews/generate-response" key={item.review_id} state={{ placeId: activeBusiness.place_id, reviewId: item.review_id }}>
          <ReviewCard {...item}/>
        </Link>
      ))
    }

    const handleScroll = useCallback(() => {
      const container = scrollContainerRef.current;
      if (container) {
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 5); // Adding a small buffer
      }
    }, []);

    useEffect(() => {
  
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll);
      }
  
      return () => {
        if (container) {
          container.removeEventListener('scroll', handleScroll);
        }
      };
    }, []);

    useEffect(() => {
      if(isAtBottom){
        queryClient.cancelQueries({ queryKey: [ "getReviews" ] });
        setPage(prev => prev + 1);
        refetch();
      }
    }, [isAtBottom])


  return (
    <div className="p-2 pb-20 flex flex-col flex-1 overflow-hidden">
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
       <div ref={scrollContainerRef} className="py-3  overflow-x-hidden overflow-y-auto h-full">
            {content}
        </div>
        <div className="fixed bottom-2 right-28   md:left-36 lg:right-0">
              <p className="text-center text-sm  text-secondary">{isAtBottom && data?.data?.total > 0 ? "fetching more reviews..." : isAtBottom && data?.data?.total === 0 ? "we've reached the end" : ""}</p>
            </div>
    </div>
  )
}

export default Reviews