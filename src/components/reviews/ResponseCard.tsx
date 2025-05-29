import { Copy, Forward } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import { Icons } from "@/assets/icons"
import { Button } from "../ui/button";
import { ReviewSuggestionType } from "@/types";
import { toast } from "sonner";
import { ASSETS } from "@/assets/assets";
import { Trans } from "react-i18next";

function ResponseCard(props: ReviewSuggestionType) {

    console.log(props)

  dayjs.extend(relativeTime);

  const copyToClipboard = (text: string) => {    
    navigator.clipboard.writeText(text);
    return toast.success("Request Success", { description: "Text copied successfully!" });
  }

  return (
    <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between py-0 px-3">
            <div className="flex flex-row items-center gap-4 pt-2">
                <div>
                    <img src={ASSETS.LOGO} alt="logo" />
                </div>

                <div>
                    <p className="font-bold text-xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                    {/* <span className="text-xs text-light-grey">{dayjs(new Date()).fromNow()}</span> */}
                    <span className="text-xs text-light-grey"><Trans i18nKey={'ai_generated_response'}/></span>
                </div>
            </div>
        </CardHeader>
        <CardContent>

            <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-5 pb-5 ">
                <Card key={`response-1`}>
                    <CardHeader className="flex flex-row items-center justify-between py-0 px-3">
                        <div className="flex flex-row items-center gap-2 pt-2">
                            <div className="rounded-full overflow-hidden">
                                <Icons.toneIcon/>
                            </div>

                            <div>
                                <p className="font-semibold"><Trans i18nKey={'casual'}/></p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-1">
                        <p className="text-sm text-light-grey">{props?.casual_tone?.response}</p>
                        <div className="pt-1">
                            <Button onClick={() => copyToClipboard(props?.casual_tone?.response)} size="icon" variant="ghost">
                                {/* {isPending && tone === "casual" ? <LoaderCircle className="stroke-light-grey h-5 animate-spin" strokeWidth={1} /> : <Copy className="stroke-light-grey h-5" strokeWidth={1} />} */}
                                <Copy className="stroke-light-grey h-5" strokeWidth={1} />
                            </Button>
                            <Button onClick={() => window.open(props.reviewData.review_link)} size="icon" variant="ghost">
                                <Forward className="stroke-light-grey h-5" strokeWidth={1} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card key={`response-2`}>
                    <CardHeader className="flex flex-row items-center justify-between py-0 px-3">
                        <div className="flex flex-row items-center gap-2 pt-2">
                            <div className="rounded-full overflow-hidden">
                                <Icons.toneIcon/>
                            </div>

                            <div>
                                <p className="font-semibold"><Trans i18nKey={'professional'}/></p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-1">
                        <p className="text-sm text-light-grey">{props?.professional_tone?.response}</p>
                        <div className="pt-1">
                            <Button onClick={() => copyToClipboard(props?.professional_tone?.response)} size="icon" variant="ghost">
                            {/* {isPending && tone === "professional" ? <LoaderCircle className="stroke-light-grey h-5 animate-spin" strokeWidth={1} /> : <Copy className="stroke-light-grey h-5" strokeWidth={1} />} */}
                                <Copy className="stroke-light-grey h-5" strokeWidth={1} />
                            </Button>
                            <Button onClick={() => window.open(props.reviewData.review_link)} size="icon" variant="ghost">
                                <Forward className="stroke-light-grey h-5" strokeWidth={1} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <p className="text-sm font-semibold"><Trans i18nKey={'copyAndRespond'}/></p>

        </CardContent>
        
    </Card>
  )
}

export default ResponseCard