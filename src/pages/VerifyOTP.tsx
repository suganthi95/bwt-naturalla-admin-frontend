import { ASSETS } from "@/assets/assets"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";
import { useNavigate } from "react-router-dom"

function VerifyOTP() {

    const [ otp, setOtp ] = useState("");

    const navigate = useNavigate();

    const goBackClick = () => {
        localStorage.clear();
        navigate("/sign-up", { replace: true });
        window.location.reload();
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
                <p>Enter the <span className="font-bold">OTP</span> which we sent to your email id <br /> “example@gmail.com”</p>

                <div className="pt-3">
                    <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
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
                    <Button className="text-primary hover:text-primary" variant="ghost">Resend</Button>
                </div>

                <Button disabled={otp.length !== 6} className="bg-primary hover:bg-primary/80">Verify</Button>
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