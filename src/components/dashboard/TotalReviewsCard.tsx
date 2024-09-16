import { useAppContext } from "@/contexts/AuthContext";
import { getDashboard } from "@/lib/apis";
import { DashboardDataType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";
import { Card } from "../ui/card";
import { CircleAlert, CircleCheck, Star, Zap } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface Props {
    placeId: string
}

function TotalReviewsCard({ placeId }: Props) {

    const { auth } = useAppContext();

    const { isLoading, isSuccess, data } = useQuery({
        queryKey: [ "getDashboard" ],
        queryFn: () => getDashboard({
        token: auth?.token as string,
        placeId: placeId,
        sessionToken: uuid()
        }),
        retry: 3,
        refetchOnWindowFocus: true,
        select: (data): DashboardDataType => data.data.data,
        enabled: Boolean(placeId) 
    });

    let content;

    if(isLoading){
        content = <Skeleton className="h-[125px] rounded-xl" />
    }

    if(isSuccess){
        content = (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Card className="p-3 rounded-xl">
                <div className="flex flex-row items-center justify-between">
                <h1 className="text-sm font-medium text-slate-500">Total Reviews</h1>
                <Star strokeWidth={0.5} className="h-5 w-5 stroke-none fill-yellow-400"/>
                </div>
                <p className="text-2xl text-secondary font-bold mt-8">{data.totalRatings}</p>
            </Card>
            <Card className="p-3 rounded-xl">
                <div className="flex flex-row items-center justify-between">
                <h1 className="text-sm font-medium text-slate-500">Credits Remaining</h1>
                <Zap className="stroke-transparent fill-primary h-5 w-5" />
                </div>
                <p className="text-2xl text-secondary font-bold mt-8">{data.credits} / {data.total_credits}</p>
            </Card>
            <Card className="p-3 rounded-xl">
                <div className="flex flex-row items-center justify-between">
                <h1 className="text-sm font-medium text-slate-500">Responded</h1>
                <CircleCheck className="h-5 w-5 stroke-white fill-green-400" />
                </div>
                <p className="text-2xl text-secondary font-bold mt-8">576</p>
            </Card>
            <Card className="p-3 rounded-xl">
                <div className="flex flex-row items-center justify-between">
                <h1 className="text-sm font-medium text-slate-500">Yet to Respond</h1>
                <CircleAlert className="h-5 w-5 stroke-white fill-red-400" />
                </div>
                <p className="text-2xl text-secondary font-bold mt-8">300</p>
            </Card>
        </div>
        )
    }

    return content
}

export default TotalReviewsCard