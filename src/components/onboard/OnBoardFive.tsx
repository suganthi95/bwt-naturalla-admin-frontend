import { Button } from '../ui/button'
import { useFormContext } from 'react-hook-form'
import { OnBoardType } from '@/types';
import { Input } from '../ui/input';
import { LoaderCircle } from 'lucide-react';

interface Props {
    submitOnboardForm: () => void,
    isPending: boolean
}

function OnBoardFive({ submitOnboardForm, isPending }: Props) {
    const { register, formState: { errors } } = useFormContext<OnBoardType>();


  return (
    <div className="mt-10">
        <h1 className="text-5xl font-medium">Lastly, What would you like to name your workspace ?</h1>

        <div>
            <Input
                className='mt-5 w-1/2'
                placeholder='Enter Workspace Name'
                type='text'
                {...register("workspaceName", {
                    required: {
                        value: true,
                        message: "Add your workspace name"
                    }
                })}
            />
            {errors?.workspaceName?.message ? <span className='text-red-500 text-xs mt-1'>{errors?.workspaceName?.message}</span> : <span className='text-slate-500 text-xs mt-1'>Use a name that best represents your organization or project. This will <br /> help you easily identify your workspace and keep things organized</span>}

        </div>

        <p className='text-slate-500 text-xs mt-10'><span className='font-bold'>Note:</span> You can always change the workspace name later in your settings</p>

        <Button onClick={submitOnboardForm} className="mt-5 bg-primary hover:bg-primary/50">
            {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "Continue"}
        </Button>
    </div>
  )
}

export default OnBoardFive