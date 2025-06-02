/* eslint-disable @typescript-eslint/no-explicit-any */
import { ASSETS } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Check, LoaderCircle } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trans, useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordEmailRequest } from "@/lib/apis";
import { toast } from "sonner";

function ForgotPassword() {
  const { t } = useTranslation();
  const inputSchema = z.object({
    email: z
      .string()
      .email(t("invalid_email_format"))
      .nonempty(t("email_required")),
  });

  type ForgotProps = z.infer<typeof inputSchema>;
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["forgotpassword"],
    mutationFn:  forgotPasswordEmailRequest,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotProps>({
    resolver: zodResolver(inputSchema),
    mode: "onChange",
  });

  const handleSendMail = (formData: ForgotProps) => {
    console.log("Reset email to:", formData.email);
    mutate(formData?.email,{
      onSuccess(data) {
         toast.success(data?.data?.message)
         navigate('/reset-password/email-sent',{state:{email:data?.data?.email}})
      },
    })
  };

  return (
    <div className="min-h-screen w-full bg-sandal flex flex-col lg:flex-row">
      <div className="flex flex-col flex-1 bg-white justify-center px-4 md:px-10 py-8">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <img src={ASSETS.LOGO} alt="logo" className="h-10 md:h-12" />
          <div>
            <p className="font-bold text-xl md:text-3xl text-primary">
              Intelli<span className="text-secondary">Response</span>
            </p>
            <span className="text-slate-500 text-sm md:text-[15px]">
              <Trans i18nKey={"title"} />
            </span>
          </div>
        </Link>

        <div className="w-full max-w-md mx-auto space-y-6 text-center">
          <h2 className="font-bold text-xl md:text-4xl uppercase text-title dark:text-white">
            <Trans i18nKey={"forgot_password"} />
          </h2>
          <p className="text-lead text-xs md:text-base font-light">
            <Trans i18nKey={"enter_email_info"} />
          </p>

          <form
            onSubmit={handleSubmit(handleSendMail)}
            className="space-y-6 text-left"
          >
            <div>
              <label
                htmlFor="email"
                className="block font-medium text-sm mb-1 text-[#292D34]"
              >
                <Trans i18nKey={"email_address"} />
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder={t('email')}
                  {...register("email")}
                  className={`w-full h-11 focus-within:border-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {isValid && !errors.email && (
                  <Check
                    className="absolute right-3 top-3 text-green-500"
                    size={20}
                  />
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <Button
                type="button"
                variant="outline"
                className="text-sm md:text-base h-11 md:h-12 rounded-md"
                onClick={() => navigate("/login")}
              >
                <ArrowLeft className="mr-2" size={18} /> Back to Login
              </Button>
              <Button
                type="submit"
                className="bg-[#FF840F] hover:bg-primary text-white text-sm md:text-base h-11 md:h-12 rounded-md"
              >
                {isPending ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <Trans i18nKey={"reset_password"} />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[#FFEEE1]">
        <img
          src={ASSETS.FORGOT_EMAIL}
          alt="forgot password illustration"
          className="w-2/3 max-w-[400px]"
        />
      </div>
    </div>
  );
}

export default ForgotPassword;
