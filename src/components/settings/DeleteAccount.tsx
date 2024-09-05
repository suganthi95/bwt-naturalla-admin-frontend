import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import Loader from '../ui/Loader';
import { toast } from 'sonner';
import { googleLogout } from '@react-oauth/google';
import { deleteAccount } from '@/lib/apis';
import { useMutation } from '@tanstack/react-query';
import { useAppContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function DeleteAccount() {

    const { auth, setAuth } = useAppContext();
    const navigate = useNavigate();

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
        onError: (error) => {
            toast.error("Request Failed", { description: error?.message})
        }
    });

    if(isPending){
        return <div className="mx-auto mt-[10%]"><Loader/></div>
    }

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
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => mutate(auth?.token as string)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </div>
  )
}

export default DeleteAccount