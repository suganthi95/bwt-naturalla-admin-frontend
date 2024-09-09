import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Switch } from "../ui/switch"
import { ValidateUserType } from "@/types";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { setNotification } from "@/lib/apis";
import { useAppContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

function Notification() {

    const { auth } = useAppContext();
    const queryClient = useQueryClient();
    const query = queryClient.getQueryData([ "validateUser" ]) as AxiosResponse<{ data: ValidateUserType }>;

    const [ notificationStatus, setNotificationStatus ] = useState(query.data.data.notification);

    const { mutate } = useMutation({
        mutationKey: [ "setNotification" ],
        mutationFn: setNotification,
        onSuccess: (data: AxiosResponse<any>) => {
            toast.success("Request Success", { description: data?.data?.message });
        },
        onError: (error: AxiosError<any>) => {
            toast.error("Request Failed", { description: error?.response?.data?.message });
        }
    })

    const setNotificationFunction = () => {
        mutate({
            token: auth?.token as string,
            status: !notificationStatus
        })
        setNotificationStatus(prev => !prev);
    }

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4 mt-3">
        <div className="space-y-0.5">
            <p className="font-medium">
                Notifications
            </p>
            <p className="text-sm text-slate-400">
                Use the toggles to turn notifications on or off as you prefer.
            </p>
        </div>
        <div>
            <Switch
                checked={notificationStatus}
                onCheckedChange={setNotificationFunction}
            />
        </div>
    </div>
  )
}

export default Notification