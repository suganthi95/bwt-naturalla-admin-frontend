import { Bookmark, Copy } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import { Icons } from "@/assets/icons"
import { Button } from "../ui/button";

function ResponseCard() {

  dayjs.extend(relativeTime);

  return (
    <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between py-1 px-3">
            <div className="flex flex-row items-center gap-2 pt-2">
                <div className="rounded-full overflow-hidden">
                    <Icons.logo/>
                </div>

                <div>
                    <p className="font-semibold">IntelliReview</p>
                    <span className="text-xs text-light-grey">{dayjs(new Date()).fromNow()}</span>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm font-semibold">Tap on the card below to send</p>

            <div className="pt-5 grid grid-cols-3 gap-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between py-1 px-3">
                        <div className="flex flex-row items-center gap-2 pt-2">
                            <div className="rounded-full overflow-hidden">
                                <Icons.toneIcon/>
                            </div>

                            <div>
                                <p className="font-semibold">Casual Tone</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-light-grey">Hey there! thanks for the feedback. We're looking into the issue of the product you have mentioned. Thanks for your repones</p>
                        <div className="pt-5">
                            <Button size="icon" variant="ghost">
                                <Copy className="stroke-light-grey h-5" strokeWidth={1} />
                            </Button>
                            <Button size="icon" variant="ghost">
                                <Bookmark className="stroke-light-grey h-5" strokeWidth={1} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between py-1 px-3">
                        <div className="flex flex-row items-center gap-2 pt-2">
                            <div className="rounded-full overflow-hidden">
                                <Icons.toneIcon/>
                            </div>

                            <div>
                                <p className="font-semibold">Professional Tone</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-light-grey">Hey there! thanks for the feedback. We're looking into the issue of the product you have mentioned. Thanks for your repones</p>
                        <div className="pt-5">
                            <Button size="icon" variant="ghost">
                                <Copy className="stroke-light-grey h-5" strokeWidth={1} />
                            </Button>
                            <Button size="icon" variant="ghost">
                                <Bookmark className="stroke-light-grey h-5" strokeWidth={1} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between py-1 px-3">
                        <div className="flex flex-row items-center gap-2 pt-2">
                            <div className="rounded-full overflow-hidden">
                                <Icons.toneIcon/>
                            </div>

                            <div>
                                <p className="font-semibold">Balanced Tone</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-light-grey">Hey there! thanks for the feedback. We're looking into the issue of the product you have mentioned. Thanks for your repones</p>
                        <div className="pt-5">
                            <Button size="icon" variant="ghost">
                                <Copy className="stroke-light-grey h-5" strokeWidth={1} />
                            </Button>
                            <Button size="icon" variant="ghost">
                                <Bookmark className="stroke-light-grey h-5" strokeWidth={1} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </CardContent>
        
    </Card>
  )
}

export default ResponseCard