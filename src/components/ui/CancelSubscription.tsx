import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";
import { cancelSubscription } from "@/lib/apis";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAppContext } from "@/contexts/AuthContext";
import { Trans, useTranslation } from "react-i18next";

function CancelSubscription({ Canceled }: { Canceled: Boolean }) {
  const { auth } = useAppContext();
  const {t} =useTranslation()
  const { mutate } = useMutation({
    mutationKey: ["cancelSubscription"],
    mutationFn: cancelSubscription,
    onSuccess: (data) => {
      console.log("data: ", data);
      window.location.reload();
      toast.success(t('request_success'), { description: data?.data?.message });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(t('request_failed'), {
        description: error?.response?.data?.message,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-red-500 hover:bg-red-500/80">
          {Canceled ? <Trans i18nKey={'cancelled'}/> : <Trans i18nKey={'cancel_subscription'}/>}{" "}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {" "}
            <Trans i18nKey={"are_you_sure"} />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <Trans i18nKey={"action_cannot_be_undone"} />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary">
              <Trans i18nKey={"cancel"} />
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction type="submit" asChild>
            <Button
              onClick={() => mutate({ token: auth?.token as string })}
              variant="destructive"
            >
              <Trans i18nKey={"continue"} />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CancelSubscription;
