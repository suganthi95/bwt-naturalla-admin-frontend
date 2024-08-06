import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { BarChartBig, Bookmark, Briefcase, CircleAlert, CreditCard, Gift, House, Settings, UserCog } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAppContext } from "@/contexts/AuthContext";
import { googleLogout } from "@react-oauth/google";
import LogoutDialog from "../ui/LogoutDialog";
import { useState } from "react";
import { ASSETS } from "@/assets/assets";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Icons } from "@/assets/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

function Layout() {

  const navigate = useNavigate();
  const path = useLocation();
  const { auth, setAuth, setActiveBusiness } = useAppContext();
  const [ openLogoutDialog, setOpenLogoutDialog ] = useState<boolean>(false);
  const [ collapse, setCollapse ] = useState<string[]>([ "general", "menu", "apps" ])

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
        <div className="overflow-y-scroll h-[82vh]">
            <Accordion value={collapse} onValueChange={setCollapse} type="multiple" className="w-full">
                <AccordionItem value="general">
                    <AccordionTrigger className="px-2 text-sm text-secondary py-2 hover:no-underline">GENERAL</AccordionTrigger>
                    <AccordionContent>
                        <Tabs value={tabValue}>
                            <TabsList className="flex flex-col h-full rounded-none bg-white">
                                <TabsTrigger onClick={() => navigate("overview")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="overview">
                                    <House className="w-5" />
                                    <p>Dashboard</p>
                                </TabsTrigger>
                                <TabsTrigger onClick={() => navigate("reviews")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="reviews">
                                    <BarChartBig className="w-5" />
                                    <p>Reviews</p>
                                </TabsTrigger>
                                <TabsTrigger onClick={() => navigate("business")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="business">
                                    <Briefcase className="w-5" />
                                    <p>My Business</p>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="menu">
                    <AccordionTrigger className="px-2 text-sm text-secondary py-2 hover:no-underline">MENU</AccordionTrigger>
                    <AccordionContent>
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
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem className="border-none" value="apps">
                    <AccordionTrigger className="px-2 text-sm text-secondary py-2 hover:no-underline">APPS / INTEGRATION</AccordionTrigger>
                    <AccordionContent>
                        <Tabs value={tabValue}>
                            <TabsList className="flex flex-col h-full rounded-none bg-white">
                                <TabsTrigger className="px-3 py-2 mt-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white hover:bg-secondary hover:text-white data-[state=active]:bg-secondary data-[state=active]:text-white" value="logout">
                                    <Icons.googleIcon className="w-5" />
                                    <p>Google Review</p>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )

  
    return (
        <main className="flex flex-col h-screen">
            <div className="flex flex-row items-center justify-between px-5 py-2 border bg-slate-100">
                <Link to="/" className="flex flex-row items-center gap-1">
                    <img className="h-8 w-8" src={ASSETS.LOGO} alt="logo" />
                    <p className="font-bold text-xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                </Link>

                <div className="flex items-center flex-row gap-10">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-[#CD84F1] to-[#7158E2] text-white py-1 px-2 rounded-lg">
                        <Gift className="h-5 w-5" />
                        <span className="text-xs">Upgrade</span>
                    </button>

                    <p>Welcome, {auth?.data?.name}</p>
                    <div className="flex flex-row items-center gap-2">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarFallback className="bg-primary text-white">{auth?.data?.name[0]}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">
                            <DropdownMenuLabel>{auth?.data?.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                                <DropdownMenuItem>
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
            <div className="flex flex-row h-full font-inter bg-white">
                <Sidebar content={content}/>
                <section className="w-[100%] flex flex-col">
                    <Navbar content={content}/>
                    <div className="flex flex-1 overflow-y-scroll pb-14">
                        <Outlet/>
                    </div>
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