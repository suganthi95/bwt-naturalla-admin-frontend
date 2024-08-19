import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

function Profile() {

  return (
    <div className="flex flex-col flex-1">
        <div className="bg-primary/5 pt-32 relative">
            <Avatar className="cursor-pointer absolute -bottom-5 left-5 h-28 w-28 border-[5px] border-white">
                <AvatarFallback className="bg-primary text-white text-5xl">J</AvatarFallback>
            </Avatar>
        </div>

        <div className="mt-8 px-5">
            <h1 className="text-2xl text-secondary font-medium">Profile</h1>
            <p className="text-slate-400">Update your photo and personal details here</p>
        </div>

        <div>
            <div>
                <p>Username</p>
                <Input
                    type={"text"} 
                />
            </div>
            <div>
                <p>Email</p>
                <Input
                    type={"text"} 
                />
            </div>
            <div>
                <p>Workspace Name</p>
                <Input
                    type={"text"} 
                />
            </div>
        </div>
    </div>
  )
}

export default Profile