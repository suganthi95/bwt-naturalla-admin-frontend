import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Loader from "@/components/ui/Loader";
import { SearchBox } from "@/components/ui/SearchBox"
import { useAppContext } from "@/contexts/AuthContext"
import { getAllBusiness } from "@/lib/apis"
import { GetBusinessType } from "@/types";
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { EllipsisVertical } from "lucide-react";

function Business() {

  dayjs.extend(relativeTime);
  const { auth, setActiveBusiness } = useAppContext();
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: [ "getAllBusiness" ],
    queryFn: () => getAllBusiness({ userId: auth?.user?._id as string, email: auth?.user?.email as string }),
    retry: 2,
    refetchOnWindowFocus: false
  });

  let content;

  if(isLoading){
    content = <div className="mx-auto mt-[10%]"><Loader/></div>

  }

  if(isError){
    content = <p>{error?.message}</p>
  }

  if(isSuccess){
    content = (<div className="mt-10 grid grid-cols-3 gap-5">
      {data.data.map((item: GetBusinessType, index: number) => (
        <Card key={item.placeId + index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="text-xl">{item.businessName}</span>
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
                    <DropdownMenuItem onClick={() => setActiveBusiness({ businessName: item.businessName, placeId: item.placeId })}>
                      <span>Set Active Business</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
              <span className="text-sm text-slate-400">Added {dayjs(item.createdAt).fromNow()}</span>
          </CardContent>
        </Card>
      ))}
    </div>
    )

  }

  return (
    <div className="p-2 border-2 border-slate-200 rounded-xl ml-1 mr-2 mb-2 flex flex-col flex-1 overflow-y-scroll">
        <div className="flex h-fit items-center justify-center w-full gap-3 pt-3">
            <SearchBox/>
        </div>
        {content}
    </div>
  )
}

export default Business