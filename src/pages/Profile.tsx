import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppContext } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/lib/apis";
import { ValidateUserType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosResponse } from "axios";
import { Check, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

function Profile() {

    const { auth } = useAppContext();
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<AxiosResponse<{ data: ValidateUserType, message: string }>>([ "validateUser" ]);
    const { email, name: username, active_workspace, workspaceList } = data?.data?.data as ValidateUserType;
    const [ activeWorkspace ] = workspaceList.filter(item => item.workspace_id === active_workspace);

    const [ editable, setEditable ] = useState({
        username: false,
        workspaceName: false
    });

    const { register, watch, formState: { errors }, setError } = useForm({
        defaultValues: {
            username: username,
            workspaceName: activeWorkspace.workspace_name
        }
    });


    const { mutate } = useMutation({
        mutationKey: [ "updateUserProfile" ],
        mutationFn: updateUserProfile,
        onSuccess: () => {
            toast.success("Request Success", { description: "Profile updated successfully" })
            queryClient.invalidateQueries({ queryKey: [ "validateUser" ] })
        },
        onError: (error) => {
            toast.error("Request Failed", { description: error?.message })
        }
    })

    const updateProfile = (name: "username" | "workspaceName") => {

        if(watch(name) === ""){
            
        }
        
        if(name === "username"){

            if(watch("username") === ""){
                return setError("username", { message: `Username is required` })
            }
            mutate({
                token: auth?.token,
                body: {
                    username: watch("username")
                }
            });
        }

        if(name === "workspaceName"){
            if(watch("workspaceName") === ""){
                return setError("workspaceName", { message: `Workspace name is required` })
            }
            mutate({
                token: auth?.token,
                body: {
                    workspace_name: watch("workspaceName")
                }
            })
        }

        setEditable(prev => ({ ...prev, [name]: false }))
    }

    useEffect(() => {
        watch((data) => {
            if(data.username === ""){
                setError("username", { message: "Username is required" })
            }else{
                setError("username", { message: "" })
            }

            if(data.workspaceName === ""){
                setError("workspaceName", { message: "Workspace name is required" })
            }else{
                setError("workspaceName", { message: "" })
            }
        })
    }, [watch])
    

  return (
    <div className="flex flex-col mb-10 sm:mb-0  overflow-scroll  ">
        <div className="bg-primary/5 pt-32 relative">
            <Avatar className="cursor-pointer absolute -bottom-5 left-5 h-28 w-28 border-[5px] border-white">
                <AvatarFallback className="bg-primary text-white text-5xl">{username[0]}</AvatarFallback>
            </Avatar>
        </div>

        <div className="mt-8 px-5">
            <h1 className="text-2xl text-secondary font-medium">Profile</h1>
            {/* <p className="text-slate-400">Update your photo and personal details here</p> */}
        </div>

        <div className="mx-5 space-y-5 py-5 my-5 border-t border-b">
            <div className="grid grid-cols-1 gap-y-3 md:grid-cols-2  lg:grid-cols-3 xl:gap-20">
                <p>Email</p>
                
                <div className="flex flex-row items-center gap-2">
                    <div className="w-full">
                        <Input
                            type={"text"} 
                            value={email}
                            disabled
                        />
                    </div>
                    <Button disabled className="invisible" size="icon">
                        <Pencil className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-y-3 md:grid-cols-2  lg:grid-cols-3 xl:gap-20">
                <p>Username</p>
                <div className="flex flex-row items-center gap-2">
                    <div className="w-full">
                        <Input
                            type={"text"} 
                            disabled={!editable.username}
                            {...register("username")}
                        />
                        <p className="text-xs mt-1 font-medium text-red-500">{errors?.username?.message}</p>
                    </div>
                    {editable.username ? 
                        <Button title="Save" onClick={() => updateProfile("username")} size="icon" variant="ghost">
                            <Check className="h-5 w-5" />
                        </Button> :
                        <Button title="Edit" onClick={() => setEditable(prev => ({ ...prev, username: !prev.username }))} size="icon" variant="ghost">
                            <Pencil className="h-5 w-5" />
                        </Button>
                    }
                </div>
            </div>
            <div className="grid grid-cols-1 gap-y-3 md:grid-cols-2  lg:grid-cols-3 xl:gap-20">
                <p>Workspace Name</p>
                
                <div className="flex flex-row items-center gap-2">
                    <div className="w-full">
                        <Input
                            type={"text"} 
                            disabled={!editable.workspaceName}
                            {...register("workspaceName")}
                        />
                        <p className="text-xs mt-1 font-medium text-red-500">{errors?.workspaceName?.message}</p>
                    </div>
                    {editable.workspaceName ? 
                        <Button title="Save" onClick={() => updateProfile("workspaceName")} size="icon" variant="ghost">
                            <Check className="h-5 w-5" />
                        </Button> :
                        <Button title="Edit" onClick={() => setEditable(prev => ({ ...prev, workspaceName: !prev.workspaceName }))} size="icon" variant="ghost">
                            <Pencil className="h-5 w-5" />
                        </Button>
                    }
                </div>
            </div>
        </div>

        <div className="mx-5">
            <div className="grid grid-cols-1 gap-y-3 md:grid-cols-2  lg:grid-cols-3 xl:gap-20">
                <p>Password</p>
                <div>
                    <Input
                        type={"password"} 
                        value="********"
                        disabled
                    />
                    {/* <p className="text-sm text-green-500 font-medium mt-2 md:float-right">Change Password</p> */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile