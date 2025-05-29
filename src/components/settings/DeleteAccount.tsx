import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import Loader from '../ui/Loader';
import { toast } from 'sonner';
import { googleLogout } from '@react-oauth/google';
import { deleteAccount } from '@/lib/apis';
import { useMutation } from '@tanstack/react-query';
import { useAppContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Trans, useTranslation } from 'react-i18next';

function DeleteAccount() {

    const { auth, setAuth } = useAppContext();
    const {t} = useTranslation()
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            email: ""
        }
    });

    const { mutate, isPending } = useMutation({
        mutationKey: [ "deleteAccount" ],
        mutationFn: deleteAccount,
        onSuccess: () => {
            setAuth(null);
            localStorage.clear();
            googleLogout();
            window.location.reload();
            navigate("/", { replace: true })
        },
        onError: (error: AxiosError<any>) => {
            toast.error(t('request_failed'), { description: error?.response?.data?.message});
            reset();
        }
    });

    if(isPending){
        return <div className="mx-auto mt-[10%]"><Loader/></div>
    }

    const deleteAccountMutate = handleSubmit((data) => mutate({ token: auth?.token as string, email: data.email }))

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4 mt-3">
        <div className="space-y-0.5">
            <p className="font-medium">
               <Trans i18nKey={'delete_my_account'}/>
            </p>
            {/* <p className="text-sm text-slate-400">
                Use the toggles to turn notifications on or off as you prefer.
            </p> */}
        </div>
        <div>
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button className="bg-red-500 hover:bg-red-500/80">               <Trans i18nKey={'delete_account'}/></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle><Trans i18nKey={'are_you_absolutely_sure'}/></AlertDialogTitle>
                    <AlertDialogDescription>
                        <div>
                           <Trans i18nKey={'action_cannot_be_undone'}/>
                        </div>

                        <form>
                            <div className='py-3 space-y-1'>
                                <label htmlFor="confirm-email" className='font-bold'><Trans i18nKey={'please_confirm_your_email'}/> <span className='text-red-500'>*</span></label>
                                <Input
                                    className='mt-1'
                                    type='email'
                                    id='confirm-email'
                                    {...register("email", {
                                        required: {
                                            value: true,
                                            message:t('please_confirm_your_email')
                                        },
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: t('invalid_email_address'),
                                        }
                                    })}
                                />
                                <p className='text-xs font-medium text-red-500'>{errors?.email?.message}</p>
                            </div>
                            <div className='flex items-center justify-end gap-3'>
                                <AlertDialogCancel asChild>
                                    <Button variant="secondary" onClick={() => reset()}><Trans i18nKey={'cancel'}/></Button>
                                </AlertDialogCancel>
                                <AlertDialogAction type='submit' asChild>
                                    <Button onClick={deleteAccountMutate}><Trans i18nKey={'continue'}/></Button>
                                </AlertDialogAction>
                            </div>
                        </form>
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    
                    
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </div>
  )
}

export default DeleteAccount