import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bookmark, MessageCircle, Star, ThumbsUp } from "lucide-react"

function Reviews() {
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
            <Card className="border-none shadow-none">
                <CardHeader className="flex flex-row items-center justify-between py-1 px-3">
                    <div className="flex flex-row items-center gap-2 pt-2">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div>
                            <p className="font-semibold">Kristin Watson</p>
                            <span className="text-xs text-light-grey">Dec 30, 2023 05:18</span>
                        </div>

                        <div>
                            <ThumbsUp className="stroke-green-500 fill-[#96F4A6]" strokeWidth={1} absoluteStrokeWidth />
                        </div>
                    </div>

                    <div className="flex flex-row gap-1 items-center">
                        <Star className="fill-yellow-400 stroke-none" />
                        <Star className="fill-yellow-400 stroke-none" />
                        <Star className="fill-yellow-400 stroke-none" />
                        <Star className="fill-yellow-400 stroke-none" />
                        <Star className="fill-slate-300 stroke-none" />
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 py-1 px-3">
                    <p className="text-sm text-light-grey">This is 💯 one hundred percent the best lip mask duo ever !!! The scent is delicious and it’s so smooth from the scrub & mask ~ This is perfection~ Smells just like honey 🍯 & the packaging is so adorable ~ I’m so very happy with this product 🐻 🍯 ~</p>

                    <div className="flex flex-row gap-2 items-center">
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
                    </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center justify-between py-1 px-3 border-b-2 border-b-slate-200">
                    <p className="text-sm text-light-grey font-semibold">Yet to Respond</p>
                    <div>
                        <Button size="icon" variant="ghost">
                            <MessageCircle />
                        </Button>

                        <Button size="icon"  variant="ghost">
                            <Bookmark />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <Card className="border-none shadow-none">
                <CardHeader className="flex flex-row items-center justify-between py-1 px-3">
                    <div className="flex flex-row items-center gap-2 pt-2">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div>
                            <p className="font-semibold">Kristin Watson</p>
                            <span className="text-xs text-light-grey">Dec 30, 2023 05:18</span>
                        </div>

                        <div>
                            <ThumbsUp className="stroke-green-500 fill-[#96F4A6]" strokeWidth={1} absoluteStrokeWidth />
                        </div>
                    </div>

                    <div className="flex flex-row gap-1 items-center">
                        <Star className="fill-yellow-400 stroke-none" />
                        <Star className="fill-yellow-400 stroke-none" />
                        <Star className="fill-yellow-400 stroke-none" />
                        <Star className="fill-yellow-400 stroke-none" />
                        <Star className="fill-slate-300 stroke-none" />
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 py-1 px-3">
                    <p className="text-sm text-light-grey">This is 💯 one hundred percent the best lip mask duo ever !!! The scent is delicious and it’s so smooth from the scrub & mask ~ This is perfection~ Smells just like honey 🍯 & the packaging is so adorable ~ I’m so very happy with this product 🐻 🍯 ~</p>

                    <div className="flex flex-row gap-2 items-center">
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
                    </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center justify-between py-1 px-3 border-b-2 border-b-slate-200">
                    <p className="text-sm text-light-grey font-semibold">Yet to Respond</p>
                    <div>
                        <Button size="icon" variant="ghost">
                            <MessageCircle />
                        </Button>

                        <Button size="icon"  variant="ghost">
                            <Bookmark />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <Card className="border-none shadow-none">
                <CardHeader className="flex flex-row items-center justify-between py-1 px-3">
                    <div className="flex flex-row items-center gap-2 pt-2">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div>
                            <p className="font-semibold">Kristin Watson</p>
                            <span className="text-xs text-light-grey">Dec 30, 2023 05:18</span>
                        </div>

                        <div>
                            <ThumbsUp className="stroke-green-500 fill-[#96F4A6]" strokeWidth={1} absoluteStrokeWidth />
                        </div>
                    </div>

                    <div className="flex flex-row gap-1 items-center">
                        <Star className="fill-yellow-400 stroke-none" />
                        <Star className="fill-yellow-400 stroke-none" />
                        <Star className="fill-yellow-400 stroke-none" />
                        <Star className="fill-yellow-400 stroke-none" />
                        <Star className="fill-slate-300 stroke-none" />
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 py-1 px-3">
                    <p className="text-sm text-light-grey">This is 💯 one hundred percent the best lip mask duo ever !!! The scent is delicious and it’s so smooth from the scrub & mask ~ This is perfection~ Smells just like honey 🍯 & the packaging is so adorable ~ I’m so very happy with this product 🐻 🍯 ~</p>

                    <div className="flex flex-row gap-2 items-center">
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
                    </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center justify-between py-1 px-3 border-b-2 border-b-slate-200">
                    <p className="text-sm text-light-grey font-semibold">Yet to Respond</p>
                    <div>
                        <Button size="icon" variant="ghost">
                            <MessageCircle />
                        </Button>

                        <Button size="icon"  variant="ghost">
                            <Bookmark />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

        </div>
    </div>
  )
}

export default Reviews