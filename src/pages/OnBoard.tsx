/* eslint-disable @typescript-eslint/no-explicit-any */
import { ASSETS } from "@/assets/assets"
import OnBoardFive from "@/components/onboard/OnBoardFive";
import OnBoardFour from "@/components/onboard/OnBoardFour";
import OnBoardOne from "@/components/onboard/OnBoardOne";
import OnBoardThree from "@/components/onboard/OnBoardThree";
import OnBoardTwo from "@/components/onboard/OnBoardTwo";
import { useAppContext } from "@/contexts/AuthContext";
import { onBoardUser } from "@/lib/apis";
import { OnBoardType } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner";

function OnBoard() {

    const { setAuth } = useAppContext();
    const navigate = useNavigate();
    const formState = useForm<OnBoardType>();
    const { auth } = useAppContext();

    const [ page, setPage ] = useState(0);

    const { mutate, isPending } = useMutation({
        mutationKey: [ "onBoardUser" ],
        mutationFn: onBoardUser,
        onSuccess: (data) => {
            setAuth(data.data);
            toast.success("Request Success", { description: "Signed In Successfully" })
            navigate(`/overview`, { replace: true });
        },
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", { description: error?.response?.data?.message })
        }
    });

    const submitOnboardForm = formState.handleSubmit(data => {
        mutate({
            business_type: data.business,
            heard_through: data.heardThrough,
            industry: data.industry,
            role: data.role,
            workspace_name: data.workspaceName,
            token: auth?.token as string
        })
    })

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
            form: <OnBoardFive submitOnboardForm={submitOnboardForm} isPending={isPending}/>,
            image: ASSETS.ONBOARD_05
        },
    ]

  return (
    <div className="min-h-screen p-2 flex bg-white">
        <div className="flex flex-1 flex-col justify-center p-10">
            <Link to="/" className="flex flex-row gap-3">
                <img src={ASSETS.LOGO} alt="logo" />
                <div>
                    <p className="font-bold text-3xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                    <span className="text-slate-500">
                        Turning Reviews Into Insights
                    </span>
                </div>
            </Link>

            <div className="mt-3 flex flex-row gap-2">
                {[0, 1, 2, 3, 4].map((item: number) => (
                    <div key={`stepper-${item}`} className={`w-10 h-1 rounded-3xl ${page >= item ? "bg-primary" : "bg-slate-400"}`}></div>
                ))}
            </div>

            <div className="mt-1">
                <p>{page + 1} of 5</p>
            </div>
            <FormProvider {...formState}>
                {section[page].form}
            </FormProvider>
        </div>
        <div className="flex flex-1 bg-sandal rounded-lg">
            <div className="flex items-center justify-center w-full">
                <img className="w-2/3" src={section[page].image} alt="bg-img" />
            </div>
        </div>

    </div>
  )
}

export default OnBoard