import { Link, Navigate, Outlet, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { BarChartBig, Bookmark, Briefcase, CircleAlert, CreditCard, EarthLock, House, Settings, UserCog } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAppContext } from "@/contexts/AuthContext";
import { googleLogout } from "@react-oauth/google";
import LogoutDialog from "../ui/LogoutDialog";
import { useState } from "react";
import { ASSETS } from "@/assets/assets";
import { Icons } from "@/assets/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { validateUser } from "@/lib/apis";
import Loader from "../ui/Loader";
import { CollapseType, ValidateUserType } from "@/types";
import UpgradeModal from "../ui/UpgradeModal";

function Layout() {

    const navigate = useNavigate();
    const { auth, setAuth } = useAppContext();
    const [ openLogoutDialog, setOpenLogoutDialog ] = useState<boolean>(false);

    const menus: CollapseType = {
        "general" : [
            {
                name: "Dashboard",
                route: "dashboard",
                icon: <House className="w-5" />
            },
            {
                name: "Reviews",
                route: "reviews",
                icon: <BarChartBig className="w-5" />
            },
            {
                name: "My Business",
                route: "business",
                icon: <Briefcase className="w-5" />
            },
        ],
        "menu" : [
            {
                name: "Bookmark",
                route: "bookmark",
                icon: <Bookmark className="w-5" />
            },
            {
                name: "Billing",
                route: "billing",
                icon:  <CreditCard className="w-5" />
            },
            {
                name: "Feedback",
                route: "feedback",
                icon: <UserCog className="w-5" />
            },
            {
                name: "Privacy Policy",
                route: "https://intelliresponse.ai/en/privacy-policy",
                icon: <EarthLock className="w-5" />
            },
            {
                name: "Terms & Conditions",
                route: "https://intelliresponse.ai/en/terms-and-conditions",
                icon: <CircleAlert className="w-5" />
            },
            {
                name: "Settings",
                route: "settings",
                icon: <Settings className="w-5" />
            },
        ],

        "apps/integrations": [
            {
                name: "Google Review",
                route: "google-review",
                icon: <Icons.googleIcon className="w-5" />
            }
        ]

    }

    const signout = () => {
        googleLogout();
        setAuth(null);
        localStorage.removeItem("auth");
        navigate("/sign-in", { replace: true });
        window.location.reload();
    };

    const { isLoading, isError, isSuccess, data } = useQuery({
        queryKey: [ "validateUser" ],
        queryFn: () => validateUser(auth?.token as string),
        refetchOnWindowFocus: true,
        retry: 3,
        select: (data): ValidateUserType => data?.data?.data,
        enabled: Boolean(auth?.token) 
    });

    let main;

    if(isLoading){
        main = <div className="h-screen flex items-center justify-center flex-col gap-3">
            <div className="hidden lg:flex flex-row items-center gap-1">
                <img className="h-8 w-8" src={ASSETS.LOGO} alt="logo" />
                <p className="font-bold text-3xl text-primary">Intelli<span className="text-secondary">Response</span></p>
            </div>
            <div>
                <Loader/>
            </div>
        </div>
    }

    if(isError){
        main = <Navigate to="/sign-in"/>
    }

    if(isSuccess){
        const [ activeWorkspace ] = data?.workspaceList.filter(item => item.workspace_id === data?.active_workspace);
        main = (
            <main className="flex flex-col h-screen">
                <div className="flex flex-row items-center justify-between px-5 py-2 border dark:border-slate-800 border-slate-200 bg-slate-100 dark:bg-slate-950">
                    <div className="flex lg:hidden flex-row items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-secondary text-white">
                            {activeWorkspace.workspace_name[0]}
                        </div>
                        <div>
                            <p className="font-medium">{activeWorkspace.workspace_name}</p>
                        </div>
                    </div>
                    <Link to="/" className="hidden lg:flex flex-row items-center gap-1">
                        <img className="h-8 w-8" src={ASSETS.LOGO} alt="logo" />
                        <p className="font-bold text-xl text-primary">Intelli<span className="text-secondary dark:text-slate-400">Response</span></p>
                    </Link>

                    <div className="flex items-center flex-row gap-10">
                        
                        <UpgradeModal/>

                        <p className="hidden md:block text-slate-950 dark:text-slate-500">Welcome, {data?.name}</p>
                        <div className="flex flex-row items-center gap-2">
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarFallback className="bg-primary text-white">{data?.name[0]}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40">
                                <DropdownMenuLabel>{data?.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setOpenLogoutDialog(true)}>
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row h-full font-inter bg-white dark:bg-slate-950 dark:text-slate-50">
                    <Sidebar 
                        content={menus}
                        data={data}
                    />
                    <section className="w-[100%] flex flex-col">
                        <Navbar 
                            content={menus}
                            data={data}
                        />
                        <Outlet/>
                    </section>
                    <LogoutDialog 
                        openLogoutDialog={openLogoutDialog} 
                        setOpenLogoutDialog={setOpenLogoutDialog}
                        signout={signout}
                    />
                </div>
            </main>
        )
    }

  
    return main;
}

export default Layout