import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowUpFromLine, LineChart, TicketPercent } from "lucide-react"

function ConfigureCoupons() {
  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
        <div className="flex flex-row items-center justify-between">
            <div>
                <h1 className="text-xl font-semibold">Discounts & Coupons</h1>
                <p className="text-xs text-slate-400">Manage your store discounts and promotional offers</p>
            </div>

            <div>
                <Button>New Discount</Button>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
            <Card>
                <CardHeader>
                    <div className="text-xl flex flex-row items justify-between">
                        <h1>Active Discounts</h1>
                        <h1>12</h1>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <ArrowUpFromLine className="stroke-green-400 h-5 w-5" /><p>23% increase from last month</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="text-xl flex flex-row items justify-between">
                        <h1>Total Savings</h1>
                        <h1>₹ 15,276</h1>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <LineChart className="stroke-blue-400 h-5 w-5" /><p>Based on last 30 days</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="text-xl flex flex-row items justify-between">
                        <h1>Coupon Usage</h1>
                        <h1>458</h1>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <TicketPercent  className="stroke-purple-400 h-5 w-5" /><p>This month</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div>
           {/* table comes here */}
        </div>
    </div>
  )
}

export default ConfigureCoupons