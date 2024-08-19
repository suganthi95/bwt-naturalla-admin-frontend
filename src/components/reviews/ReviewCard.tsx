import { Bookmark, Star, ThumbsDown, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { ReviewType } from "@/types"
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import { useMutation } from "@tanstack/react-query"
import { bookmarkReview } from "@/lib/apis"
import { MouseEvent } from "react"
import { useAppContext } from "@/contexts/AuthContext"

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
    onError: (error) => console.log(error) 
  });

  const bookmark = (event: MouseEvent<HTMLButtonElement>) => {

    const { place_id, ...state } = props;
    event.preventDefault();
    mutate({
        place_id: place_id as string,
        state: state,
        status: true,
        token: auth?.token as string
    })
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
                        <p className="font-semibold">{props?.author_title}</p>
                        {props?.sentiment === "negative" ? <ThumbsDown className="stroke-red-500 fill-red-300" strokeWidth={1} absoluteStrokeWidth /> : <ThumbsUp className="stroke-green-500 fill-[#96F4A6]" strokeWidth={1} absoluteStrokeWidth />}
                        
                    </div>
                    <span className="text-xs text-light-grey">{dayjs(props?.review_datetime_utc).fromNow()}</span>
                </div>

                
            </div>

            <div className="flex flex-row gap-1 items-center">
                {[ 1, 2, 3, 4, 5 ].map(item => (
                    <Star key={`star-${item}`} className={`${item <= props?.review_rating ? "fill-yellow-400" : "fill-slate-300"} stroke-none`} />
                ))}
            </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 py-1 px-3">
            <p className="text-sm">{props?.review_text}</p>

            {/* <div className="flex flex-row gap-2 items-center">
                <div className="h-14 w-14 rounded-md overflow-hidden">
                    <img src="https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Image" className="h-full w-full object-cover" />
                </div>
                <div className="h-14 w-14 rounded-md overflow-hidden">
                    <img src="https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Image" className="h-full w-full object-cover" />
                </div>
                <div className="h-14 w-14 rounded-md overflow-hidden">
                    <img src="https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Image" className="h-full w-full object-cover" />
                </div>
                <div className="h-14 w-14 rounded-md overflow-hidden">
                    <img src="https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Image" className="h-full w-full object-cover" />
                </div>
            </div> */}
        </CardContent>
        <CardFooter className="flex flex-row items-center justify-between py-1 px-3 border-b-2 border-b-slate-200">
            <p className="text-sm text-light-grey font-semibold">{!props.owner_answer && "Yet to Respond"}</p>
            <div>

                <Button onClick={bookmark} size="icon" variant="ghost">
                    <Bookmark />
                </Button>
            </div>
        </CardFooter>
    </Card>
  )
}

export default ReviewCard