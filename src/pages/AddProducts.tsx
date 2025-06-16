
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function AddProducts() {

    const path = useLocation();
    const navigate = useNavigate();
    const tabValue = path.pathname.split("/").at(-1);

    const tabs = [
        {
            name: "Product Info",
            route: "product-info"
        },
        {
            name: "Product Price & Stocks",
            route: "product-price"
        },
        {
            name: "Description & Specification",
            route: "product-specs"
        },
        {
            name: "Discounts / Coupon",
            route: "discounts"
        },
        {
            name: "SEO",
            route: "seo"
        },
    ]


  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
        <div>
            <h1 className="text-xl font-semibold">Add Products</h1>
        </div>

        <div>
            <Tabs value={tabValue}>
                <TabsList>
                    {tabs.map(item => (
                        <TabsTrigger 
                            key={item.route} 
                            className={`bg-transparent font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b-[3px] data-[state=active]:border-primary-green data-[state=active]:text-primary-green`} 
                            onClick={() => navigate(item.route)} 
                            value={item.route}
                        >
                            {item.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <Outlet/>
            </Tabs>
        </div>
    </div>
  )
}

export default AddProducts