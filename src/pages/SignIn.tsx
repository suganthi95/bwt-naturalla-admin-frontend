/* eslint-disable @typescript-eslint/no-explicit-any */
import { ASSETS } from "@/assets/assets"
import { Icons } from "@/assets/icons"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAppContext } from "@/contexts/AuthContext"
import useToggle from "@/hooks/useToggle"
import { signinUser, signInUserByGoogle, validateUser, verifyGoogleUser } from "@/lib/apis"
import { ValidateUserType } from "@/types"
import { TokenResponse, useGoogleLogin } from "@react-oauth/google"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"

function SignIn() {

    const [ user, setUser ] = useState<Omit<TokenResponse, "error" | "error_description" | "error_uri">>();
    const { register, handleSubmit } = useForm<{ email: string, password: string }>()
    const { setAuth } = useAppContext();
    const navigate = useNavigate();
    const [ isPasswordVisible, togglePasswordVisibility ] = useToggle();

    const googleLogin = useGoogleLogin({
        onSuccess: (res) => setUser(res),
        onError: (error) => console.log('Login Failed:', error)
    });

    const submitGoogleLogin = () => googleLogin();

    const { data: googleData } = useQuery({
        queryKey: [ "verifyGoogleUser", user ],
        queryFn: () => verifyGoogleUser(user),
        retry: 3,
        refetchOnWindowFocus: false,
        enabled: Boolean(user)
    });

    const { data, isSuccess, isError, error } = useQuery({
        queryKey: [ "signInUserByGoogle", googleData ],
        queryFn: () => signInUserByGoogle({
            email: googleData?.data?.email,
            name: `${googleData?.data?.given_name} ${googleData?.data?.family_name}`,
        }),
        retry: 3,
        refetchOnWindowFocus: false,
        enabled: Boolean(googleData)
    });

    const { mutate, isPending } = useMutation({
        mutationKey: [ "signinUser" ],
        mutationFn: signinUser,
        onSuccess: (data) => {
            setAuth(data.data);
            toast.success("Request Success", { description: "Signed In Successfully" })
            navigate(`/`, { replace: true });
            window.location.reload();
        },
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", { description: error?.response?.data?.message })
        }
    });

    const { isSuccess: validateUserSuccess, data: validateUserData } = useQuery({
        queryKey: [ "validateUser" ],
        queryFn: () => {
            setAuth(data?.data);
            return validateUser(data?.data?.token)
        },
        retry: 0,
        select: (data): ValidateUserType => data?.data?.data,
        refetchOnWindowFocus: false,
        enabled: isSuccess
    });
  
    // if(isLoading){
    //   return (
    //     <div className="h-screen flex items-center justify-center flex-col gap-3">
    //         <div className="hidden lg:flex flex-row items-center gap-1">
    //             <img className="h-8 w-8" src={ASSETS.LOGO} alt="logo" />
    //             <p className="font-bold text-3xl text-primary">Intelli<span className="text-secondary">Response</span></p>
    //         </div>
    //         <div>
    //           <Loader/>
    //         </div>
    //     </div>
    //   )
    // }
  
    if(validateUserSuccess && validateUserData?.onboarded){
        toast.success("Request Success", { description: "Signed In Successfully" });
        return <Navigate to="/dashboard"/>
    }
  
    if(validateUserSuccess && !validateUserData?.onboarded){
        toast.success("Request Success", { description: "Signed In Successfully" });
        return <Navigate to="/onboard"/>
    }

    if(isError){
        toast.error("Request Failed", { description: error?.message })
    }

    const submit = handleSubmit(data => mutate(data));

    useEffect(() => {
        if(window.innerWidth <= 1024){
            toast.success("Use landscape mode for better user experience", { position: "top-center" });
        }
    }, [])

  return (
    <div className="min-h-screen p-0 lg:p-2 flex">
        <div className="bg-[#F8F7F8] rounded-lg flex-1 flex items-center justify-center relative">
            <img className="hidded lg:block absolute z-0" src={ASSETS.SIGNIN_BG_IMG} alt="img" />
            <Card className="relative z-10 px-0 lg:px-6 py-0 lg:py-3 h-[90vh] overflow-y-scroll dark:bg-white dark:border-slate-200 dark:text-slate-950">
                <CardHeader>
                    <Link to="/" className="flex flex-row items-center gap-3 mx-auto">
                        <img src={ASSETS.LOGO} alt="logo" />
                        <div>
                            <p className="font-bold text-4xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                            <span className="text-slate-500">
                                Turning Reviews Into Insights
                            </span>
                        </div>
                    </Link>
                </CardHeader>
                <CardContent className="text-center">
                    <h1 className="text-secondary text-xl font-bold">Sign In</h1>

                    <form onSubmit={submit} className="space-y-3">

                        <div className="flex flex-col items-start gap-1">
                            <label className="font-medium" htmlFor="email">Email <span className="text-red-500">*</span></label>
                            <Input
                                className="dark:bg-white dark:border-slate-200"
                                id="email"
                                type="email"
                                required
                                {...register("email")}
                            />
                        </div>

                        <div className="flex flex-col items-start gap-1 relative">
                            <label className="font-medium" htmlFor="password">Password <span className="text-red-500">*</span></label>
                            <Input
                                className="dark:bg-white dark:border-slate-200"
                                id="password"
                                type={isPasswordVisible ? "text" : "password"} 
                                required
                                {...register("password")}
                            />
                            {isPasswordVisible ? 
                                <Eye onClick={() => togglePasswordVisibility()} className="text-slate-300 absolute cursor-pointer right-3 top-9" />
                            :
                                <EyeOff onClick={() => togglePasswordVisibility()} className="text-slate-300 absolute cursor-pointer right-3 top-9" />
                            }
                        </div>
                        <p className="text-xs text-center">By Continuing, you agree to our <Link className="text-blue-500 hover:underline" to="https://intelliresponse.ai/en/terms-and-conditions" target="_blank">Terms and Conditions</Link>, <Link className="text-blue-500 hover:underline" to="https://intelliresponse.ai/en/privacy-policy" target="_blank">Privacy Policy</Link> <br /> and <Link className="text-blue-500 hover:underline" to="https://intelliresponse.ai/en/end-user-license-agreement" target="_blank">End User License Agreement</Link></p>
                        <div>
                            <Button className="w-full mt-3 bg-primary hover:bg-primary/50 dark:bg-primary dark:text-white hover:dark:bg-primary/60">
                                {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "Sign In"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-5">
                    <p className="text-slate-400 text-xs">Or use your Google account credentials to log in securely.</p>
                    {/* <Button onClick={submitGoogleLogin} className="mx-auto py-6 px-10 rounded-[50px] flex items-center gap-3 dark:bg-slate-50 dark:border-slate-200 hover:dark:bg-slate-50/5 hover:dark:text-black" variant="outline">
                        <Icons.googleIcon/>
                        Sign in with Google
                    </Button> */}
                    <AlertDialog>
                        <AlertDialogTrigger className="w-full">
                            <Button className="w-full flex flex-row items-center gap-2 dark:bg-slate-50 dark:border-slate-200 hover:dark:bg-slate-50/5 hover:dark:text-black" variant="outline">
                                <Icons.googleIcon/>
                                Continue with Google
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Contact Us</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please contact IntelliResponse team.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogAction>Okay</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <p className="mt-3">Don't have an account ? <Link to="/sign-up" className="font-bold hover:underline">Sign Up</Link></p>
                </CardFooter>
            </Card>

            <h1 className="text-sm absolute bottom-0 hidden md:block">
                © 2024 Copyrights by <Link className="font-bold hover:underline" to="https://intelliresponse.ai/">IntelliResponse</Link> All Rights Reserved. Developed by <Link className="font-bold hover:underline" to="https://blackwinstech.com/">Blackwins Tech Solutions</Link>
            </h1>
        </div>
    </div>
  )
}

export default SignIn