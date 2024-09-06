import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { useFormContext, Controller } from 'react-hook-form'
import { OnBoardType } from '@/types';

interface Props {
    setPage: React.Dispatch<React.SetStateAction<number>>
}

function OnBoardTwo({ setPage }: Props) {

    const { register, watch, control, setError, formState: { errors } } = useFormContext<OnBoardType>();

    const proceedToNext = () => {
        if(!watch("role")){
            setError('role', { type: 'required', message: 'Select one option' });
        }else{
            setPage(prev => prev + 1)
        }
    }

    const roles = [ "owner", "freelancer", "marketing agency", "team lead", "team member", "others" ]

  return (
    <div className="mt-10">
        <h1 className="text-2xl lg:text-5xl font-medium">What is your role ?</h1>

        <Controller
            name='role'
            control={control}
            render={({ field }) => (
                <RadioGroup 
                    value={field.value} 
                    onValueChange={(val) => field.onChange(val)} 
                    className="flex flex-row flex-wrap items-center mt-3 gap-5 capitalize"
                    {...register("role")}
                >
                    {roles.map((item: string) => (
                        <div key={`role-${item}`} className="flex items-center">
                            <RadioGroupItem className="hidden" type="button" value={item} id={item} />
                            <label 
                                className={watch("role") === item ? "border border-secondary py-2 px-4 rounded-lg cursor-pointer bg-secondary text-white" : "border border-secondary py-2 px-4 rounded-lg cursor-pointer" }
                                htmlFor={item}
                            >{item}</label>
                        </div>
                    ))}
                </RadioGroup>
            )}  
        />
         <p className="text-xs mt-1 font-medium text-red-500">{errors?.role?.message}</p>

        <Button onClick={proceedToNext} className="mt-10 bg-primary hover:bg-primary/50 dark:bg-primary dark:text-slate-50 hover:dark:bg-primary/50">
            Continue
        </Button>
    </div>
  )
}

export default OnBoardTwo