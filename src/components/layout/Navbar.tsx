import { Menu, PlusCircle } from "lucide-react";
import { ReactNode, useState } from "react";
import { Icons } from "@/assets/icons";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ValidateUserType } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setActiveBusiness } from "@/lib/apis";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAppContext } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

function Navbar({ content, data }: { content: ReactNode, data: ValidateUserType }){

    const { auth } = useAppContext();
    const [ openSheet, setOpenSheet ] = useState(false);
    const queryClient = useQueryClient();
    const [ activeWorkspace ] = data?.workspaceList.filter(item => item.workspace_id === data?.active_workspace);

    const [ activeBusiness ] = data?.businessList.filter(item => item.place_id === activeWorkspace.active_business);

    const [ activeBusinessState, setActiveBusinessState ] = useState(activeBusiness?.place_id);

    const { mutate: setActiveBusinessMutate } = useMutation({
        mutationKey: [ "setActiveBusiness" ],
        mutationFn: setActiveBusiness,
        onSuccess: () => {
          toast.success("Request Success", { description: "Business Activated Successfully" });
          queryClient.invalidateQueries({ queryKey: [ "validateUser" ] })
        },
        onError: (error: AxiosError<any>) => {
          toast.error("Request Failed", { description: error?.response?.data?.message })
        }
    });

    const activateBusiness = (value: string) => {
        setActiveBusinessState(value);
        setActiveBusinessMutate({ place_id: value, token: auth?.token as string })
    }

    return(
        <div>
            <div className="px-3 py-3 border-slate-200 border flex items-center flex-row justify-between w-full">
                <h1 className="hidden lg:block text-xl font-semibold"><span className="text-primary">Welcome to</span> {activeWorkspace?.workspace_name}</h1>
                <div className="flex flex-row  items-center justify-center gap-5">

                    {data?.businessList.length > 0 ? 
                        <Select value={activeBusinessState} onValueChange={(value) => activateBusiness(value)}>
                            <SelectTrigger className="h-7 bg-secondary text-white flex gap-2">
                                <SelectValue placeholder="" />
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