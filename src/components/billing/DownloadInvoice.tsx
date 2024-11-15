import { LoaderCircle, ReceiptText } from "lucide-react"
import { Button } from "../ui/button"
import { useMutation } from "@tanstack/react-query"
import { fetchInvoice } from "@/lib/apis"
import { useAppContext } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { downloadBlobAsPDF } from "@/lib/utils"

function DownloadInvoice({ paymentId }: { paymentId: string }) {

    const { auth } = useAppContext();
    const { mutate, isPending } = useMutation({
        mutationKey: [ "fetchInvoice" ],
        mutationFn: fetchInvoice,
        onSuccess: (data) => {
            downloadBlobAsPDF(data.data);
        },
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", { description: error?.response?.data || error?.message });
        }  
    });

    const onclick = () => {
        mutate({
            paymentId,
            token: auth?.token as string
        })
    }

  return (
    <Button disabled={isPending} onClick={onclick} title="Download Invoice" size="icon" variant="secondary">
        {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ReceiptText className="h-5 w-5 stroke-primary" />}
    </Button>
  )
}

export default DownloadInvoice