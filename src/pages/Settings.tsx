import AppLanguage from "@/components/settings/AppLanguage";
import AppMode from "@/components/settings/AppMode";
import AppTimezone from "@/components/settings/AppTimezone";
import DeleteAccount from "@/components/settings/DeleteAccount";
import Notification from "@/components/settings/Notification";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Settings() {
  const location = useLocation();
  const user = localStorage.getItem("auth");
  const parsedUser = user ? JSON.parse(user) : null;
  const Mail = parsedUser?.data?.email;
   useEffect(() => {
     initializeGA();
     trackpPageView(location.pathname,Mail);
   }, []);
  return (
    <div className="p-2 flex flex-col flex-1 overflow-y-scroll overflow-hidden ">
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