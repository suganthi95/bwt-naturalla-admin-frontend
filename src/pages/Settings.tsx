import AppLanguage from "@/components/settings/AppLanguage";
import AppMode from "@/components/settings/AppMode";
import AppTimezone from "@/components/settings/AppTimezone";
import DeleteAccount from "@/components/settings/DeleteAccount";
import Notification from "@/components/settings/Notification";

function Settings() {

  return (
    <div className="p-2 flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-row items-center justify-between py-1">
            <h1 className="font-semibold">Settings</h1>
        </div>

        <Notification/>

        <AppLanguage/>

        <AppTimezone/>

        <AppMode/>

        <DeleteAccount/>
        
    </div>
  )
}

export default Settings