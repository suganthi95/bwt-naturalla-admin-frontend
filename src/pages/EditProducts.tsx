import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function EditProducts() {
  const path = useLocation();
  const navigate = useNavigate();
  const tabValue = path.pathname.split("/").at(-1);

  const tabs = [
    {
      name: "Product Info",
      route: "product-info",
    },
    {
      name: "Product Price & Stocks",
      route: "product-price",
    },
    {
      name: "Description & Specification",
      route: "product-specs",
    },
    {
      name: "Discounts / Coupon",
      route: "discounts",
    },
    {
      name: "SEO",
      route: "seo",
    },
    {
      name: "FAQ’s",
      route: "faq",
    },
  ];

  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div>
        <h1 className="text-xl font-semibold flex items-center gap-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <p className="flex items-center gap-x-1 cursor-pointer text-sm text-primary ">
                <ChevronLeft  />
              
              </p>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have unsaved changes. If you leave this page, your edits
                  will be lost. Do you want to go back to the product list?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Stay</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    navigate("/products");
                    window.location.reload()
                  }}
                >
                  Leave Page
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          Edit Products
        </h1>
      </div>

      <div>
        <Tabs value={tabValue}>
          <TabsList>
            {tabs.map((item) => (
              <TabsTrigger
                key={item.route}
                className={`bg-transparent font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b-[3px] data-[state=active]:border-primary-green data-[state=active]:text-primary-green disabled:opacity-1`}
                onClick={() => navigate(item.route)}
                value={item.route}
              >
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <Outlet />
        </Tabs>
      </div>
    </div>
  );
}

export default EditProducts;
