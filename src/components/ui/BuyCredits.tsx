import { Button } from "./button"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Zap } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Slider } from "./slider";
import { Badge } from "./badge";


function BuyCredits() {

    const [ openCreditPopover, setOpenCreditPopover ] = useState(false);
    const [ openRefillDialog, setOpenRefillDialog ] = useState(false);
    
  return (
    <>
    <Popover open={openCreditPopover} onOpenChange={setOpenCreditPopover}>
        <PopoverTrigger asChild>
            <button className="flex items-center gap-2 bg-gradient-to-r from-primary/50 to-primary text-white py-1 px-2 rounded-lg">
                <Zap className="h-5 w-5 fill-white stroke-none" />
                <span className="text-xs">Buy Credits</span>
            </button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px]">
            <div className="flex flex-row items-center gap-5">
                <div className="text-primary border-[2px] border-primary rounded-full p-2">
                    30
                </div>

                <div>
                    <h1 className="text-md font-bold">Remaining Credits</h1>
                    <p className="text-sm text-slate-400">Used to find best response for your customer’s</p>
                </div>

                <div>
                    <Button onClick={() => setOpenRefillDialog(prev => !prev)} variant="secondary">Refill Now</Button>
                </div>
            </div>
        </PopoverContent>
    </Popover>
    <Dialog open={openRefillDialog} onOpenChange={setOpenRefillDialog}>
        <DialogContent className="sm:max-w-[525px] p-0">
        <DialogHeader className="p-3">
            <DialogTitle>
                <div className="flex flex-row items-center gap-2">
                    <div className="bg-primary/15 p-1 rounded-lg">
                        <Zap className="h-5 w-5 fill-primary stroke-none" />
                    </div>

                    <div>
                        <h1>Refill Your Credits</h1>
                    </div>
                </div>
            </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
            <div className="border-[10px] mt-3 border-primary text-center rounded-full flex flex-col items-center justify-center h-56 w-56 mx-auto">
                <h1 className="text-7xl font-bold">30</h1>
                <h1 className="text-slate-500">REMAINING CREDITS</h1>
            </div>

            <div className="bg-[#FBFBFB] p-4 space-y-2 border">
                <h1 className="font-bold">Refill Your Credits Balance</h1>
                <p className="text-sm text-slate-500">If you don't use all them, your extra credits will roll over to the next month to let you enrich more credits.</p>

                <div>
                    <Slider className="mt-3" defaultValue={[199]} min={0} max={999} step={1} />
                </div>

                <div className="flex flex-row items-center justify-between text-md text-slate-500">
                    <p>0</p>
                    <p>999</p>
                </div>

                <div className="flex flex-row items-center justify-between">
                    <Badge className="bg-white" variant="outline">99</Badge>
                    <Badge className="bg-white" variant="outline">199</Badge>
                    <Badge className="bg-white" variant="outline">299</Badge>
                    <Badge className="bg-white" variant="outline">499</Badge>
                    <Badge className="bg-white" variant="outline">799</Badge>
                    <Badge className="bg-white" variant="outline">999</Badge>
                </div>
            </div>
        </div>
        <DialogFooter className="p-3">
            <Button className="bg-primary hover:bg-primary/50" type="submit">Buy Credits Now</Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  )
}

export default BuyCredits