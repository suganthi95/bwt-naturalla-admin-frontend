/* eslint-disable @typescript-eslint/no-explicit-any */
import { ASSETS } from "@/assets/assets"
import OnBoardFive from "@/components/onboard/OnBoardFive";
import OnBoardFour from "@/components/onboard/OnBoardFour";
import OnBoardOne from "@/components/onboard/OnBoardOne";
import OnBoardSix from "@/components/onboard/OnBoardSix";
import OnBoardThree from "@/components/onboard/OnBoardThree";
import OnBoardTwo from "@/components/onboard/OnBoardTwo";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AuthContext";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";
import { OnBoardType } from "@/types";
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom"

function OnBoard() {
    const location = useLocation();
   const { auth } = useAppContext();
    useEffect(() => {
      initializeGA();
      trackpPageView(location.pathname,auth?.data.email ?? '');
    }, []);
    const navigate = useNavigate();

    const formState = useForm<OnBoardType>({
        defaultValues: {
            industry: [],
        }
    });

    const [ page, setPage ] = useState(0);

    const section = [
        {
            form: <OnBoardOne setPage={setPage}/>,
            image: ASSETS.ONBOARD_01
        },
        {
            form: <OnBoardTwo setPage={setPage}/>,
            image: ASSETS.ONBOARD_02
        },
        {
            form: <OnBoardThree setPage={setPage}/>,
            image: ASSETS.ONBOARD_03
        },
        {
            form: <OnBoardFour setPage={setPage}/>,
            image: ASSETS.ONBOARD_04
        },
        {
            form: <OnBoardFive setPage={setPage}/>,
            image: ASSETS.ONBOARD_05
        },
        {
            form: <OnBoardSix/>,
            image: ASSETS.ONBOARD_05
        },
    ];

    const goBackClick = () => {
        localStorage.clear();
        navigate("/sign-in", { replace: true });
        window.location.reload();
    }

  return (
    <div className="h-svh overflow-y-scroll  flex bg-white text-slate-950 pt-20">
        <div className="flex flex-1 flex-col justify-center p-2 lg:p-10">  
            <div>
                <Button onClick={goBackClick} size="sm" variant="secondary">Go back</Button>
            </div>
            <Link to="/" className="flex flex-row gap-3">
                <img src={ASSETS.LOGO} alt="logo" className="w-8 md:w-auto" />
                <div>
                    <p className="font-bold text-xl md:text-3xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                    <span className="text-slate-500">
                        Turning Reviews Into Insights
                    </span>
                </div>
            </Link>

            <div className="mt-3 flex flex-row gap-2">
                {[0, 1, 2, 3, 4, 5].map((item: number) => (
                    <div key={`stepper-${item}`} className={`w-10 h-1 rounded-3xl ${page >= item ? "bg-primary" : "bg-slate-400"}`}></div>
                ))}
            </div>

            <div className="mt-1">
                <p>{page + 1} of 6</p>
            </div>
            <FormProvider {...formState}>
                {section[page].form}
            </FormProvider>
        </div>
        <div className="hidden lg:flex flex-1 bg-sandal rounded-lg">
            <div className="flex items-center justify-center w-full">
                <img className="w-2/3" src={section[page].image} alt="bg-img" />
            </div>
        </div>

    </div>
  )
}

export default OnBoard