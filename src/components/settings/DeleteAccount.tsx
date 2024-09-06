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

function DeleteAccount() {

    const { auth, setAuth } = useAppContext();
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
            localStorage.removeItem("auth");
            googleLogout();
            window.location.reload();
            navigate("/", { replace: true })
        },
        onError: (error: AxiosError<any>) => {
            toast.error("Request Failed", { description: error?.response?.data?.message});
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
                Delete My Account
            </p>
            {/* <p className="text-sm text-slate-400">
                Use the toggles to turn notifications on or off as you prefer.
            </p> */}
        </div>
        <div>
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button className="bg-red-500 hover:bg-red-500/80">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </div>

                        <form>
                            <div className='py-3 space-y-1'>
                                <label htmlFor="confirm-email" className='font-bold'>Please confirm your Email <span className='text-red-500'>*</span></label>
                                <Input
                                    className='mt-1'
                                    type='email'
                                    id='confirm-email'
                                    {...register("email", {
                                        required: {
                                            value: true,
                                            message: "Please confirm your email"
                                        },
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "invalid email address"
                                        }
                                    })}
                                />
                                <p className='text-xs font-medium text-red-500'>{errors?.email?.message}</p>
                            </div>
                            <div className='flex items-center justify-end gap-3'>
                                <AlertDialogCancel asChild>
                                    <Button variant="secondary" onClick={() => reset()}>Cancel</Button>
                                </AlertDialogCancel>
                                <AlertDialogAction type='submit' asChild>
                                    <Button onClick={deleteAccountMutate}>Continue</Button>
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