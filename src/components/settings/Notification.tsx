import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Switch } from "../ui/switch"
import { ValidateUserType } from "@/types";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { setNotification } from "@/lib/apis";
import { useAppContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Trans, useTranslation } from "react-i18next";

function Notification() {

    const { auth } = useAppContext();
    const {t} = useTranslation()
    const queryClient = useQueryClient();
    const query = queryClient.getQueryData([ "validateUser" ]) as AxiosResponse<{ data: ValidateUserType }>;

    const [ notificationStatus, setNotificationStatus ] = useState(query.data.data.notification);

    const { mutate } = useMutation({
        mutationKey: [ "setNotification" ],
        mutationFn: setNotification,
        onSuccess: (data: AxiosResponse<any>) => {
            toast.success(t('request_success'), { description: data?.data?.message });
        },
        onError: (error: AxiosError<any>) => {
            toast.error(t('request_failed'), { description: error?.response?.data?.message });
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
               <Trans i18nKey={'notifications'}/>
            </p>
            <p className="text-sm text-slate-400">
               <Trans i18nKey={'notifications_description'}/>
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