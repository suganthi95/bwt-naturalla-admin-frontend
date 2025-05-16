import { useAppContext } from "@/contexts/AuthContext";
import { getDashboard } from "@/lib/apis";
import { DashboardDataType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Icons } from "@/assets/icons";

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
  {[
    {
      icon: <Icons.Review className="size-16 text-primary" />,
      value: data.totalRatings ?? 0,
      label: 'Total Reviews',
    },
    {
      icon: <Icons.Credits className="size-16 text-primary" />,
      value: `${data.credits ?? 0} / ${data.total_credits ?? 0}`,
      label: 'Free Credits Remaining',
    },
    {
      icon: <Icons.Rating className="size-16 text-primary" />,
      value: `${data.instant_credits ?? 0} / ${data.total_instant_credits ?? 0}`,
      label: 'Instant Credits Remaining',
    },
    {
      icon: <Icons.Buisness className="size-16 text-primary" />,
      value: data.total_business ?? 0,
      label: 'Total Business',
    },
  ].map((item, index) => (
    <Card key={index} className="rounded-xl p-4 flex items-center gap-4 h-full">
      {item.icon}
      <div className="flex flex-col">
        <p className="text-2xl font-bold text-secondary">{item.value}</p>
        <p className="text-sm text-gray-500 font-medium">{item.label}</p>
      </div>
    </Card>
  ))}
</div>

        )
    }

    return content
}

export default TotalReviewsCard