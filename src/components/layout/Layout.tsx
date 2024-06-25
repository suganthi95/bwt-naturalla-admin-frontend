import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Award, BarChartBig, Bookmark, CircleAlert, CreditCard, DoorOpen, House, Search, Settings, UserCog } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function Layout() {

  const navigate = useNavigate();
  const path = useLocation();

  const tabValue = path.pathname.split("/").at(-1);

  const content = (
        <>
            <div className="px-3 py-1 border-slate-200 border-b-2">
                <p className="text-sm font-semibold">GENERAL</p>
                <Tabs value={tabValue}>
                    <TabsList className="flex flex-col h-full rounded-none bg-white">
                        <TabsTrigger onClick={() => navigate("overview")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-primary-blue data-[state=active]:text-white" value="overview">
                            <House className="w-5" />
                            <p>Overview</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("reviews")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-primary-blue data-[state=active]:text-white" value="reviews">
                            <BarChartBig className="w-5" />
                            <p>Reviews</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("search")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-primary-blue data-[state=active]:text-white" value="search">
                            <Search className="w-5" />
                            <p>Search</p>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="px-3 py-1 border-slate-200 border-b-2">
                <p className="text-sm font-semibold">MENU</p>
                <Tabs value={tabValue}>
                    <TabsList className="flex flex-col h-full rounded-none bg-white">
                        <TabsTrigger onClick={() => navigate("bookmark")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-primary-blue data-[state=active]:text-white" value="bookmark">
                            <Bookmark className="w-5" />
                            <p>Bookmark</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("billing")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-primary-blue data-[state=active]:text-white" value="billing">
                            <CreditCard className="w-5" />
                            <p>Billing</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("feedback")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-primary-blue data-[state=active]:text-white" value="feedback">
                            <UserCog className="w-5" />
                            <p>Feedback</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("terms-and-conditions")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-primary-blue data-[state=active]:text-white" value="terms-and-conditions">
                            <CircleAlert className="w-5" />
                            <p>Terms & Conditions</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("settings")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-primary-blue data-[state=active]:text-white" value="settings">
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
                            <Award className="text-primary-blue" />
                        </div>
                        <h1 className="font-semibold text-sm">Get instant 25 credits <br /> for only <span className="text-primary-blue">$ 9.99</span> <span className="line-through">$ 19.99</span></h1>
                    </div>
                    <Button className="bg-primary-blue hover:bg-primary-blue/90 w-full">
                        BUY NOW
                    </Button>
                </Card>
                <Tabs value={tabValue}>
                    <TabsList className="flex flex-col h-full rounded-none bg-white">
                        <TabsTrigger onClick={() => navigate("profile")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-primary-blue data-[state=active]:text-white" value="profile">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>MM</AvatarFallback>
                            </Avatar>
                            <p>Marvin McKinney</p>
                        </TabsTrigger>
                        <TabsTrigger onClick={() => navigate("logout")} className="px-3 py-2 w-full rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-primary-blue data-[state=active]:text-white" value="logout">
                            <DoorOpen className="w-5" />
                            <p>Logout</p>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </>
    )

  
    return (
        <main className="flex flex-row font-inter bg-white">
            <Sidebar content={content}/>
            <section className="w-[100%] max-h-screen pb-3">
                <Navbar content={content}/>
                <Outlet/>
            </section>
        </main>
    )
}

export default Layout