import { ASSETS } from "@/assets/assets"
import Loader from "@/components/ui/Loader"
import { useAppContext } from "@/contexts/AuthContext";
import { validateUser } from "@/lib/apis";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";
import { ValidateUserType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function PaymentSuccess() {
    const location = useLocation();
    const { auth } = useAppContext();
    useEffect(() => {
      initializeGA();
      trackpPageView(location.pathname,auth?.data.email ?? '');
    }, []);
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
                <img className="w-full h-full object-cover" src={ASSETS.PAYMENT_SUCCESS} alt="img" />
            </div>

            <div>
                <Loader/>
            </div>

            <div className="text-center">
                <h1 className="font-medium text-xl text-green-500">Payment Successful!</h1>
                <p className="text-slate-400 text-sm">Thank you for your purchase. Your subscription is now active, <br /> ensuring a seamless <span className="font-medium">IntelliResponse</span> experience moving forward.</p>
            </div>
        </div>
    </div>
  )
}

export default PaymentSuccess