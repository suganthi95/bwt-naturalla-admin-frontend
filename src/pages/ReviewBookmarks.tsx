import ReviewCard from "@/components/reviews/ReviewCard"
import Loader from "@/components/ui/Loader";
import { useAppContext } from "@/contexts/AuthContext";
import { getAllBookmarkedReviews } from "@/lib/apis"
import { BusinessList, ReviewType, ValidateUserType, WorkspaceList } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosResponse } from "axios";
import { Bookmark } from "lucide-react";

function ReviewBookmarks() {

    const { auth } = useAppContext();
    const queryClient = useQueryClient();
    const validateUser = queryClient.getQueryData<AxiosResponse<{ data: ValidateUserType }>>([ "validateUser" ]);
    const [ activeWorkspace ] = validateUser?.data?.data?.workspaceList.filter(item => item.workspace_id === validateUser?.data?.data?.active_workspace) as WorkspaceList[];
    const [ activeBusiness ] = validateUser?.data?.data?.businessList.filter(item => item.place_id === activeWorkspace.active_business) as BusinessList[];

    const { isLoading, isError, isSuccess, data, error, isRefetching } = useQuery({
        queryKey: [ "getAllBookmarkedReviews", activeBusiness?.place_id ],
        queryFn: () => getAllBookmarkedReviews({
            placeId: activeBusiness?.place_id,
            token: auth?.token as string,
        }),
        retry: 3,
        refetchOnWindowFocus: false,
        enabled: Boolean(activeBusiness?.place_id),
        select: (data) => {
          return data?.data
        }
    });


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
        content = <Loader/>
    }

    if(isError){
        content = <p className="mt-[10%] mx-auto text-center text-secondary font-bold">{error?.message}</p>
    }

    if(isSuccess && data.length === 0){
        content = <div className="mt-[10%] mx-auto flex items-center justify-center flex-col gap-3">
            <p className="text-secondary font-bold">There are no bookmarks at this time.</p>
            <p className="text-slate-400 text-sm flex flex-row items-center gap-2">Click <Bookmark /> icon to save reviews</p>
        </div>
    }

    if(isSuccess && data.length > 0){
        content = data?.map((item : ReviewType) => (
          <ReviewCard key={item.review_id} {...item} place_id={activeBusiness.place_id}/>
        ))
    }

  return (
    <div className="p-2 flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-row items-center justify-between py-1">
            <h1 className="font-semibold">Bookmarks</h1>
            {/* <Select value={sortKey} onValueChange={(value) => setSortKey(value)}>
                <SelectTrigger className="w-[100px] h-8">
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="highest_rating">Positive</SelectItem>
                    <SelectItem value="lowest_rating">Negative</SelectItem>
                </SelectContent>
            </Select> */}
        </div>

        <div className="py-3 overflow-y-scroll h-full">
            {content}
        </div>
        
    </div>
  )
}

export default ReviewBookmarks