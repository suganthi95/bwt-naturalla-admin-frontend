import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { useFormContext, Controller } from 'react-hook-form'
import { OnBoardType } from '@/types';

interface Props {
    setPage: React.Dispatch<React.SetStateAction<number>>
}

function OnBoardThree({ setPage }: Props) {

    const { register, watch, control, setError, formState: { errors } } = useFormContext<OnBoardType>();

    const proceedToNext = () => {
        if(!watch("industry")){
            setError('industry', { type: 'required', message: 'Select atleast one option' });
        }else{
            setPage(prev => prev + 1)
        }
    }

    const roles = [ "Healthcare", "Education", "Technology", "Finance", "Retail", "Manufacturing", "Hospitality", "Real Estate", "Transportation", "Media & Entertainment", "Legal Services", "Agriculture", "Non-Profit", "Government", "Automotive", "Telecommunications", "Energy", "Fashion", "Consulting", "Construction" ]

  return (
    <div className="mt-3">
        <h1 className="text-2xl lg:text-5xl font-medium">Pick Your industry/category</h1>

        <Controller
            name='industry'
            control={control}
            render={({ field }) => (
                <RadioGroup 
                    value={field.value} 
                    onValueChange={(val) => field.onChange(val)} 
                    className="flex flex-row flex-wrap items-center mt-3 gap-2 capitalize"
                    {...register("industry")}
                >
                    {roles.map((item: string) => (
                        <div key={`industry-${item}`} className="flex items-center">
                            <RadioGroupItem className="hidden" type="button" value={item} id={item} />
                            <label 
                                className={watch("industry") === item ? "border border-secondary py-2 px-4 rounded-lg cursor-pointer bg-secondary text-white" : "border border-secondary py-2 px-4 rounded-lg cursor-pointer" }
                                htmlFor={item}
                            >{item}</label>
                        </div>
                    ))}
                </RadioGroup>
            )}  
        />
        <p className="text-xs mt-1 font-medium text-red-500">{errors?.industry?.message}</p>

        <Button onClick={proceedToNext} className="mt-10 bg-primary hover:bg-primary/50">
            Continue
        </Button>
    </div>
  )
}

export default OnBoardThree