import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddUserForm from "@/components/users/AddUserForm";
import UsersTable from "@/components/users/UsersTable";
import { X } from "lucide-react";
import { useState } from "react";

function Users() {
  const [Isopen, setIsopen] = useState(false);

  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="text-xs text-slate-400">
            Manage system users and permissions
          </p>
        </div>

        <Dialog open={Isopen} onOpenChange={setIsopen}>
          <DialogTrigger>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent className="[&>button]:hidden  !p-0 !max-w-xl">
            <DialogHeader className="bg-[#F5F5F5] p-3 px-6 rounded-lg items-center w-full flex flex-row  justify-between">
              <DialogTitle className="">Add User</DialogTitle>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setIsopen(false);
                }}
              >
                <X className="w-6 h-6" />
              </div>
            </DialogHeader>
            <AddUserForm onClose={setIsopen} />
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <UsersTable />
      </div>
    </div>
  );
}

export default Users;
