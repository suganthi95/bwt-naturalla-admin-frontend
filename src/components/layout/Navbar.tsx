import { Menu, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { CollapseType, MenuType, ValidateUserType } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useMutation } from "@tanstack/react-query";
import { setActiveBusiness } from "@/lib/apis";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAppContext } from "@/contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ASSETS } from "@/assets/assets";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

function Navbar({ content, data }: { content: CollapseType, data: ValidateUserType }){

    const { auth } = useAppContext();
    const path = useLocation();
    const navigate = useNavigate();
    const tabValue = path.pathname.split("/").at(-1);
    const [ openSheet, setOpenSheet ] = useState(false);
    const [ activeWorkspace ] = data?.workspaceList.filter(item => item.workspace_id === data?.active_workspace);

    const [ activeBusiness ] = data?.businessList.filter(item => item.place_id === activeWorkspace.active_business);

    const [ activeBusinessState, setActiveBusinessState ] = useState(activeBusiness?.place_id);

    const { mutate: setActiveBusinessMutate } = useMutation({
        mutationKey: [ "setActiveBusiness" ],
        mutationFn: setActiveBusiness,
        onSuccess: async () => {
            window.location.reload();
        },
        onError: (error: AxiosError<any>) => {
            toast.error("Request Failed", { description: error?.response?.data?.message })
        }
    });

    const activateBusiness = (value: string) => {
        setActiveBusinessState(value);
        setActiveBusinessMutate({ place_id: value, token: auth?.token as string })
    }

    const redirect = (route: MenuType) => {
        if([ "Privacy Policy", "Terms & Conditions" ].includes(route.name)){
            window.open( route.route, '_blank');
        }else{
            navigate(`/${route.route}`)
        }
    }

    return(
        <div>
            <div className="px-3 py-3 border-slate-200 dark:border-slate-800 border flex items-center flex-row justify-between w-full">
                <h1 className="hidden lg:block text-xl font-semibold ml-3"><span className="text-primary">Welcome to</span> {activeWorkspace?.workspace_name}</h1>
                <div className="flex flex-row  items-center justify-center gap-5">

                    {data?.businessList.length > 0 ? 
                        <Select value={activeBusinessState} onValueChange={(value) => activateBusiness(value)}>
                            <SelectTrigger className="h-7 bg-secondary text-white flex gap-2">
                                <SelectValue placeholder="Select Business" />
                            </SelectTrigger>
                            <SelectContent>
                                {data?.businessList.map(item => (
                                    <SelectItem key={item.place_id} value={item.place_id}>{item.business_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select> :
                        <Link className="h-7" to="/business">
                            <Button className="h-7">
                                <PlusCircle className="h-4 w-4 text-light-grey" />
                                <span className="text-xs text-light-grey font-semibold ml-2">Add Business</span>
                            </Button>
                        </Link>
                    
                    }
                    
                </div>
                <div className="block lg:hidden">
                    <Sheet open={openSheet} onOpenChange={() => setOpenSheet(!openSheet)}>
                        <SheetTrigger>
                            <Menu />
                        </SheetTrigger>
                        <SheetContent className="bg-white w-fit">
                            <div className={`h-full w-full relative overflow-hidden`}>
                                <div className={`p-5 flex flex-row items-center space-x-5`}>
                                    <Link to="/" className="flex flex-row items-center gap-1">
                                        <img className="h-8 w-8" src={ASSETS.LOGO} alt="logo" />
                                        <p className="font-bold text-xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                                    </Link>
                                </div>
                                
                                <div onClickCapture={() => setOpenSheet(!openSheet)}>
                                    {Object.keys(content).map((menu: string, index: number) => (
                                        <Tabs key={`menu-nav-${index}`} value={tabValue}>
                                            <TabsList className="flex flex-col h-full rounded-none bg-white">
                                                {content[menu as keyof CollapseType].map((item: MenuType) => (
                                                    <TabsTrigger key={`menu-${item.name}`} title={item.name} onClick={() => redirect(item)} className={`px-3 py-2 rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary data-[state=active]:text-white w-full`} value={item.route}>
                                                        {item.icon}
                                                        <p>{item.name}</p>
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>
                                        </Tabs>
                                    ))}
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