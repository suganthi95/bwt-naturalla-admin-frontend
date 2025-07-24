import { Icons } from "@/assets/icons";
import {
  LayoutDashboard,
  Box,
  Layers,
  FileText,
  Truck,
  UsersRound,
  BadgePercent,
  WalletMinimal,
  Newspaper,
  NotepadText,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  onClose: () => void;
}
export default function TabMenu({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState("dashboard");
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
    {
      name: "User Sentiment",
      route: "user-sentiment",
      icon: <Icons.User_Sentiment className="w-5" />,
      shouldVisible: true,
    },
    {
      name: "Blogs",
      route: "blogs",
      icon: <Newspaper className="w-5" />,
      shouldVisible: true,
    },
    {
      name: "Legal Pages",
      route: "legal-pages",
      icon: <NotepadText className="w-5" />,
      shouldVisible: true,
    },
  ];

  return (
    <div className="group">
      <div className="xl:hidden relative">
        <div
          className={`absolute left-0 right-0 z-10 mt-1 bg-white dark:bg-slate-800 overflow-hidden transition-all duration-200 ease-in-out
         
                opacity-100
            `}
        >
          {menu
            .map((item) => (
               <Link
                to={item.route}
                key={item.route}
                onClick={() => {
                  setActiveTab(item.route);
                  onClose();
                }}
                className={`flex items-center gap-2 p-3 w-full text-left text-sm font-medium transition-colors
                  ${
                    activeTab === item.route
                      ? "bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
