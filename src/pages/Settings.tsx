import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from "lucide-react";
import { Controller, useForm } from "react-hook-form"

function Settings() {

  const { register, control, watch } = useForm({
    defaultValues: {
        mode: "light"
    }
  });

  const modeArray = [
    {
        name: "light",
        icon: <Sun className="h-4 w-4" />
    },
    {
        name: "dark",
        icon: <Moon className="h-4 w-4" />
    }
  ]

  return (
    <div className="p-2 flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-row items-center justify-between py-1">
            <h1 className="font-semibold">Settings</h1>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-4 mt-3">
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

        <div className="flex flex-row items-center justify-between rounded-lg border p-4 mt-3">
            <div className="space-y-0.5">
                <p className="font-medium">
                    App Language
                </p>
                <p className="text-sm text-slate-400">
                    Preferred language settings
                </p>
            </div>
            <div>
                <Select>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>App Language</SelectLabel>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-4 mt-3">
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

        <div className="flex flex-row items-center justify-between rounded-lg border p-4 mt-3">
            <div className="space-y-0.5">
                <p className="font-medium">
                    Color Theme
                </p>
                <p className="text-sm text-slate-400">
                    Personalize the visual aesthetics of your interface
                </p>
            </div>
            <div>
                <Controller
                    name='mode'
                    control={control}
                    render={({ field }) => (
                        <RadioGroup 
                            value={field.value} 
                            onValueChange={(val) => field.onChange(val)} 
                            className="flex flex-row flex-wrap items-center mt-3 gap-2 capitalize"
                            {...register("mode")}
                        >
                            {modeArray.map((item) => (
                                <div key={`industry-${item}`} className="flex items-center">
                                    <RadioGroupItem className="hidden" type="button" value={item.name} id={item.name} />
                                    <label 
                                        className={watch("mode") === item.name ? "border border-primary py-2 px-4 rounded-lg cursor-pointer bg-primary/5 text-primary flex flex-row gap-1 items-center" : "border border-slate-300 text-slate-400 py-2 px-4 rounded-lg cursor-pointer flex flex-row gap-1 items-center" }
                                        htmlFor={item.name}
                                    >{item.icon}{item.name}</label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}  
                />
            </div>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-4 mt-3">
            <div className="space-y-0.5">
                <p className="font-medium">
                    Delete My Account
                </p>
                {/* <p className="text-sm text-slate-400">
                    Use the toggles to turn notifications on or off as you prefer.
                </p> */}
            </div>
            <div>
                <Button className="bg-red-500 hover:bg-red-500/80">Delete Account</Button>
            </div>
        </div>
    </div>
  )
}

export default Settings