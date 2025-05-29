import { Button } from '../ui/button'
import { useFormContext } from 'react-hook-form'
import { AuthType, OnBoardType } from '@/types';
import { Input } from '../ui/input';
import { LoaderCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { onBoardUser } from '@/lib/apis';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Trans, useTranslation } from 'react-i18next';

interface Props {
    setPage: React.Dispatch<React.SetStateAction<number>>,
}

function OnBoardFive({ setPage }: Props) {
    const { register, handleSubmit, formState: { errors }, setError, watch } = useFormContext<OnBoardType>();
   const {t} = useTranslation()
    const { setAuth } = useAppContext();
    const { auth } = useAppContext();

    const { mutate, isPending } = useMutation({
        mutationKey: [ "onBoardUser" ],
        mutationFn: onBoardUser,
        onSuccess: (data) => {
            setAuth((prev) => ({ ...prev, data: data.data.data } as AuthType));
        },
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", { description: error?.response?.data?.message })
        }
    });

    const submitOnboardForm = handleSubmit(data => {
        mutate({
            business_type: data.business,
            heard_through: data.heardThrough,
            industry: data.industry,
            role: data.role,
            workspace_name: data.workspaceName,
            token: auth?.token as string
        })
    })

    const proceedToNext = () => {
        if(watch("workspaceName")){
            submitOnboardForm();
            setPage(prev => prev + 1);
        }else{
            setError("workspaceName", { type: 'required', message: t('workspaceNameRequired') })
        }
    }


    return (
        <div className="mt-10">
            <h1 className="text-2xl lg:text-4xl font-medium"><Trans i18nKey={'lastlyWorkspaceName'}/></h1>

            <div>
                <Input
                    className='mt-5 w-full md:w-1/2 dark:bg-white dark:border-slate-200'
                    placeholder='Enter Workspace Name'
                    type='text'
                    {...register("workspaceName", {
                        required: {
                            value: true,
                            message: t('addYourWorkspaceName')
                        }
                    })}
                />
                {errors?.workspaceName?.message ? <span className='text-red-500 text-xs mt-1'>{errors?.workspaceName?.message}</span> : <span className='text-slate-500 text-xs mt-1'>Use a name that best represents your organization or project. This will <br /> help you easily identify your workspace and keep things organized</span>}

            </div>

            <p className='text-slate-500 text-xs mt-10'><span className='font-bold'><Trans i18nKey={'note'}/></span> <Trans i18nKey={'workspace_note'}/></p>

            <Button onClick={proceedToNext} className="mt-5 bg-primary hover:bg-primary/50 dark:bg-primary dark:text-slate-50 hover:dark:bg-primary/50">
                {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Trans i18nKey={'continue'}/>}
            </Button>
        </div>
    )
}

export default OnBoardFive