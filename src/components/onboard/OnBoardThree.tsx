import { Button } from '../ui/button'
import { useFormContext } from 'react-hook-form'
import { OnBoardType } from '@/types';

interface Props {
    setPage: React.Dispatch<React.SetStateAction<number>>
}

function OnBoardThree({ setPage }: Props) {

    const { register, watch, setError, formState: { errors } } = useFormContext<OnBoardType>();

    const proceedToNext = () => {
        if(watch("industry")?.length === 0 || watch("industry")?.length > 3){
            setError('industry', { type: 'required', message: 'Pick three industries' });
        }else{
            setPage(prev => prev + 1)
        }
    }

    const roles = [ "Healthcare", "Education", "Technology", "Finance", "Retail", "Manufacturing", "Hospitality", "Real Estate", "Transportation", "Media & Entertainment", "Legal Services", "Agriculture", "Non-Profit", "Government", "Automotive", "Telecommunications", "Energy", "Fashion", "Consulting", "Construction" ]

  return (
    <div className="md:mt-3 h-96">
        <h1 className="text-2xl lg:text-4xl font-medium">Pick Your industry/category</h1>
        <div className="flex flex-row flex-wrap  items-center mt-3 gap-2 capitalize">
            {roles.map(industry => (
                <label 
                    key={industry} 
                    htmlFor={industry}
                    className={watch("industry")?.includes(industry) ? "border border-secondary py-2 px-4 rounded-lg cursor-pointer bg-secondary text-white" : "border border-secondary py-2 px-4 rounded-lg cursor-pointer"}
                >
                    <input
                        className="hidden" 
                        type="checkbox"
                        id={industry} 
                        value={industry}
                        disabled={watch("industry")?.length >= 3 && !watch("industry")?.includes(industry)}
                        {...register("industry", {
                            validate: (industryArray) => {
                                if(industryArray && !!industryArray.length){
                                    return "Select one industry"
                                }else{
                                    return "Select one industry"
                                }
                            }
                        })}
                    />
                    {industry}
                </label>
            ))}
        </div>
        
        <p className="text-xs mt-1 font-medium text-red-500">{errors?.industry?.message}</p>

        <Button onClick={proceedToNext} className="mt-4 md:mt-10  bg-primary hover:bg-primary/50 dark:bg-primary dark:text-slate-50 hover:dark:bg-primary/50">
            Continue
        </Button>
    </div>
  )
}

export default OnBoardThree