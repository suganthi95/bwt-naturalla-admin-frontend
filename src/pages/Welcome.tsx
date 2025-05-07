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

function Welcome() {
    const location = useLocation();
    const user = localStorage.getItem("auth");
    const parsedUser = user ? JSON.parse(user) : null;
    const Mail = parsedUser?.data?.email;
     useEffect(() => {
       initializeGA();
       trackpPageView(location.pathname,Mail);
     }, []);
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
        toast.error("Request Failed", { description: error?.message })
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate("/onboard")
        }, 5000);

        return () => clearTimeout(timeout);

    }, [])

  return (
    <div className="min-h-screen p-0 lg:p-2 bg-white">
        <div className="flex flex-row gap-3 mx-16">
            <img src={ASSETS.LOGO} alt="logo" />
            <div>
                <p className="font-bold text-3xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                <span className="text-slate-500">
                    Turning Reviews Into Insights
                </span>
            </div>
        </div>

        <div className="flex flex-col items-center justify-between h-full gap-5 py-10">
            <div className="w-1/3">
                <img className="w-full h-full object-cover" src={ASSETS.WELCOME_IMG} alt="img" />
            </div>

            <div>
                <Loader/>
            </div>

            <div className="text-center mt-5">
                <h1 className="font-medium text-xl">Welcome to IntelliResponse!</h1>
                <p className="text-slate-400 text-sm">We’re excited to have you on board. Let’s get started with a few quick <br />questions to set up your account and personalize your experience.</p>
            </div>
        </div>
    </div>
  )
}

export default Welcome