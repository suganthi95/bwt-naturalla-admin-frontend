import { Card } from "@/components/ui/card"
import { CircleCheck, Star, Zap } from "lucide-react"

function Home() {
  return (
    <div className="flex flex-col p-4 gap-3 md:p-2 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
        <Card className="p-3 rounded-xl">
            <div className="flex flex-row items-center justify-between">
            <h1 className="text-sm font-medium text-slate-500">Total Orders</h1>
            <Star strokeWidth={0.5} className="h-5 w-5 stroke-none fill-yellow-400"/>
            </div>
            <p className="text-2xl text-secondary font-bold mt-8">2233</p>
        </Card>
        <Card className="p-3 rounded-xl">
            <div className="flex flex-row items-center justify-between">
            <h1 className="text-sm font-medium text-slate-500">Total Sales</h1>
            <Zap className="stroke-transparent fill-primary h-5 w-5" />
            </div>
            <p className="text-2xl text-secondary font-bold mt-8">56456465</p>
        </Card>
        <Card className="p-3 rounded-xl">
            <div className="flex flex-row items-center justify-between">
            <h1 className="text-sm font-medium text-slate-500">Total Income</h1>
            <Zap className="stroke-transparent fill-primary h-5 w-5" />
            </div>
            <p className="text-2xl text-secondary font-bold mt-8">461551</p>
        </Card>
        <Card className="p-3 rounded-xl">
            <div className="flex flex-row items-center justify-between">
            <h1 className="text-sm font-medium text-slate-500">Sales by Product</h1>
            <CircleCheck className="h-5 w-5 stroke-white fill-green-400" />
            </div>
            <p className="text-2xl text-secondary font-bold mt-8">565465</p>
        </Card>
        <Card className="p-3 rounded-xl">
            <div className="flex flex-row items-center justify-between">
            <h1 className="text-sm font-medium text-slate-500">Sales by Category</h1>
            <CircleCheck className="h-5 w-5 stroke-white fill-green-400" />
            </div>
            <p className="text-2xl text-secondary font-bold mt-8">565465</p>
        </Card>
        <Card className="p-3 rounded-xl">
            <div className="flex flex-row items-center justify-between">
            <h1 className="text-sm font-medium text-slate-500">Total Visitor</h1>
            <CircleCheck className="h-5 w-5 stroke-white fill-green-400" />
            </div>
            <p className="text-2xl text-secondary font-bold mt-8">565465</p>
        </Card>
    </div>
    </div>
  )
}

export default Home