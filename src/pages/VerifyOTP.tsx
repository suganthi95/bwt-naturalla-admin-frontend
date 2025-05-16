import { ASSETS } from "@/assets/assets"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAppContext } from "@/contexts/AuthContext";
import { resendOtp, verifyOtp } from "@/lib/apis";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner";

function VerifyOTP() {
    const location = useLocation();
    const user = localStorage.getItem("auth");
    const parsedUser = user ? JSON.parse(user) : null;
    const Mail = parsedUser?.data?.email;
     useEffect(() => {
       initializeGA();
       trackpPageView(location.pathname,Mail);
     }, []);
    const [ otp, setOtp ] = useState("");
    const { auth } = useAppContext();
    const navigate = useNavigate();

    const goBackClick = () => {
        localStorage.clear();
        navigate("/sign-up", { replace: true });
        window.location.reload();
    }

    /******************************* Verify OTP **********************************/

    const { mutate, isPending } = useMutation({
        mutationKey: [ "verifyOtp" ],
        mutationFn: verifyOtp,
        onSuccess: () => {
            toast.success("Request Success", {
                description: "Email Verified Successfully",
            });
            navigate(`/welcome`, { replace: true });
        }, 
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", {
                description: error?.response?.data?.message || error.message,
            });
        }
    });

    const submitOtp = () => {
        mutate({
            token: auth?.token as string,
            otp: otp
        })
    }

    /**************************************** Resend OTP ***************************************/

    const { mutate: resendOtpMutate, isPending: resendOtpPending } = useMutation({
        mutationKey: [ "resendOtp" ],
        mutationFn: resendOtp,
        onSuccess: () => {
            toast.success("Request Success", {
                description: "OTP Resent Successfully",
            });
        }, 
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", {
                description: error?.response?.data?.message || error.message,
            });
        }
    });

    const resendOtpSubmit = () => {
        resendOtpMutate({
            token: auth?.token as string
        })
    }


  return (
    <div className="h-screen flex bg-white text-slate-950 pt-2 pr-2">
        <div className="flex flex-1 flex-col justify-center p-2 lg:p-10">  
            <div>
                <Button onClick={goBackClick} size="sm" variant="secondary">Go back</Button>
            </div>
            <div className="flex flex-row gap-3">
                <img src={ASSETS.LOGO} alt="logo" />
                <div>
                    <p className="font-bold text-3xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                    <span className="text-slate-500">
                        Turning Reviews Into Insights
                    </span>
                </div>
            </div>

            <div className="text-slate-700 mt-5 space-y-3">
                <p>Enter the <span className="font-bold">OTP</span> which we sent to your email id <br /></p>

                <div className="pt-3">
                    <InputOTP type="number" maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                        <InputOTPGroup className="flex flex-row gap-3">
                            <InputOTPSlot className="border-none bg-slate-100 rounded-md h-12 w-12" index={0} />
                            <InputOTPSlot className="border-none bg-slate-100 rounded-md h-12 w-12" index={1} />
                            <InputOTPSlot className="border-none bg-slate-100 rounded-md h-12 w-12" index={2} />
                            <InputOTPSlot className="border-none bg-slate-100 rounded-md h-12 w-12" index={3} />
                            <InputOTPSlot className="border-none bg-slate-100 rounded-md h-12 w-12" index={4} />
                            <InputOTPSlot className="border-none bg-slate-100 rounded-md h-12 w-12" index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <div>
                    <Button onClick={resendOtpSubmit} disabled={isPending || resendOtpPending} className="text-primary hover:text-primary" variant="ghost">
                        {resendOtpPending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : "Resend"}
                    </Button>
                </div>

                <Button onClick={submitOtp} disabled={otp.length !== 6 || isPending} className="bg-primary hover:bg-primary/80">
                    {isPending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : "Verify"}
                </Button>
            </div>
        </div>
        <div className="hidden lg:flex flex-1 bg-sandal rounded-lg">
            <div className="flex items-center justify-center w-full">
                <img className="w-2/3" src={ASSETS.VERIFY_EMAIL_IMG} alt="bg-img" />
            </div>
        </div>

    </div>
  )
}

export default VerifyOTP