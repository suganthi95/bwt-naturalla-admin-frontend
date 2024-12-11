import { CircleCheck, Gift } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Link } from "react-router-dom"
import { ASSETS } from "@/assets/assets"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { Icons } from "@/assets/icons"

function SubscriptionModal() {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-gradient-to-r from-[#CD84F1] to-[#7158E2] text-white py-1 px-2 rounded-lg">
                <Gift className="h-5 w-5" />
                <span className="text-xs">Upgrade</span>
            </button>
        </DialogTrigger>
        <DialogContent className="h-full mt-10   w-10/12 md:max-w-7xl">
            <Link to="/" className="flex flex-row items-center gap-3 mx-auto">
              <img src={ASSETS.LOGO} alt="logo" />
              <div>
                <p className="font-bold text-lg md:text-2xl text-primary">
                  Intelli<span className="text-secondary">Response</span>
                </p>
                <span className="text-slate-500 text-xs md:text-sm">
                  Turning Reviews Into Insights
                </span>
              </div>
            </Link>

            <p className="text-center text-xs md:text-sm text-slate-500">Experience the full capabilities of IntelliResponse without any commitment.</p>

            <div className="text-center flex flex-row items-center gap-2 font-medium mx-auto">
                <p>Monthly</p>
                <Switch />
                <p>Yearly</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 place-items-center gap-5 h-full overflow-y-scroll ">
                <div className="rounded-xl p-1  md:p-2 xl:p-5  w-full group">
                    <div className="flex flex-row items-center gap-3">
                        <Icons.standardIcon className="h-10 w-10"/>

                        <div className="text-md">
                            <p className="text-slate-500">For Beginners</p>
                            <h2 className="text-secondary font-bold text-lg">Standard Plan</h2>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h1 className="text-lg md:text-2xl text-secondary font-bold">Rs 1499 <span className="text-sm md:text-lg text-slate-500 font-normal">/ Per Month</span></h1>
                    </div>

                    <div className="flex flex-col gap-2 py-2 text-xs xl:text-sm mt-5">
                        <div className="flex  gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-bold">AI-Powered Responses</p>
                                <p className="text-slate-600">
                                    Generate professional replies to reviews with ease.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>

                            <div>
                                <p className="font-bold">Sentiment Analysis</p>
                                <p className="text-slate-600">
                                    Understand customer emotions and feedback.
                                </p>
                            </div>
                            
                        </div>
                        <div className="flex flex-row gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>

                            <div>
                                <p className="font-bold">Analytics Dashboard</p>
                                <p className="text-slate-600">
                                    Gain insights from detailed data visualizations.
                                </p>
                            </div>
                            
                        </div>
                        <div className="flex flex-row gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>

                            <div>
                                <p className="font-bold">Multilingual Support</p>
                                <p className="text-slate-600">
                                    Respond to reviews in multiple languages.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>
                            <p className="text-slate-600">Flexible cancellation policy</p>
                        </div>
                        <div className="flex flex-row gap-3 items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>
                            <p className="text-slate-600">Reminders before each billing cycle</p>
                        </div>
                        
                    </div>

                    <div className="mt-2">
                        <Button size="lg" className="w-full">Buy Now</Button>
                    </div>
                </div>

                <div className="rounded-xl p-1  md:p-2 xl:p-5 w-full bg-[#FFFAF5] group">
                    <div className="flex flex-row items-center gap-3">
                        <Icons.proIcon className="h-12 w-12"/>

                        <div className="flex flex-col gap-y-2 md:flex-row items-center justify-between w-full">
                            <div className="text-md">
                                <p className="text-slate-500">For Professionals</p>
                                <h2 className="text-secondary font-bold text-lg flex flex-row items-center gap-2">Pro Plan <Icons.diamondIcon className="h-5 w-5"/></h2>
                            </div>
                            <div>
                                <Button  className="bg-[#59C204] hover:bg-[#59C204] md:p-2 xl:px-4 text-xs lg:text-balance rounded-xl">Recommended</Button>
                            </div>
                        </div>

                    </div>

                    <div className="mt-3">
                        <h1 className="text-lg md:text-2xl text-primary font-bold">Rs 3999 <span className="text-sm md:text-lg text-slate-500 font-normal">/ Per Month</span></h1>
                    </div>

                    <div className="flex flex-col gap-2 py-2 text-xs md:text-sm mt-5">
                        <div className="flex  gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-bold">AI-Powered Responses</p>
                                <p className="text-slate-600">
                                    Generate professional replies to reviews with ease.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>

                            <div>
                                <p className="font-bold">Sentiment Analysis</p>
                                <p className="text-slate-600">
                                    Understand customer emotions and feedback.
                                </p>
                            </div>
                            
                        </div>
                        <div className="flex flex-row gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>

                            <div>
                                <p className="font-bold">Analytics Dashboard</p>
                                <p className="text-slate-600">
                                    Gain insights from detailed data visualizations.
                                </p>
                            </div>
                            
                        </div>
                        <div className="flex flex-row gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>

                            <div>
                                <p className="font-bold">Multilingual Support</p>
                                <p className="text-slate-600">
                                    Respond to reviews in multiple languages.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-3 text-xs md:text-sm items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>
                            <p className="text-slate-600">Flexible cancellation policy</p>
                        </div>
                        <div className="flex flex-row gap-3 items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>
                            <p className="text-slate-600">Reminders before each billing cycle</p>
                        </div>
                        
                    </div>

                    <div className="mt-2">
                        <Button size="lg" className="w-full bg-primary hover:bg-primary/80">Buy Now</Button>
                    </div>
                </div>

                <div className="rounded-xl p-1 md:p-2 xl:p-5 w-full group xl:mb-7">
                    <div className="flex flex-row items-center gap-3">
                        <Icons.enterpriseIcon className="h-10 w-10"/>

                        <div className="text-md">
                            <p className="text-slate-500">For Multiple Business</p>
                            <h2 className="text-secondary font-bold text-lg">Enterprise Plan</h2>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h1 className="text-lg md:text-2xl text-secondary font-bold">Contact Sales</h1>
                    </div>

                    <div className="flex flex-col gap-2 py-2 text-sm mt-5">
                        <div className="flex  gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-bold">AI-Powered Responses</p>
                                <p className="text-slate-600">
                                    Generate professional replies to reviews with ease.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>

                            <div>
                                <p className="font-bold">Sentiment Analysis</p>
                                <p className="text-slate-600">
                                    Understand customer emotions and feedback.
                                </p>
                            </div>
                            
                        </div>
                        <div className="flex flex-row gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>

                            <div>
                                <p className="font-bold">Analytics Dashboard</p>
                                <p className="text-slate-600">
                                    Gain insights from detailed data visualizations.
                                </p>
                            </div>
                            
                        </div>
                        <div className="flex flex-row gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>

                            <div>
                                <p className="font-bold">Multilingual Support</p>
                                <p className="text-slate-600">
                                    Respond to reviews in multiple languages.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-3 items-start md:items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>
                            <p className="text-slate-600">Flexible cancellation policy</p>
                        </div>
                        <div className="flex flex-row gap-3 items-center">
                            <div className="h-5 w-5">
                                <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                            </div>
                            <p className="text-slate-600">Reminders before each billing cycle</p>
                        </div>
                        
                    </div>

                    <div className="mt-2">
                        <Button size="lg" className="w-full">Contact Us</Button>
                    </div>
                </div>

            </div>
        </DialogContent>
    </Dialog>
  )
}

export default SubscriptionModal