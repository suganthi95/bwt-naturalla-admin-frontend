/* eslint-disable @typescript-eslint/no-explicit-any */
import { ASSETS } from "@/assets/assets";
import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/AuthContext";
import useToggle from "@/hooks/useToggle";
import { signinUser, signInUserByGoogle, verifyGoogleUser } from "@/lib/apis";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";
import { AuthType } from "@/types";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function SignIn() {
  const location = useLocation();
  const user = localStorage.getItem("auth");
  const parsedUser = user ? JSON.parse(user) : null;
  const Mail = parsedUser?.data?.email;
  useEffect(() => {
    initializeGA();
    trackpPageView(location.pathname, Mail);
  }, []);
  const { register, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>();

  const { setAuth } = useAppContext();
  const {t} = useTranslation()
  const navigate = useNavigate();
  const [isPasswordVisible, togglePasswordVisibility] = useToggle();

  /***************************************** Google signup **********************************************/

  const { mutate: signInUserByGoogleMutate } = useMutation({
    mutationKey: ["signInUserByGoogle"],
    mutationFn: signInUserByGoogle,
    onSuccess: (res: AxiosResponse<AuthType>) => {
      setAuth(res?.data);

      if (res?.data?.data?.onboarded === true) {
        toast.success(t('request_success'), {
          description: t('signed_in_successfully'),
        });
        navigate("/dashboard", { replace: true });
        window.location.reload();
      }

      if (res?.data?.data?.onboarded === false) {
        toast.success(t('request_success'), {
          description: t('signed_in_successfully'),
        });
        navigate("/onboard", { replace: true });
        window.location.reload();
      }
    },
    onError: (error: AxiosError<any>) =>
      toast.error(t('request_failed'), {
        description: error?.response?.data.message || error?.message,
      }),
  });

  const { mutate: verifyGoogleUserMutate } = useMutation({
    mutationKey: ["verifyGoogleUser"],
    mutationFn: verifyGoogleUser,
    onSuccess: (res) => {
      signInUserByGoogleMutate({
        email: res?.data?.email,
        name: `${res?.data?.given_name} ${res?.data?.family_name}`,
      });
    },
    onError: (error: AxiosError<any>) =>
      toast.error(t('request_failed'), {
        description: error?.response?.data.message || error?.message,
      }),
  });

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => verifyGoogleUserMutate(res),
    onError: (error) =>
            toast.error(t('request_failed'), { description: error.error_description }),
  });

  const submitGoogleLogin = () => googleLogin();

  /*************************************** Normal Sign in ***********************************************/

  const { mutate, isPending } = useMutation({
    mutationKey: ["signinUser"],
    mutationFn: signinUser,
    onSuccess: (data) => {
      setAuth(data.data);
      toast.success(t('request_success'), {
        description:t('signed_in_successfully'),
      });
      navigate(`/`, { replace: true });
      window.location.reload();
    },
    onError: (error: AxiosError<any>) => {
      console.log(error);
      toast.error(t('request_failed'), {
        description: error?.response?.data?.message,
      });
    },
  });

  const submit = handleSubmit((data) => mutate(data));

  useEffect(() => {
    if (window.innerWidth <= 1024) {
      toast.success(t('use_landscape_mode'), {
        position: "top-center",
      });
    }
  }, []);

  return (
    <div className="min-h-screen p-0 lg:p-2 flex overflow-hidden">
      <div className="bg-[#F8F7F8] rounded-lg flex-1 flex items-center justify-center relative">
        <img
          className="hidden lg:block absolute z-0"
          src={ASSETS.SIGNIN_BG_IMG}
          alt="img"
        />
        <Card className="relative z-10 px-0 lg:px-6 py-0 lg:py-3 h-[90vh]  dark:bg-white dark:border-slate-200 dark:text-slate-950">
          <CardHeader>
            <Link to="/" className="flex flex-row items-center gap-3 mx-auto">
              <img src={ASSETS.LOGO} alt="logo" />
              <div>
                <p className="font-bold text-2xl md:text-4xl text-primary">
                  Intelli<span className="text-secondary">Response</span>
                </p>
                <span className="text-slate-500 text-sm">
                  <Trans i18nKey={"title"} />
                </span>
              </div>
            </Link>
          </CardHeader>
          <CardContent className="text-center">
            <h1 className="text-secondary text-xl font-bold">
              <Trans i18nKey={"signIn"} />
            </h1>

            <form onSubmit={submit} className="space-y-3">
              <div className="flex flex-col items-start gap-1">
                <label className="font-medium" htmlFor="email">
                  <Trans i18nKey={"email"} />{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  className="dark:bg-white dark:border-slate-200"
                  id="email"
                  type="email"
                  required
                  {...register("email")}
                />
              </div>

              <div className="flex flex-col items-start gap-1 relative">
                <label
                  className="font-medium flex items-center justify-between w-full"
                  htmlFor="password"
                >
                  <p>
                    {" "}
                    <Trans i18nKey={"password"} />{" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <span
                    onClick={() => {
                      navigate("/forgot-password");
                    }}
                    className="text-sm float-right cursor-pointer text-[#007AFF]"
                  >
                    <Trans i18nKey={"forgot_password"} />{" "}
                  </span>
                </label>

                <Input
                  className="dark:bg-white dark:border-slate-200"
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  required
                  {...register("password")}
                />
                {isPasswordVisible ? (
                  <Eye
                    onClick={() => togglePasswordVisibility()}
                    className="text-slate-300 absolute cursor-pointer right-3 top-9"
                  />
                ) : (
                  <EyeOff
                    onClick={() => togglePasswordVisibility()}
                    className="text-slate-300 absolute cursor-pointer right-3 top-9"
                  />
                )}
              </div>
              <p className="text-xs text-center">
                <Trans i18nKey={"agreement.prefix"} />
                <Link
                  className="text-blue-500 hover:underline"
                  to="https://intelliresponse.ai/en/terms-and-conditions"
                  target="_blank"
                >
                  <Trans i18nKey={"agreement.terms"} />
                </Link>
                ,{" "}
                <Link
                  className="text-blue-500 hover:underline"
                  to="https://intelliresponse.ai/en/privacy-policy"
                  target="_blank"
                >
                  <Trans i18nKey={"agreement.privacy"} />
                </Link>{" "}
                <br /> <Trans i18nKey={"agreement.and"} />{" "}
                <Link
                  className="text-blue-500 hover:underline"
                  to="https://intelliresponse.ai/en/end-user-license-agreement"
                  target="_blank"
                >
                  <Trans i18nKey={"agreement.eula"} />
                </Link>
              </p>
              <div>
                <Button className="w-full mt-3 bg-primary hover:bg-primary/50 dark:bg-primary dark:text-white hover:dark:bg-primary/60">
                  {isPending ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-5">
            <p className="text-slate-400 text-xs">
              <Trans i18nKey={"useGoogle"} />
            </p>
            <Button
              onClick={submitGoogleLogin}
              className="mx-auto py-6 px-10 rounded-[50px] flex items-center gap-3 dark:bg-slate-50 dark:border-slate-200 hover:dark:bg-slate-50/5 hover:dark:text-black"
              variant="outline"
            >
              <Icons.googleIcon />
              <Trans i18nKey={"signInWithGoogle"} />
            </Button>

            <p className="md:mt-3">
              <Trans i18nKey={"noAccount"} />
              <Link to="/sign-up" className="font-bold hover:underline">
                <Trans i18nKey={"signUp"} />
              </Link>
            </p>
          </CardFooter>
        </Card>

        <h1 className="text-sm absolute bottom-0 hidden md:block">
          <Trans i18nKey={"footer.copyright"} />
          <Link
            className="font-bold hover:underline"
            to="https://intelliresponse.ai/"
            target="_blank"
          >
            IntelliResponse
          </Link>{" "}
          <Trans i18nKey={"footer.allRightsReserved"} />{" "}
          <Trans i18nKey={"footer.poweredBy"} />{" "}
          <Link
            className="font-bold hover:underline"
            to="https://embrais.com/"
            target="_blank"
          >
            Embrace AI Solutions
          </Link>
          .
        </h1>
      </div>
    </div>
  );
}

export default SignIn;
