import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { useAppContext } from "@/contexts/AuthContext";
// import { validateUser } from "@/lib/apis";
// import { ValidateUserType } from "@/types";
// import { useQuery } from "@tanstack/react-query"

function Profile() {

    // const { auth } = useAppContext();
    // const { isLoading, isError, isSuccess, data } = useQuery({
    //     queryKey: [ "validateUser" ],
    //     queryFn: () => validateUser(auth?.token as string),
    //     refetchOnWindowFocus: true,
    //     retry: 3,
    //     select: (data): ValidateUserType => data?.data?.data,
    //     enabled: Boolean(auth?.token) 
    // });

  return (
    <div className="flex flex-col flex-1">
        <div className="bg-primary/5 pt-32 relative">
            <Avatar className="cursor-pointer absolute -bottom-5 left-5 h-28 w-28 border-[5px] border-white">
                <AvatarFallback className="bg-primary text-white text-5xl">J</AvatarFallback>
            </Avatar>
        </div>

        <div className="mt-8 px-5">
            <h1 className="text-2xl text-secondary font-medium">Profile</h1>
            {/* <p className="text-slate-400">Update your photo and personal details here</p> */}
        </div>

        <div className="mx-5 space-y-5 py-5 my-5 border-t border-b">
            <div className="grid grid-cols-3 gap-20">
                <p>Username</p>
                <Input
                    type={"text"} 
                />
            </div>
            <div className="grid grid-cols-3 gap-20">
                <p>Email</p>
                <Input
                    type={"text"} 
                />
            </div>
            <div className="grid grid-cols-3 gap-20">
                <p>Workspace Name</p>
                <Input
                    type={"text"} 
                />
            </div>
        </div>

        <div className="mx-5">
            <div className="grid grid-cols-3 gap-20">
                <p>Password</p>
                <div>
                    <Input
                        type={"password"} 
                    />
                    <p className="text-sm text-green-500 font-medium float-right">Change Password</p>
                </div>
            </div>
        </div>

        <div className="mx-5 py-2 space-x-3">
            <Button variant="outline" className="text-secondary border-secondary">Back</Button>
            <Button className="bg-primary hover:bg-primary/50">Update</Button>
        </div>
    </div>
  )
}

export default Profile