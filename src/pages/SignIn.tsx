/* eslint-disable @typescript-eslint/no-explicit-any */
import { ASSETS } from "@/assets/assets"
import { Icons } from "@/assets/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAppContext } from "@/contexts/AuthContext"
import useToggle from "@/hooks/useToggle"
import { signinUser, signInUserByGoogle, verifyGoogleUser } from "@/lib/apis"
import { TokenResponse, useGoogleLogin } from "@react-oauth/google"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
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
            navigate(`/overview`, { replace: true });
        },
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", { description: error?.response?.data?.message })
        }
    });

    if(isSuccess && data?.data?.data?.onboarded){
        setAuth(data.data);
        toast.success("Request Success", { description: "Signed In Successfully" })
        navigate(`/overview`, { replace: true });
    }

    if(isSuccess && !data?.data?.data?.onboarded){
        setAuth(data.data);
        toast.success("Request Success", { description: "Signed In Successfully" })
        navigate(`/onboard`, { replace: true });
    }

    if(isError){
        toast.error("Request Failed", { description: error?.message })
    }

    const submit = handleSubmit(data => mutate(data))


  return (
    <div className="min-h-screen p-0 lg:p-2 flex">
        <div className="bg-[#F8F7F8] rounded-lg flex-1 flex items-center justify-center relative">
            <img className="hidded lg:block absolute z-0" src={ASSETS.SIGNIN_BG_IMG} alt="img" />
            <Card className="relative z-10 px-0 lg:px-6 py-0 lg:py-3">
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
                    <h1 className="text-secondary text-3xl font-bold">Sign In</h1>

                    <form onSubmit={submit} className="space-y-3">

                        <div className="flex flex-col items-start gap-1">
                            <label className="font-medium" htmlFor="email">Email <span className="text-red-500">*</span></label>
                            <Input
                                id="email"
                                type="email"
                                required
                                {...register("email")}
                            />
                        </div>

                        <div className="flex flex-col items-start gap-1 relative">
                            <label className="font-medium" htmlFor="password">Password <span className="text-red-500">*</span></label>
                            <Input
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

                        <div>
                            <Button className="w-full mt-3 bg-primary hover:bg-primary/50">
                                {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "Sign In"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-5">
                    <p className="text-slate-400">Or use your Google account credentials to log in securely.</p>
                    <Button onClick={submitGoogleLogin} className="mx-auto py-6 px-10 rounded-[50px] flex items-center gap-3" variant="outline">
                        <Icons.googleIcon/>
                        Sign in with Google
                    </Button>

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