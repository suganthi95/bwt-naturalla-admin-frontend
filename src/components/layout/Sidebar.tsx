import { BadgePercent, Box, FileText, Layers, LayoutDashboard, LogOut, Truck, UsersRound, WalletMinimal } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Icons } from "@/assets/icons";
import { Button } from "../ui/button";
import { useState } from "react";
import LogoutDialog from "../ui/LogoutDialog";
import { useAppContext } from "@/contexts/AuthContext";

export default function Sidebar() {

  const navigate = useNavigate();
  const { setAuth } = useAppContext();
  
  const path = useLocation();

  const tabValue = path.pathname.split("/").at(-1);

  const [ openLogoutDialog, setOpenLogoutDialog ] = useState(false);

  const signout = () => {
    setAuth(null);
    localStorage.clear();
  }

  const redirect = (route: any) => {
    if (["privacy_policy", "terms_conditions", "faq"].includes(route.name)) {
      window.open(route.route, "_blank");
    } else {
      navigate(`/${route.route}`);
    }
  };

  const menu = [
      {
        name: "dashboard",
        route: "dashboard",
        icon: <LayoutDashboard className="w-5" />,
        shouldVisible: true,
      },
      {
        name: "Products",
        route: "products",
        icon: <Box className="w-5" />,
        shouldVisible: true,
      },
      {
        name: "Categories",
        route: "categories",
        icon: <Layers className="w-5" />,
        shouldVisible: true,
      },
           {
        name: "Orders",
        route: "orders",
        icon: <FileText className="w-5" />,
        shouldVisible: true,
      },
      {
        name: "Shipments",
        route: "shipments",
        icon: <Truck className="w-5" />,
        shouldVisible: true,
      },
      {
        name: "Users",
        route: "users",
        icon: <UsersRound className="w-5" />,
        shouldVisible: true,
      },
      {
        name: "Discounts & Coupons",
        route: "configure-coupons",
        icon: <BadgePercent className="w-5" />,
        shouldVisible: true,
      },
      {
        name: "Payment Gateway",
        route: "payment-gateway",
        icon: <WalletMinimal className="w-5" />,
        shouldVisible: true,
      },
    ]

  return (
    <section
      className={`hidden lg:block transition-all ease-out w-16`}
    >
      <div
        className={`h-full w-full relative border-slate-200 dark:border-slate-800 border`}
      >
        <div
          className={`px-2 py-[7px] flex flex-row items-center justify-between space-x-5`}
        >
          <div className="flex flex-row items-center justify-center gap-3 h-12 mx-auto">
            <Icons.logo/>
          </div>
        </div>
        <div>
          <Tabs value={tabValue}>
            <TabsList className="flex flex-col gap-3 mt-3 h-full rounded-none bg-white dark:bg-slate-950">
              {menu
                .filter((item) => item.shouldVisible)
                .map((item) => (
                  <TabsTrigger
                    key={`menu-${item.name}`}
                    onClick={() =>
                      redirect(item)
                    }
                    className={`px-3 py-2 rounded-full flex items-center justify-start space-x-3 bg-transparent data-[state=active]:bg-secondary-green/20  dark:data-[state=active]:bg-white data-[state=active]:text-primary-green dark:bg-slate-950`}
                    value={item.route}
                  >
                      <div className="flex items-center gap-x-3">
                        {item.icon}
                      </div>
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs> 
        </div>

        <div className="flex justify-center items-center">
          <Button onClick={() => setOpenLogoutDialog(true)} size={"icon"} className="rounded-full absolute bottom-5 text-primary-green bg-transparent hover:bg-secondary-green/20">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <LogoutDialog 
        openLogoutDialog={openLogoutDialog} 
        setOpenLogoutDialog={setOpenLogoutDialog} 
        signout={signout} 
      />
    </section>
  );
}
