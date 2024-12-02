import useMode from "@/hooks/useMode";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

function AppMode() {

    const [ mode ] = useMode();
    const { register, control, watch } = useForm({
        defaultValues: {
            mode: mode
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
    ];

    useEffect(() => {

        if(watch("mode") === "dark"){
            document.documentElement.classList.toggle('dark', true);
        }else{
            document.documentElement.classList.toggle('dark', false);
        }

        localStorage.setItem('irDarkMode', watch("mode"));
    }, [watch("mode")]);

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4 mt-3">
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
                                    className={watch("mode") === item.name ? "border border-primary p-2 text-xs md:text-base md:py-2 md:px-4 rounded-lg cursor-pointer bg-primary/5 text-primary flex flex-row gap-1 items-center" : "border border-slate-300 text-slate-400 p-2 text-xs md:text-base md:py-2 md:px-4 rounded-lg cursor-pointer flex flex-row gap-1 items-center" }
                                    htmlFor={item.name}
                                >{item.icon}{item.name}</label>
                            </div>
                        ))}
                    </RadioGroup>
                )}  
            />
        </div>
    </div>
  )
}

export default AppMode