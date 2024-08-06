import { Menu } from "lucide-react";
import { ReactNode, useState } from "react";
import { Icons } from "@/assets/icons";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Card } from "../ui/card";
import { useAppContext } from "@/contexts/AuthContext";
import { BusinessBox } from "../ui/BusinessBox";

function Navbar({content}: { content: ReactNode }){

    const [ openSheet, setOpenSheet ] = useState(false);
    const { auth, activeBusiness } = useAppContext();

    return(
        <div>
            <div className="px-3 py-3 border-slate-200 border flex items-center flex-row justify-between w-full">
                <h1 className="hidden lg:block text-xl font-semibold"><span className="text-primary">Welcome to</span> {auth?.data?.active_workspace_name || "Demo Account"}</h1>
                <div className="flex flex-row  items-center justify-center gap-5">
                    {activeBusiness && 
                        <Card className="py-1 px-2 flex flex-row items-center gap-1 bg-secondary">
                            <span className="text-sm text-white text-ellipsis overflow-hidden">{activeBusiness.businessName}</span>
                        </Card>
                    }

                    {/* <BusinessBox/> */}
                    
                </div>
                <div className="block lg:hidden">
                    <Sheet open={openSheet} onOpenChange={() => setOpenSheet(!openSheet)}>
                        <SheetTrigger>
                            <Menu />
                        </SheetTrigger>
                        <SheetContent className="bg-secondary w-fit">
                            <div className={`h-full w-full relative overflow-hidden`}>
                                <div className={`p-5 flex flex-row items-center space-x-5`}>
                                    <div className='w-14 h-14 rounded-lg overflow-hidden'>
                                        <Icons.logo/>
                                    </div>
                                    <h1 className="text-white font-bold text-2xl">IntelliResponse</h1>
                                </div>
                                <div onClickCapture={() => setOpenSheet(!openSheet)}>
                                    {content}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>

    )

}

export default Navbar;