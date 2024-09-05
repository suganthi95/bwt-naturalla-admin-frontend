import { Bookmark, Star, ThumbsDown, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { ReviewType } from "@/types"
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import { useMutation } from "@tanstack/react-query"
import { bookmarkReview } from "@/lib/apis"
import { MouseEvent, useState } from "react"
import { useAppContext } from "@/contexts/AuthContext"
import { toast } from "sonner"

type PlaceIDType = {
    place_id?: string
}

function ReviewCard(props: ReviewType & PlaceIDType) {


    dayjs.extend(relativeTime);

    const { auth } = useAppContext();
    const { mutate } = useMutation({
        mutationKey: [ "bookmarkReview" ],
        mutationFn: bookmarkReview,
        onSuccess: (data) => console.log(data),
        onError: () => {
            toast.error("Request Failed", { description: "Bookmark Failed" })
        }
    });

    const [ isBookmarked, setIsBookmarked ] = useState<boolean>(props.is_bookmarked);

    const bookmark = (event: MouseEvent<HTMLButtonElement>, status: boolean) => {
            const { place_id, review_id } = props;
            event.preventDefault();
            mutate({
                place_id: place_id as string,
                status: status,
                token: auth?.token as string,
                review_id
            });
            setIsBookmarked(status)
    }

  return (
    <Card className="border-none shadow-none hover:bg-light-blue">
        <CardHeader className="flex flex-row items-center justify-between py-1 px-3">
            <div className="flex flex-row items-center gap-2 pt-2">
                <Avatar>
                    <AvatarImage src={props?.author_image} />
                    <AvatarFallback>{props?.author_title[0]}</AvatarFallback>
                </Avatar>

                <div>
                    <div className="flex flex-row items-start gap-2">
                        <p className="font-semibold text-slate-950 dark:text-slate-500">{props?.author_title}</p>
                        {props?.sentiment === "negative" ? <ThumbsDown className="stroke-red-500 fill-red-300" strokeWidth={1} absoluteStrokeWidth /> : <ThumbsUp className="stroke-green-500 fill-[#96F4A6]" strokeWidth={1} absoluteStrokeWidth />}
                        
                    </div>
                    <span className="text-xs text-slate-500">{dayjs(props?.review_datetime_utc).fromNow()}</span>
                </div>

                
            </div>

            <div className="flex flex-row gap-1 items-center">
                {props?.review_rating && [ 1, 2, 3, 4, 5 ].map(item => (
                    <Star key={`star-${item}`} className={`${item <= props?.review_rating ? "fill-yellow-400" : "fill-slate-300"} stroke-none`} />
                ))}
            </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-slate-950 dark:text-slate-500 py-1 px-3">
            <p className="text-sm">{props?.review_text}</p>
        </CardContent>
        <CardFooter className="flex flex-row items-center justify-between py-1 px-3 border-b-2 border-b-slate-200 dark:border-b-slate-800">
            <p className="text-sm text-light-grey font-semibold">{!props.owner_answer && "Yet to Respond"}</p>
            <div>
                {isBookmarked ? 
                    <Button onClick={(e) => bookmark(e, false)} size="icon" variant="default">
                        <Bookmark />
                    </Button> :
                    <Button onClick={(e) => bookmark(e, true)} size="icon" variant="secondary">
                        <Bookmark />
                    </Button> 
                }
                
            </div>
        </CardFooter>
    </Card>
  )
}

export default ReviewCard