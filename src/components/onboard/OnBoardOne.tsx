import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { useFormContext, Controller } from 'react-hook-form'
import { OnBoardType } from '@/types';

interface Props {
    setPage: React.Dispatch<React.SetStateAction<number>>
}

function OnBoardOne({ setPage }: Props) {

    const { register, watch, control, formState: { errors }, setError } = useFormContext<OnBoardType>();

    const proceedToNext = () => {
        if(!watch("business")){
            setError('business', { type: 'required', message: 'Select one option' });
        }else{
            setPage(prev => prev + 1)
        }
    }

  return (
    <div className="mt-10">
        <h1 className="text-2xl lg:text-4xl font-medium">What would you like to use intelliresponse for ?</h1>

        <Controller
            name='business'
            control={control}
            render={({ field }) => (
                <RadioGroup 
                    value={field.value} 
                    onValueChange={(val) => field.onChange(val)} 
                    className="flex flex-row items-center mt-3 gap-5"
                    {...register("business")}
                >
                    <div className="flex items-center">
                        <RadioGroupItem className="hidden" type="button" value="own business" id="own business" />
                        <label 
                            className={watch("business") === "own business" ? "border border-secondary py-2 px-4 rounded-lg cursor-pointer bg-secondary text-white" : "border border-secondary py-2 px-4 rounded-lg cursor-pointer" }
                            htmlFor="own business"
                        >Own Business</label>
                    </div>
                    <div className="flex items-center">
                        <RadioGroupItem className="hidden" type="button" value="client business" id="client business" />
                        <label 
                            className={watch("business") === "client business" ? "border border-secondary py-2 px-4 rounded-lg cursor-pointer bg-secondary text-white" : "border border-secondary py-2 px-4 rounded-lg cursor-pointer" }
                            htmlFor="client business"
                        >Client Business</label>
                    </div>
                </RadioGroup>
            )}  
        />
        <p className="text-xs mt-1 font-medium text-red-500">{errors?.business?.message}</p>

        <Button onClick={proceedToNext} className="mt-10 bg-primary hover:bg-primary/50 dark:bg-primary dark:text-slate-50 hover:dark:bg-primary/50">
            Continue
        </Button>
    </div>
  )
}

export default OnBoardOne