import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/assets/assets";
import { Trans } from "react-i18next";
import { Icons } from "@/assets/icons";

export default function PasswordResetSuccess() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <section className="container mx-auto">
      <div className="grid place-items-center min-h-screen px-4">
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8 space-y-4 md:space-y-6 text-center">
          
          {/* Logo and title */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <img src={ASSETS.LOGO} alt="logo" className="h-10 md:h-12" />
            <div>
              <p className="font-bold text-xl md:text-3xl text-primary">
                Intelli<span className="text-secondary">Response</span>
              </p>
              <span className="text-slate-500 text-sm md:text-[15px]">
                <Trans i18nKey="title" />
              </span>
            </div>
          </Link>

          {/* Success icon */}
          <div className="flex justify-center" aria-label="Password reset success">
            <Icons.ForgotPasswordSuccess />
          </div>

          {/* Title and message */}
          <h2 className="font-bold text-xl sm:text-4xl uppercase text-[#262222] dark:text-white">
            <Trans i18nKey="password_updated" />
          </h2>
          <p className="text-[#4B515C] font-light text-sm sm:text-base">
            <Trans i18nKey="password_reset_success" />
          </p>

          {/* Sign In Button */}
          <div className="grid place-items-center">
            <Button
              type="button"
              className="p-2 px-4  w-fit md:h-12 md:rounded-[12px] dark:text-white"
              onClick={handleLoginRedirect}
            >
              <Trans i18nKey="back_to_login" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
