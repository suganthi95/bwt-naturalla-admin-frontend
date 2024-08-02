/* eslint-disable @typescript-eslint/no-explicit-any */
import { ASSETS } from "@/assets/assets"
import { Icons } from "@/assets/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TokenResponse, useGoogleLogin } from "@react-oauth/google"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { SignUpType } from "@/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { signInUserByGoogle, signupUser, verifyGoogleUser } from "@/lib/apis"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { useAppContext } from "@/contexts/AuthContext"
import { AxiosError } from "axios"
import useToggle from "@/hooks/useToggle"

function SignUp() {

    const [ user, setUser ] = useState<Omit<TokenResponse, "error" | "error_description" | "error_uri">>();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpType>();
    const { setAuth } = useAppContext();
    const navigate = useNavigate();
    const [ isPasswordVisible, togglePasswordVisibility ] = useToggle();
    const [ isConfirmPasswordVisible, toggleConfirmPasswordVisibility ] = useToggle();

    const googleLogin = useGoogleLogin({
        onSuccess: (res) => setUser(res),
        onError: (error) => console.log('Login Failed:', error)
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

    if(isSuccess){
        setAuth(data.data);
        toast.success("Request Success", { description: "Signed In Successfully" })
        navigate(`/onboard`, { replace: true });
    }

    if(isError){
        toast.error("Request Failed", { description: error?.message })
    }

    const { mutate, isPending } = useMutation({
        mutationKey: [ "signupUser" ],
        mutationFn: signupUser,
        onSuccess: (data) => {
            setAuth(data.data);
            toast.success("Request Success", { description: "Signed Up Successfully" })
            navigate(`/onboard`, { replace: true });
        },
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", { description: error?.response?.data?.message })
        },
    })
 
    const submitGoogleLogin = () => googleLogin();

    const submit = handleSubmit(data => mutate({
        name: data.username,
        email: data.email,
        password: data.password
    }))


  return (
    <div className="min-h-screen p-2 flex bg-sandal">
        <div className="flex flex-1">
            <div className="flex items-center justify-center w-full">
                <img className="w-2/3" src={ASSETS.SIGNUP_BG_IMG} alt="bg-img" />
            </div>
        </div>
        <div className="flex flex-1 flex-col justify-between rounded-xl bg-white">
            <Link to="/" className="flex flex-row items-center gap-3 mx-auto">
                <img src={ASSETS.LOGO} alt="logo" />
                <div>
                    <p className="font-bold text-3xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                    <span className="text-slate-500">
                        Turning Reviews Into Insights
                    </span>
                </div>
            </Link>
            <div className="py-0 px-32 space-y-2">
                <h1 className="text-secondary text-2xl font-bold text-center">Sign Up</h1>
                <p className="text-sm text-slate-500 text-center">Create your review management account here.</p>

                <form onSubmit={submit}>

                    <div className="flex flex-col items-start gap-1">
                        <label className="font-medium" htmlFor="username">Username <span className="text-red-500">*</span></label>
                        <Input
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
                        <label className="font-medium" htmlFor="email">Email <span className="text-red-500">*</span></label>
                        <Input 
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
                        <label className="font-medium" htmlFor="password">Password <span className="text-red-500">*</span></label>
                        <Input 
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
                            <Eye onClick={() => togglePasswordVisibility()} className="text-slate-300 absolute cursor-pointer right-3 top-9" />
                        :
                            <EyeOff onClick={() => togglePasswordVisibility()} className="text-slate-300 absolute cursor-pointer right-3 top-9" />
                        }
                        <p className="text-xs mt-1 font-medium text-red-500">{errors?.password?.message}</p>
                    </div>

                    <div className="flex flex-col items-start gap-1 relative">
                        <label className="font-medium" htmlFor="email">Confirm Password <span className="text-red-500">*</span></label>
                        <Input 
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
                            <Eye onClick={() => toggleConfirmPasswordVisibility()} className="text-slate-300 absolute cursor-pointer right-3 top-9" />
                        :
                            <EyeOff onClick={() => toggleConfirmPasswordVisibility()} className="text-slate-300 absolute cursor-pointer right-3 top-9" />
                        }
                        <p className="text-xs mt-1 font-medium text-red-500">{errors?.confirmPassword?.message}</p>
                    </div>

                    <div>
                        <Button className="w-full mt-3 bg-primary hover:bg-primary/50">
                            {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "Sign Up"}
                        </Button>
                    </div>
                </form>

                <p className="text-slate-400 text-center">Or</p>
                <Button onClick={submitGoogleLogin} className="w-full flex flex-row items-center gap-2" variant="outline">
                    <Icons.googleIcon/>
                    Continue with Google
                </Button>

                <p className="mt-3 text-center">Already have an account ? <Link to="/sign-in" className="font-bold hover:underline">Sign In</Link></p>
                
            </div>

            <h1 className="text-sm text-center">
                © 2024 Copyrights by <Link className="font-bold hover:underline" to="https://intelliresponse.ai/">IntelliResponse</Link> All Rights Reserved. Developed by <Link className="font-bold hover:underline" to="https://blackwinstech.com/">Blackwins Tech Solutions</Link>
            </h1>
        </div>

    </div>
  )
}

export default SignUp