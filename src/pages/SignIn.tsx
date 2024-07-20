import { ASSETS } from "@/assets/assets"
import { Icons } from "@/assets/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useAppContext } from "@/contexts/AuthContext"
import { signInUser, verifyGoogleUser } from "@/lib/apis"
import { TokenResponse, useGoogleLogin } from "@react-oauth/google"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

function SignIn() {

    const [ user, setUser ] = useState<Omit<TokenResponse, "error" | "error_description" | "error_uri">>();
    const { setAuth } = useAppContext();
    const navigate = useNavigate();

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
        queryKey: [ "signInUser", googleData ],
        queryFn: () => signInUser({
            email: googleData?.data?.email,
            phone: googleData?.data?.phone_number,
            profilePic: googleData?.data?.picture,
            fullname: `${googleData?.data?.given_name} ${googleData?.data?.family_name}`,
            username: googleData?.data?.name,
            token: user?.access_token
        }),
        retry: 3,
        refetchOnWindowFocus: false,
        enabled: Boolean(googleData)
    });

    if(isSuccess){
        setAuth(data.data);
        toast.success("Request Success", { description: "Signed In Successfully" })
        navigate(`/overview`, { replace: true });
    }

    if(isError){
        toast.error("Request Failed", { description: error?.message })
    }



  return (
    <div className="min-h-screen p-2 flex">
        <div className="bg-[#F8F7F8] rounded-lg flex-1 flex items-center justify-center relative">
            <img className="absolute z-0" src={ASSETS.SIGNIN_BG_IMG} alt="img" />
            <Card className="relative z-10 p-6 space-y-10">
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
                    <p className="text-slate-400">Use your Google account credentials to log in securely.</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={submitGoogleLogin} className="mx-auto py-6 px-10 rounded-[50px] flex items-center gap-3" variant="outline">
                        <Icons.googleIcon/>
                        Sign in with Google
                    </Button>
                </CardFooter>
            </Card>

            <h1 className="text-sm absolute bottom-0">
                © 2024 Copyrights by <span className="font-bold">IntelliResponse</span> All Rights Reserved. Developed by <span className="font-bold">Blackwins Tech Solutions</span>
            </h1>
        </div>
    </div>
  )
}

export default SignIn