/* eslint-disable @typescript-eslint/no-explicit-any */
import { ASSETS } from "@/assets/assets"
import { Icons } from "@/assets/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TokenResponse, useGoogleLogin } from "@react-oauth/google"
import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { SignUpType, ValidateUserType } from "@/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { signInUserByGoogle, signupUser, validateUser, verifyGoogleUser } from "@/lib/apis"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { useAppContext } from "@/contexts/AuthContext"
import { AxiosError } from "axios"
import useToggle from "@/hooks/useToggle"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

function SignUp() {

    const [ user, setUser ] = useState<Omit<TokenResponse, "error" | "error_description" | "error_uri">>();
    const { register, handleSubmit, watch, formState: { errors }, setError } = useForm<SignUpType>();
    const { setAuth } = useAppContext();
    const navigate = useNavigate();
    const [ isPasswordVisible, togglePasswordVisibility ] = useToggle();
    const [ isConfirmPasswordVisible, toggleConfirmPasswordVisibility ] = useToggle();

    const googleLogin = useGoogleLogin({
        onSuccess: (res) => setUser(res),
        onError: (error) => toast.error("Request Failed", { description: error?.error_description })
    });

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

    const { mutate, isPending } = useMutation({
        mutationKey: [ "signupUser" ],
        mutationFn: signupUser,
        onSuccess: (data) => {
            setAuth(data.data);
            toast.success("Request Success", { description: "Signed Up Successfully" });
            navigate(`/welcome`, { replace: true });
        },
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", { description: error?.response?.data?.message })
        },
    })
 
    const submitGoogleLogin = () => googleLogin();

    const submit = handleSubmit(data => {
        mutate({
            name: data.username,
            email: data.email,
            password: data.password
        })
    });

    useEffect(() => {
        if(watch("confirmPassword") !== watch("password") && watch("confirmPassword") !== ""){
            setError("confirmPassword", { message: "Password does not match", type: "required" });
        }else{
            setError("confirmPassword", { message: "", type: "required" });
        }
    }, [ watch("confirmPassword") ]);


    useEffect(() => {
        if(window.innerWidth <= 1024){
            toast.success("Use landscape mode for better user experience", { position: "top-center" });
        }
    }, [])


  return (
    <div className="p-0 lg:p-2 flex bg-sandal h-screen overflow-y-scroll">
        <div className="hidden lg:flex flex-1">
            <div className="flex items-center justify-center w-full">
                <img className="w-2/3" src={ASSETS.SIGNUP_BG_IMG} alt="bg-img" />
            </div>
        </div>
        <div className="flex flex-1 flex-col justify-center rounded-xl bg-white relative h-full">
            <Link to="/" className="flex flex-row items-center gap-3 mx-auto">
                <img src={ASSETS.LOGO} alt="logo" />
                <div>
                    <p className="font-bold text-3xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                    <span className="text-slate-500">
                        Turning Reviews Into Insights
                    </span>
                </div>
            </Link>
            <div className="py-0 px-2 md:px-20 lg:px-32">
                <h1 className="text-secondary text-xl font-bold text-center">Sign Up</h1>
                <p className="text-xs text-slate-500 text-center">Create your review engagement account here.</p>

                <form 
                    // onSubmit={submit}
                >

                    <div className="flex flex-col items-start gap-1">
                        <label className="font-medium text-xs" htmlFor="username">Username <span className="text-red-500">*</span></label>
                        <Input
                            className="dark:bg-white dark:border-slate-200"
                            id="username"
                            type="text"
                            {...register("username", {
                                required: {
                                    value: true,
                                    message: "Username is required"
                                }
                            })}
                            required
                        />
                        <p className="text-xs mt-1 font-medium text-red-500">{errors?.username?.message}</p>
                    </div>

                    <div className="flex flex-col items-start gap-1">
                        <label className="font-medium text-xs" htmlFor="email">Email <span className="text-red-500">*</span></label>
                        <Input 
                            className="dark:bg-white dark:border-slate-200"
                            id="email"
                            type="email"
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "Email is required"
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "email format is not valid"
                                }
                            })}
                            required
                        />
                        <p className="text-xs mt-1 font-medium text-red-500">{errors?.email?.message}</p>
                    </div>

                    <div className="flex flex-col items-start gap-1 relative">
                        <label className="font-medium text-xs" htmlFor="password">Password <span className="text-red-500">*</span></label>
                        <Input 
                            className="dark:bg-white dark:border-slate-200"
                            id="password"
                            type={isPasswordVisible ? "text" : "password"} 
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Password is required"
                                },
                                minLength: {
                                    value: 6,
                                    message: "Password must be atleast 6 characters"
                                }
                            })}
                            required
                        />
                        {isPasswordVisible ? 
                            <Eye onClick={() => togglePasswordVisibility()} className="text-slate-300 absolute cursor-pointer right-3 top-7" />
                        :
                            <EyeOff onClick={() => togglePasswordVisibility()} className="text-slate-300 absolute cursor-pointer right-3 top-7" />
                        }
                        <p className="text-xs mt-1 font-medium text-red-500">{errors?.password?.message}</p>
                    </div>

                    <div className="flex flex-col items-start gap-1 relative">
                        <label className="font-medium text-xs" htmlFor="email">Confirm Password <span className="text-red-500">*</span></label>
                        <Input 
                            className="dark:bg-white dark:border-slate-200"
                            id="confirmPassword"
                            type={isConfirmPasswordVisible ? "text" : "password"} 
                            {...register("confirmPassword", {
                                validate: (value) => {
                                    if(!value){
                                        return "Confirm Password is required"
                                    }else if(watch("password") !== value){
                                        return "Passwords does not match"
                                    }
                                }
                            })}
                            required
                        />
                        {isConfirmPasswordVisible ? 
                            <Eye onClick={() => toggleConfirmPasswordVisibility()} className="text-slate-300 absolute cursor-pointer right-3 top-7" />
                        :
                            <EyeOff onClick={() => toggleConfirmPasswordVisibility()} className="text-slate-300 absolute cursor-pointer right-3 top-7" />
                        }
                        <p className="text-xs mt-1 font-medium text-red-500">{errors?.confirmPassword?.message}</p>
                    </div>

                    <p className="text-xs text-center">By Continuing, you agree to our <Link className="text-blue-500 hover:underline" to="https://intelliresponse.ai/en/terms-and-conditions" target="_blank">Terms and Conditions</Link>, <Link className="text-blue-500 hover:underline" to="https://intelliresponse.ai/en/privacy-policy" target="_blank">Privacy Policy</Link> <br /> and <Link className="text-blue-500 hover:underline" to="https://intelliresponse.ai/en/end-user-license-agreement" target="_blank">End User License Agreement</Link></p>

                    {/* <div>
                        <Button className="w-full mt-3 bg-primary hover:bg-primary/50 dark:bg-primary dark:text-white hover:dark:bg-primary/60">
                            {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "Sign Up"}
                        </Button>
                    </div> */}
                    <div>
                        <AlertDialog>
                            <AlertDialogTrigger className="w-full">
                                <Button type="button" className="w-full mt-3 bg-primary hover:bg-primary/50 dark:bg-primary dark:text-white hover:dark:bg-primary/60">
                                    {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "Sign Up"}
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
                    </div>
                </form>

                <p className="text-slate-400 text-center">Or</p>
                {/* <Button onClick={submitGoogleLogin} className="w-full flex flex-row items-center gap-2 dark:bg-slate-50 dark:border-slate-200 hover:dark:bg-slate-50/5 hover:dark:text-black" variant="outline">
                    <Icons.googleIcon/>
                    Continue with Google
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

                <p className="mt-3 text-center text-xs">Already have an account ? <Link to="/sign-in" className="font-bold hover:underline">Sign In</Link></p>
                
                <p className="text-sm text-center w-full mx-auto mt-10">
                    © 2024 Copyrights by <Link className="font-bold hover:underline" to="https://intelliresponse.ai/">IntelliResponse</Link> All Rights Reserved. Developed by <Link className="font-bold hover:underline" to="https://blackwinstech.com/">Blackwins Tech Solutions</Link>
                </p>
            </div>
        </div>

    </div>
  )
}

export default SignUp