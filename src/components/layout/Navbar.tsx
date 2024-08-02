import { Menu, PlusCircle, Zap } from "lucide-react";
import { ReactNode, useState } from "react";
import { Icons } from "@/assets/icons";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Card } from "../ui/card";
import { useAppContext } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Navbar({content}: { content: ReactNode }){

    const [ openSheet, setOpenSheet ] = useState(false);
    const { auth, activeBusiness } = useAppContext();

    return(
        <div className="my-2 pl-1 pr-2 relative top-0 w-full z-10">
            <div className="py-3 px-3 border-slate-200 border-2 rounded-xl flex items-center flex-row justify-between w-full">
                <h1 className="hidden lg:block text-xl font-semibold"><span className="text-primary">Welcome to</span> {auth?.data?.activeWorkspace}</h1>
                <div className="flex flex-row  items-center justify-center gap-5">
                    <Card className="py-1 px-2 flex flex-row items-center gap-1">
                        <Zap className="w-5 text-secondary" />
                        <span className="text-sm text-light-grey">25/25 credits</span>
                    </Card>
                    {activeBusiness ? 
                        <Card className="py-1 px-2 flex flex-row items-center gap-1">
                            <span className="text-sm text-light-grey text-ellipsis overflow-hidden">{activeBusiness.businessName}</span>
                        </Card> :
                        <Link to="/business">
                            <Button>
                                <PlusCircle className="w-5 text-light-grey" />
                                <span className="text-sm text-light-grey font-semibold ml-2">Add Business</span>
                            </Button>
                        </Link>
                    }
                    
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