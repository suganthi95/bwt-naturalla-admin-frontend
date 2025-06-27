import {
  BadgePercent,
  Box,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  Truck,
  UsersRound,
  WalletMinimal,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Icons } from "@/assets/icons";
import { Button } from "../ui/button";
import { useState } from "react";
import LogoutDialog from "../ui/LogoutDialog";
import { useAppContext } from "@/contexts/AuthContext";
import { setAuthToken } from "@/lib/apis";
import { ASSETS } from "@/assets/assets";

export default function Sidebar() {
  const navigate = useNavigate();
  const { setAuth } = useAppContext();

  const path = useLocation();

  const tabValue = path.pathname.split("/").at(-1);
  const [resizeMenu, setResizeMenu] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const signout = () => {
    setAuth(null);
    setAuthToken(null);
    localStorage.clear();
  };

  const redirect = (route: any) => {
    if (["privacy_policy", "terms_conditions", "faq"].includes(route.name)) {
      window.open(route.route, "_blank");
    } else {
      navigate(`/${route.route}`);
    }
  };

  const menu = [
    {
      name: "Dashboard",
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
  ];

  return (
    <section
      className={`hidden lg:block  transition-all ease-out ${
        resizeMenu ? "w-52" : "w-16"
      } `}
    >
      {/* <div
        className={`h-full  relative border-slate-200 dark:border-slate-800 border`}
      >
        <div className={`px-2 py-[7px] flex flex-row items-center`}>
          {resizeMenu ? (
            <img src={ASSETS.LOGO} alt="logo"  className="w-28"/>
          ) : (
            <div className="flex flex-row items-center justify-center gap-3 h-12 mx-auto">
              <Icons.logo />
            </div>
          )}
          {resizeMenu ? (
            <div
              onClick={() => setResizeMenu(false)}
              className={`${
                resizeMenu && "opacity-100"
              } cursor-pointer opacity-0 transition-all duration-300`}
            >
              <ChevronLeft />
            </div>
          ) : (
            <div
              onClick={() => setResizeMenu(true)}
              className={`${
                !resizeMenu && "opacity-100"
              } cursor-pointer  opacity-0 transition-all duration-300`}
            >
              <ChevronRight />
            </div>
          )}
        </div>
        <div>
          <Tabs value={tabValue}>
            <TabsList className="flex flex-col gap-3  items-start mt-3 h-full  rounded-none bg-white dark:bg-slate-950">
              {menu
                .filter((item) => item.shouldVisible)
                .map((item) => (
                  <TabsTrigger
                    key={`menu-${item.name}`}
                    onClick={() => redirect(item)}
                    className={`px-3 py-2 rounded-full flex justify-start space-x-3 bg-transparent data-[state=active]:bg-secondary-green/20  dark:data-[state=active]:bg-white data-[state=active]:text-primary-green dark:bg-slate-950`}
                    value={item.route}
                  >
                    <div className="flex gap-x-3 items-center">
                      {item.icon}
                      {resizeMenu && (
                        <div
                          className={`${
                            resizeMenu ? "opacity-100" : "opacity-0"
                          } transition-all duration-300 `}
                        >
                          {item.name}
                        </div>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex justify-center items-center">
          <Button
            onClick={() => setOpenLogoutDialog(true)}
            size={"icon"}
            className="rounded-full absolute bottom-5 text-primary-green bg-transparent hover:bg-secondary-green/20"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div> */}

      <div className="h-full relative border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <div className="px-2 py-2 flex items-center justify-between">
          {resizeMenu ? (
            <img
              src={ASSETS.LOGO}
              alt="logo"
              className="w-28 transition-all duration-300"
            />
          ) : (
            <div className="h-10 w-full flex justify-center items-center">
              <Icons.logo />
            </div>
          )}
          <div
            onClick={() => setResizeMenu(!resizeMenu)}
            className="cursor-pointer p-1 rounded hover:bg-secondary-green/20 transition-all"
          >
            {resizeMenu ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs value={tabValue}>
            <TabsList className="flex flex-col gap-3 items-start mt-3 h-full bg-white dark:bg-slate-950 rounded-none">
              {menu
                .filter((item) => item.shouldVisible)
                .map((item) => (
                  <TabsTrigger
                    key={`menu-${item.name}`}
                    onClick={() => redirect(item)}
                    value={item.route}
                    className="w-full px-3 py-2 rounded-full flex items-center justify-start bg-transparent gap-3 data-[state=active]:bg-secondary-green/20 dark:data-[state=active]:bg-white data-[state=active]:text-primary-green"
                  >
                    <div className="min-w-[20px]">{item.icon}</div>

                    <span
                      className={`whitespace-nowrap transition-all duration-300 origin-left ${
                        resizeMenu
                          ? "opacity-100 scale-100 ml-1"
                          : "opacity-0 scale-95 w-0 overflow-hidden"
                      }`}
                    >
                      {item.name}
                    </span>
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex justify-center items-center py-4">
          <Button
            onClick={() => setOpenLogoutDialog(true)}
            size="icon"
            className="rounded-full text-primary-green bg-transparent hover:bg-secondary-green/20"
          >
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
