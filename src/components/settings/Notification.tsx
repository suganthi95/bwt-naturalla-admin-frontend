import { Switch } from "../ui/switch"

function Notification() {
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
            <Switch/>
        </div>
    </div>
  )
}

export default Notification