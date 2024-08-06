import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Award, BarChartBig, Bookmark, ChevronDown, CircleAlert, CreditCard, DoorOpen, Gift, House, Search, Settings, UserCog } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAppContext } from "@/contexts/AuthContext";
import { googleLogout } from "@react-oauth/google";
import LogoutDialog from "../ui/LogoutDialog";
import { useState } from "react";
import { ASSETS } from "@/assets/assets";

function Layout() {

  const navigate = useNavigate();
  const path = useLocation();
  const { auth, setAuth, setActiveBusiness } = useAppContext();
  const [ openLogoutDialog, setOpenLogoutDialog ] = useState<boolean>(false);

  const tabValue = path.pathname.split("/").at(-1);

    const signout = () => {
        googleLogout();
        setAuth(null);
        setActiveBusiness(null);
        localStorage.removeItem("auth");
        localStorage.removeItem("activeBusiness");
        navigate("/sign-in", { replace: true });
    };

  const content = (
        <>
            <div className="px-3 py-1 border-slate-200 border-b-2">
                <p className="text-sm font-semibold">GENERAL</p>
                <Tabs value={tabValue}>
                    <TabsList className="flex flex-col h-full rounded-none bg-white">
                        <TabsTrigger onClick={() => navigate("overview")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="overview">
                            <House className="w-5" />
                            <p>Overview</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("reviews")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="reviews">
                            <BarChartBig className="w-5" />
                            <p>Reviews</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("business")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="business">
                            <Search className="w-5" />
                            <p>Business</p>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="px-3 py-1 border-slate-200 border-b-2">
                <p className="text-sm font-semibold">MENU</p>
                <Tabs value={tabValue}>
                    <TabsList className="flex flex-col h-full rounded-none bg-white">
                        <TabsTrigger onClick={() => navigate("bookmark")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="bookmark">
                            <Bookmark className="w-5" />
                            <p>Bookmark</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("billing")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="billing">
                            <CreditCard className="w-5" />
                            <p>Billing</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("feedback")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="feedback">
                            <UserCog className="w-5" />
                            <p>Feedback</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("terms-and-conditions")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="terms-and-conditions">
                            <CircleAlert className="w-5" />
                            <p>Terms & Conditions</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("settings")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="settings">
                            <Settings className="w-5" />
                            <p>Settings</p>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="px-3 py-1">
                <Card className="p-2 space-y-2">
                    <div className={`flex flex-row items-center space-x-5`}>
                        <div className='rounded-lg overflow-hidden p-2 shadow-lg'>
                            <Award className="text-primary" />
                        </div>
                        <h1 className="font-semibold text-sm">Get instant 25 credits <br /> for only <span className="text-primary">$ 9.99</span> <span className="line-through">$ 19.99</span></h1>
                    </div>
                    <Button className="bg-secondary hover:bg-secondary/90 w-full">
                        BUY NOW
                    </Button>
                </Card>
                <Tabs value={tabValue}>
                    <TabsList className="flex flex-col h-full rounded-none bg-white">
                        <TabsTrigger onClick={() => navigate("profile")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="profile">
                            <Avatar className="h-7 w-7">
                                {/* <AvatarImage src={auth?.data} /> */}
                                <AvatarFallback className="text-secondary">{auth?.data?.name[0]}</AvatarFallback>
                            </Avatar>
                            <p>{auth?.data?.name}</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => setOpenLogoutDialog(true)} className="px-3 py-2 mt-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white hover:bg-secondary hover:text-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="logout">
                            <DoorOpen className="w-5" />
                            <p>Logout</p>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </>
    )

  
    return (
        <main>
            <div className="flex flex-row items-center justify-between px-5 py-2 border bg-slate-100">
                <Link to="/" className="flex flex-row items-center gap-1">
                    <img src={ASSETS.LOGO} alt="logo" />
                    <p className="font-bold text-xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                </Link>

                <div className="flex items-center flex-row gap-10">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-[#CD84F1] to-[#7158E2] text-white py-1 px-2 rounded-lg">
                        <Gift className="h-5 w-5" />
                        <span className="text-xs">Upgrade</span>
                    </button>

                    <p>Welcome, {auth?.data?.name}</p>
                    <div className="flex flex-row items-center gap-2">
                        <Avatar>
                            <AvatarFallback className="bg-primary text-white">{auth?.data?.name[0]}</AvatarFallback>
                        </Avatar>
                        <Button variant="ghost" className="h-7 w-7 hover:bg-white" size="icon">
                            <ChevronDown />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-row font-inter bg-white">
                <Sidebar content={content}/>
                <section className="w-[100%] max-h-screen flex flex-col">
                    <Navbar content={content}/>
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

export default Layout