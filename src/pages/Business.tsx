import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Loader from "@/components/ui/Loader";
import { SearchBox } from "@/components/ui/SearchBox"
import { useAppContext } from "@/contexts/AuthContext"
import { getAllBusiness, removeBusiness } from "@/lib/apis"
import { GetBusinessType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";

function Business() {

  dayjs.extend(relativeTime);
  const { setActiveBusiness } = useAppContext();
  const { auth } = useAppContext();
  const queryClient = useQueryClient()
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: [ "getAllBusiness" ],
    queryFn: () => getAllBusiness(auth?.token as string),
    retry: 2,
    refetchOnWindowFocus: false
  });

  const { mutate } = useMutation({
    mutationKey: [ "removeBusiness" ],
    mutationFn: removeBusiness,
    onSuccess: () => {
      toast.success("Request Success", { description: "Business Deleted Successfully" });
      queryClient.invalidateQueries({ queryKey: [ "getAllBusiness" ] })
    },
    onError: (error) => console.log(error),
  })

  let content;

  if(isLoading){
    content = <div className="mx-auto mt-[10%]"><Loader/></div>

  }

  if(isError){
    content = <p>{error?.message}</p>
  }

  if(isSuccess && data?.data?.data?.length === 0){
      content = (
        <div className="flex flex-col items-center justify-center p-2 ml-1 mr-2 mb-2 flex-1 overflow-hidden">
          <h1 className="text-xl font-semibold">No Business added</h1>
          <p className="text-slate-300">Search or Add your business account</p>
        </div>
      )
  }

  if(isSuccess && data?.data?.data?.length > 0){
    content = (<div className="grid grid-cols-3 gap-5 mt-5">
      {data?.data?.data?.map((item: GetBusinessType, index: number) => (
        <Card key={item.place_id + index}>
          <CardHeader>
            <CardTitle className="flex items-center text-secondary justify-between gap-2">
              <div className="border p-2 rounded-full">
                <Icons.googleIcon/>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <EllipsisVertical/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setActiveBusiness({ businessName: item.business_name, placeId: item.place_id })}>
                      <span>Set Active Business</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => mutate({ place_id: item.place_id, email: auth?.data?.email as string, token: auth?.token as string})}>
                      <span>Remove Business</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
            <CardDescription className="flex items-center text-secondary justify-between gap-2">
              <span className="text-xl font-bold mt-3">{item.business_name}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
              <span className="text-sm text-slate-400">{item?.street_number}, {item?.street}, {item?.city}, {item?.zip_code}</span>
          </CardContent>
        </Card>
      ))}
    </div>
    )

  }

  return (
    <div className="p-3 flex flex-col flex-1">
        <div className="flex h-fit items-center justify-center w-full gap-3 pt-3">
          <SearchBox/>
        </div>
        {content}
    </div>
  )
}

export default Business