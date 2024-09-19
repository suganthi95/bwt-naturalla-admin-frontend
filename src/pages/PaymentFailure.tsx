import { ASSETS } from "@/assets/assets"
import Loader from "@/components/ui/Loader"
import { useAppContext } from "@/contexts/AuthContext";
import { validateUser } from "@/lib/apis";
import { ValidateUserType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function PaymentFailure() {

    const { auth } = useAppContext();
    const navigate = useNavigate();
    const { isError, error } = useQuery({
        queryKey: [ "validateUser" ],
        queryFn: () => validateUser(auth?.token as string),
        retry: 0,
        select: (data): ValidateUserType => data?.data?.data,
        enabled: Boolean(auth?.token)
    });

    if(isError){
        toast.error("Request Failed", { description: error?.message });
        navigate("/billing");
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate("/billing")
        }, 5000);

        return () => clearTimeout(timeout);

    }, [])

  return (
    <div className={`h-screen pb-20 overflow-y-scroll p-0 lg:p-2 bg-cover bg-no-repeat bg-[url('https://ik.imagekit.io/zshycew5c/intelliresponse/payment-bg-pattern?updatedAt=1726729266106')]`}>

        <div className="flex flex-col items-center justify-between gap-5">
            <div className="">
                <img className="w-full h-full object-cover" src={ASSETS.PAYMENT_FAILURE} alt="img" />
            </div>

            <div>
                <Loader/>
            </div>

            <div className="text-center">
                <h1 className="font-medium text-xl text-red-500">Payment Unsuccessful!</h1>
                <p className="text-slate-400 text-sm">Unfortunately, your payment was unsuccessful. Please try again to <br /> ensure uninterrupted access to your <span className="font-medium">IntelliResponse</span> experience.</p>
            </div>
        </div>
    </div>
  )
}

export default PaymentFailure