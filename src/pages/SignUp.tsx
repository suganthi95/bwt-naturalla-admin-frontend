/* eslint-disable @typescript-eslint/no-explicit-any */
import { ASSETS } from "@/assets/assets";
import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthType, SignUpType } from "@/types";
import { useMutation } from "@tanstack/react-query";
import {
  signInUserByGoogle,
  signupUser,
  verifyGoogleUser,
} from "@/lib/apis";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/AuthContext";
import { AxiosError, AxiosResponse } from "axios";
import useToggle from "@/hooks/useToggle";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";
import { Trans, useTranslation } from "react-i18next";

function SignUp() {
  const location = useLocation();
  const {t} = useTranslation()
  const user = localStorage.getItem("auth");
  const parsedUser = user ? JSON.parse(user) : null;
  const Mail = parsedUser?.data?.email;
   useEffect(() => {
     initializeGA();
     trackpPageView(location.pathname,Mail);
   }, []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<SignUpType>();
  const { setAuth } = useAppContext();
  const navigate = useNavigate();
  const [isPasswordVisible, togglePasswordVisibility] = useToggle();
  const [isConfirmPasswordVisible, toggleConfirmPasswordVisibility] = useToggle();

  /***************************************** Google signup **********************************************/

  const { mutate: signInUserByGoogleMutate } = useMutation({
    mutationKey: ["signInUserByGoogle"],
    mutationFn: signInUserByGoogle,
    onSuccess: (res: AxiosResponse<AuthType>) => {

      setAuth(res?.data);

      if (res?.data?.data?.onboarded === true) {
        toast.success(t('request_success'), { description:t('signed_in_successfully') });
        navigate("/dashboard", { replace: true });
        window.location.reload();
      }

      if (res?.data?.data?.onboarded === false) {
        toast.success(t('request_success'), { description:t('signed_in_successfully') });
        navigate("/onboard", { replace: true });
        window.location.reload();
      }
    },
    onError: (error: AxiosError<any>) => toast.error(t('request_failed'), { description: error?.response?.data.message || error?.message })
  })

  const { mutate: verifyGoogleUserMutate } = useMutation({
    mutationKey: ["verifyGoogleUser"],
    mutationFn: verifyGoogleUser,
    onSuccess: (res) => {
      signInUserByGoogleMutate({
        email: res?.data?.email,
        name: `${res?.data?.given_name} ${res?.data?.family_name}`,
      });
    },
    onError: (error: AxiosError<any>) => toast.error(t('request_failed'), { description: error?.response?.data.message || error?.message })
  });

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => verifyGoogleUserMutate(res),
    onError: (error) => toast.error(t('request_failed'), { description: error.error_description }),
  });


  const submitGoogleLogin = () => googleLogin();

  /*********************************** Normal sign up *******************************************/

  const { mutate, isPending } = useMutation({
    mutationKey: ["signupUser"],
    mutationFn: signupUser,
    onSuccess: (data) => {
      setAuth(data.data);
      toast.success(t('request_success'), {
        description:t('signed_up_successfully'),
      });
      // navigate(`/welcome`, { replace: true });
      navigate(`/verify-email`, { replace: true });
    },
    onError: (error: AxiosError<any>) => {
      console.log(error);
      toast.error(t('request_failed'), {
        description: error?.response?.data?.message,
      });
    },
  });

  const submit = handleSubmit((data) => {
    mutate({
      name: data.username,
      email: data.email,
      password: data.password,
    });
  });

  useEffect(() => {
    if (
      watch("confirmPassword") !== watch("password") &&
      watch("confirmPassword") !== ""
    ) {
      setError("confirmPassword", {
        message: t('password_mismatch'),
        type: "required",
      });
    } else {
      setError("confirmPassword", { message: "", type: "required" });
    }
  }, [watch("confirmPassword")]);

  useEffect(() => {
    if (window.innerWidth <= 1024) {
      toast.success(t('use_landscape_mode'), {
        position: "top-center",
      });
    }
    
  }, []);

  return (
    <div className="p-0 lg:p-2 flex bg-sandal h-screen ">
      <div className="hidden lg:flex flex-1">
        <div className="flex items-center justify-center w-full">
          <img className="w-2/3" src={ASSETS.SIGNUP_BG_IMG} alt="bg-img" />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center rounded-xl bg-white relative h-full">
        <Link to="/" className="flex flex-row items-center gap-3 mx-auto">
          <img src={ASSETS.LOGO} alt="logo" />
          <div>
            <p className="font-bold text-xl md:text-3xl text-primary">
              Intelli<span className="text-secondary">Response</span>
            </p>
            <span className="text-slate-500 text-sm md:text-balance">
              <Trans i18nKey={'title'}/>
            </span>
          </div>
        </Link>
        <div className="py-0 px-2 md:px-20 lg:px-32">
          <h1 className="text-secondary text-lg md:text-xl font-bold text-center">
           <Trans i18nKey={'signUp'}/>
          </h1>
          <p className="text-xs text-slate-500 text-center">
           <Trans i18nKey={'createAccount'}/>
          </p>

          <form onSubmit={submit}>
            <div className="flex flex-col items-start gap-1">
              <label className="font-medium text-xs" htmlFor="username">
                <Trans i18nKey={'username'}/> <span className="text-red-500">*</span>
              </label>
              <Input
                className="dark:bg-white dark:border-slate-200 focus-"
                id="username"
                type="text"
                {...register("username", {
                  required: {
                    value: true,
                    message: t('username_required'),
                  },
                })}
                required
              />
              <p className="text-xs mt-1 font-medium text-red-500">
                {errors?.username?.message}
              </p>
            </div>

            <div className="flex flex-col items-start gap-1">
              <label className="font-medium text-xs" htmlFor="email">
                 <Trans i18nKey={'email'}/>  <span className="text-red-500">*</span>
              </label>
              <Input
                className="dark:bg-white dark:border-slate-200  safari"
                id="email"
                type="email"
                {...register("email", {
                  required: {
                    value: true,
                    message: t('email_required'),
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "email format is not valid",
                  },
                })}
                required
              />
              <p className="text-xs mt-1 font-medium text-red-500">
                {errors?.email?.message}
              </p>
            </div>

            <div className="flex flex-col items-start gap-1 relative">
              <label className="font-medium text-xs" htmlFor="password">
                 <Trans i18nKey={'password'}/>  <span className="text-red-500">*</span>
              </label>
              <Input
                className="dark:bg-white dark:border-slate-200 focus:bg-none"
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                {...register("password", {
                  required: {
                    value: true,
                    message: t('password_required'),
                  },
                  minLength: {
                    value: 6,
                    message: t('password_min_length'),
                  },
                })}
                required
              />
              {isPasswordVisible ? (
                <Eye
                  onClick={() => togglePasswordVisibility()}
                  className="text-slate-300 absolute cursor-pointer right-3 top-7"
                />
              ) : (
                <EyeOff
                  onClick={() => togglePasswordVisibility()}
                  className="text-slate-300 absolute cursor-pointer right-3 top-7"
                />
              )}
              <p className="text-xs mt-1 font-medium text-red-500">
                {errors?.password?.message}
              </p>
            </div>

            <div className="flex flex-col items-start gap-1 relative">
              <label className="font-medium text-xs" htmlFor="email">
                <Trans i18nKey={'confirmPassword'}/> <span className="text-red-500">*</span>
              </label>
              <Input
                className="dark:bg-white dark:border-slate-200 focus:bg-none"
                id="confirmPassword"
                type={isConfirmPasswordVisible ? "text" : "password"}
                {...register("confirmPassword", {
                  validate: (value) => {
                    if (!value) {
                      return   t('confirm_password_required');
                    } else if (watch("password") !== value) {
                      return   t('passwords_do_not_match');
                    }
                  },
                })}
                required
              />
              {isConfirmPasswordVisible ? (
                <Eye
                  onClick={() => toggleConfirmPasswordVisibility()}
                  className="text-slate-300 absolute cursor-pointer right-3 top-7"
                />
              ) : (
                <EyeOff
                  onClick={() => toggleConfirmPasswordVisibility()}
                  className="text-slate-300 absolute cursor-pointer right-3 top-7"
                />
              )}
              <p className="text-xs mt-1 font-medium text-red-500">
                {errors?.confirmPassword?.message}
              </p>
            </div>

            <p className="text-xs text-center">
              <Trans i18nKey={'agreement.prefix'}/>
              <Link
                className="text-blue-500 hover:underline"
                to="https://intelliresponse.ai/en/terms-and-conditions"
                target="_blank"
              >
                <Trans i18nKey={'agreement.terms'}/>
              </Link>
              ,{" "}
              <Link
                className="text-blue-500 hover:underline"
                to="https://intelliresponse.ai/en/privacy-policy"
                target="_blank"
              >
                <Trans i18nKey={'agreement.privacy'}/>
              </Link>{" "}
              <br /> <Trans i18nKey={'agreement.and'}/>
              <Link
                className="text-blue-500 hover:underline"
                to="https://intelliresponse.ai/en/end-user-license-agreement"
                target="_blank"
              >
                <Trans i18nKey={'agreement.eula'}/>
              </Link>
            </p>

            <div>
              <Button className="w-full mt-3 bg-primary hover:bg-primary/50 dark:bg-primary dark:text-white hover:dark:bg-primary/60">
                {isPending ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                 <Trans i18nKey={'signUp'}/>
                )}
              </Button>
            </div>
          </form>

          <p className="text-slate-400 text-center"><Trans i18nKey={'or'}/></p>
          <Button
            onClick={submitGoogleLogin}
            className="w-full flex flex-row items-center gap-2 dark:bg-slate-50 dark:border-slate-200 hover:dark:bg-slate-50/5 hover:dark:text-black"
            variant="outline"
          >
            <Icons.googleIcon />
            <Trans i18nKey={'continueWithGoogle'}/>
          </Button>

          <p className="mt-3 text-center text-xs">
           <Trans i18nKey={'alreadyHaveAccount'}/>
            <Link to="/sign-in" className="font-bold hover:underline">
              <Trans i18nKey={'signIn'}/>
            </Link>
          </p>

          <p className="text-xs md:text-sm text-center w-full mx-auto mt-3 md:mt-10">
                          <Trans i18nKey={'footer.copyright'}/>
                 <Link className="font-bold hover:underline" to="https://intelliresponse.ai/" target="_blank">IntelliResponse</Link>           <Trans i18nKey={'footer.allRightsReserved'}/>
. <Trans i18nKey={'footer.poweredBy'}/> <Link className="font-bold hover:underline" to="https://embrais.com/" target="_blank">Embrace AI Solutions</Link>.
            </p>
        </div>
      </div>

      {/* <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Contact Us</AlertDialogTitle>
                <AlertDialogDescription>
                    Please contact IntelliResponse team.
                </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog> */}
    </div>
  );
}

export default SignUp;
