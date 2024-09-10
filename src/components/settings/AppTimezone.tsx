import { useTimezone } from "@/hooks/useTimezone";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { useAppContext } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ValidateUserType } from "@/types";
import { useState } from "react";
import { setTimezone } from "@/lib/apis";
import { toast } from "sonner";

function AppTimezone() {

    const { timezone } = useTimezone();

    const { auth } = useAppContext();
    const queryClient = useQueryClient();
    const query = queryClient.getQueryData([ "validateUser" ]) as AxiosResponse<{ data: ValidateUserType }>;

    const [ timezoneState, setTimezoneState ] = useState(() => query.data.data.timezone === null ? Intl.DateTimeFormat().resolvedOptions().timeZone : query.data.data.timezone);

    const { mutate } = useMutation({
        mutationKey: [ "setTimezone" ],
        mutationFn: setTimezone,
        onSuccess: (data: AxiosResponse<any>) => {
            toast.success("Request Success", { description: data?.data?.message });
        },
        onError: (error: AxiosError<any>) => {
            toast.error("Request Failed", { description: error?.response?.data?.message });
        }
    })

    const setTimezoneFunction = (value: string) => {
        mutate({
            token: auth?.token as string,
            timezone: value
        })
        setTimezoneState(value);
    }

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4 mt-3">
        <div className="space-y-0.5">
            <p className="font-medium">
                Time Zone
            </p>
            <p className="text-sm text-slate-400">
                Updated automatically based on local timezone
            </p>
        </div>
        <div>
            <Select value={timezoneState} onValueChange={(val) => setTimezoneFunction(val)}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select Time Zone" />
                </SelectTrigger>
                <SelectContent className="max-h-52">
                    <SelectGroup>
                        <SelectLabel>Time Zone</SelectLabel>
                        {timezone.map(item => (
                            <SelectItem key={item} value={item}>{item}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    </div>
  )
}

export default AppTimezone