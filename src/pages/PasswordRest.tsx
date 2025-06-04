import { ASSETS } from "@/assets/assets";
import InitialLoader from "@/common/InitialLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword, verifyForgotPasswordAction } from "@/lib/apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EyeOff, Eye, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

export default function PasswordRest() {
  const { t } = useTranslation();
  const naviate = useNavigate();
  const params = useParams();
  const { token } = params || {};
  const { data ,isError,isLoading,isFetching,isSuccess} = useQuery({
    queryKey: ["emailverification"],
    queryFn: () => verifyForgotPasswordAction(token ?? ""),
    select: (data) => data?.data,
  });
  if (data?.status === false || isError) {
    toast.warning(data?.message);
      naviate("/login");
   
  }

  const { mutate, isPending } = useMutation({
    mutationKey: ["resetpassword"],
    mutationFn: (args: { token: string; password: string }) =>
      resetPassword(args.token, args.password),
  });
  const inputSchema = z
    .object({
      password: z
        .string()
        .nonempty(t("password_required"))
        .regex(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
          "Password must be at least 6 characters and include uppercase, lowercase, number, and special character."
        )
        .min(6, t("password_min_length")),

      confirmPassword: z.string().nonempty(t("confirm_password")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("passwords_do_not_match"),
    });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  type PasswordResetProps = z.infer<typeof inputSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetProps>({
    resolver: zodResolver(inputSchema),
    mode: "onChange",
  });
  const submitPassword: SubmitHandler<PasswordResetProps> = (data) => {
    mutate(
      {
        token: token ?? "",
        password: data?.password,
      },
      {
        onSuccess(data) {
          toast.success(data?.data?.message);
           naviate('/reset-password-success')
        },
      }
    );
  };
  if(isLoading || isFetching){
    return <InitialLoader/>
  }
if(isSuccess){
    return (
    <div className="min-h-screen w-full bg-sandal flex flex-col lg:flex-row">
      <div className="flex flex-col flex-1 bg-white justify-center px-4 md:px-10 py-8">
        <div className="space-y-6 w-full max-w-md mx-auto text-center">
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <img src={ASSETS.LOGO} alt="logo" className="h-10 md:h-12" />
            <div>
              <p className="font-bold text-xl md:text-3xl text-primary">
                Intelli<span className="text-secondary">Response</span>
              </p>
              <span className="text-slate-500 text-sm md:text-base">
                <Trans i18nKey={"title"} />
              </span>
            </div>
          </Link>

          <h2 className="font-bold text-xl md:text-4xl uppercase text-[#262222] dark:text-white">
            <Trans i18nKey={"reset_password"} />
          </h2>
          <p className="text-[#4B515C] text-xs md:text-base font-light">
            <Trans i18nKey={"enter_email_info"} />
          </p>

          <form
            className="space-y-6 text-left"
            onSubmit={handleSubmit(submitPassword)}
          >
            <div className="w-full">
              <label
                htmlFor="psw"
                className="block font-medium text-sm text-secondary dark:text-darkGray mb-1"
              >
                <Trans i18nKey={"password"} />
              </label>
              <div className="relative">
                <Input
                  id="psw"
                  {...register("password", {
                    required: t("password_required"),
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  className={`w-full h-12  focus-within:border-none  ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="cfpsw"
                className="block font-medium text-sm text-secondary dark:text-darkGray mb-1"
              >
                <Trans i18nKey={"confirm_password"} />
              </label>
              <div className="relative">
                <Input
                  id="cfpsw"
                  {...register("confirmPassword", {
                    required: t("confirm_password"),
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder=""
                  className={`w-full focus-within:border-none h-12 pr-10 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full md:h-10 bg-primary hover:bg-primary md:rounded-lg text-sm md:text-base dark:text-white"
            >
              {isPending ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                <Trans i18nKey={"reset_password"} />
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[#FFEEE1]">
        <img
          src={ASSETS.FORGOT_EMAIL}
          alt="Password reset illustration"
          className="w-2/3 max-w-[400px]"
        />
      </div>
    </div>
  );
}
}
