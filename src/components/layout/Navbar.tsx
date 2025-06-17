import { Bell, MessageSquare, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppContext } from "@/contexts/AuthContext";

function Navbar(){

    const { auth } = useAppContext();
    
    return(
        <div>
            <div className="px-3 py-3 border flex items-center flex-row justify-end w-full">

                <div className="flex flex-row items-center gap-5">
                    <Button size="icon" variant="secondary">
                        <Bell/>
                    </Button>
                    <Button size="icon" variant="secondary">
                        <MessageSquare />
                    </Button>
                    <Button size="icon" variant="secondary">
                        <Settings />
                    </Button>

                    <div className="flex flex-row items-center gap-5">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-orange-400 text-white">{auth?.firstname[0]}</AvatarFallback>
                        </Avatar>

                        <div>
                            <h1>{auth?.firstname} {auth?.lastname}</h1>
                            <p className="text-xs text-slate-400 capitalize">{auth?.role}</p>
                        </div>
                    </div>
                </div>
                
                {/* <div className="block lg:hidden">
                    <Sheet open={openSheet} onOpenChange={() => setOpenSheet(!openSheet)}>
                        <SheetTrigger>
                            <Menu />
                        </SheetTrigger>
                        <SheetContent className="bg-white dark:bg-slate-950 dark:text-white w-fit">
                            <div className={`h-full w-full relative overflow-y-auto`}>
                                <div className={`p-5 flex flex-row items-center space-x-5`}>
                                    <Link to="/" className="flex flex-row items-center gap-1">
                                        <img className="h-8 w-8 dark:hidden" src={ASSETS.LOGO} alt="logo" />
                                        <p className="font-bold text-xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                                    </Link>
                                </div>
                                
                                <div onClickCapture={() => setOpenSheet(!openSheet)}>
                                    {Object.keys(content).map((menu: string, index: number) => (
                                        <Tabs key={`menu-nav-${index}`} value={tabValue}>
                                        <p className="px-2 text-sm text-secondary py-2 hover:no-underline border-b-2 uppercase dark:text-white"><Trans i18nKey={menu}/></p>
                                            <TabsList className="flex -ml-5 flex-col h-full rounded-none bg-white dark:bg-slate-950">
                                                {content[menu as keyof CollapseType].filter((item: MenuType) => item.shouldVisible).map((item: MenuType) => (
                                                    <TabsTrigger key={`menu-${item.name}`} title={item.name} onClick={() => redirect(item)} className={`p-2 px-8 rounded-md flex items-center justify-start text-center space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white dark:bg-slate-950 w-full`} value={item.route}>
                                                        <div className='flex-col '>
                                                     <div className='flex items-center gap-x-3'>
                                                    {item.icon}
                                                   <p><Trans i18nKey={item.name}/></p>
                                                     </div>
                                                     <div>
                                                    {item.name === "Google Review" && (
                                                    <p className="mt-4 bg-primary text-white rounded-md py-1"><Trans i18nKey={'comingSoon'}/>...</p>
                                                    )}
                                                     </div>
                                                     </div>
                                                  
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>
                                        </Tabs>
                                    ))}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div> */}
            </div>
        </div>

    )

}

export default Navbar;