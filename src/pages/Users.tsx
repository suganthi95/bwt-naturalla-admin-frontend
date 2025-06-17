import { Button } from "@/components/ui/button"
import UsersTable from "@/components/users/UsersTable"

function Users() {
  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
        <div className="flex flex-row items-center justify-between">
            <div>
                <h1 className="text-xl font-semibold">Users</h1>
                <p className="text-xs text-slate-400">Manage system users and permissions</p>
            </div>

            <div>
                <Button>Add User</Button>
            </div>
        </div>

        <div>
           <UsersTable/>
        </div>
    </div>
  )
}

export default Users