import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

function AppTimezone() {

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
            <Select>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select Time Zone" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Time Zone</SelectLabel>
                    <SelectItem value="asia/kolkata">Asia/Kolkata</SelectItem>
                    <SelectItem value="gmt">GMT</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    </div>
  )
}

export default AppTimezone