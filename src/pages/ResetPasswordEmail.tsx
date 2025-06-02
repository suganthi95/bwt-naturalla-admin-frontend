import { ASSETS } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Trans } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ResetPasswordEmail() {
  const { state } = useLocation();

  const navigate = useNavigate();
  const { email } = state || {};

  const handleOpenEmail = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);
    if (isMobile) {
      window.location.href = `mailto:${email}`;
    } else {
      window.open(`https://mail.google.com/mail/u/0/#inbox`, `_blank`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-sandal flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="flex flex-col flex-1 bg-white justify-center px-4 md:px-10 py-8">
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <img src={ASSETS.LOGO} alt="logo" className="h-10 md:h-12" />
            <div>
              <p className="font-bold text-xl md:text-3xl text-primary">
                Intelli<span className="text-secondary">Response</span>
              </p>
              <span className="text-slate-500 text-sm md:text-[15px]">
                <Trans i18nKey={'title'}/>
              </span>
            </div>
          </Link>
          <h2 className="font-bold text-2xl sm:text-4xl uppercase text-secondary dark:text-white">
            <Trans i18nKey={'check_email'}/>
          </h2>

          <p className="text-[#4B515C] font-light text-sm sm:text-base">
            <Trans i18nKey={'sent_reset_link_to'}/> <strong>{email}</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="border border-[#262222]/30 text-[#262222] dark:text-white md:h-12 md:rounded-lg"
              onClick={() =>navigate('/login')}
            >
              <ArrowLeft className="mr-2" /> <Trans i18nKey={'back_to_login'}/>
            </Button>
            <Button
              type="button"
              className="bg-primary text-white hover:bg-primary md:h-12 md:rounded-lg"
              onClick={handleOpenEmail}
            >
             <Trans i18nKey={'open_email'}/>
            </Button>
          </div>

          <p className="text-sm text-[#262222] dark:text-white">
           <Trans i18nKey={'didnt_receive_email'}/>
            <span
              onClick={() => navigate("/sign-in")}
              className="cursor-pointer font-bold underline  hover:text-primary"
            >
           <Trans i18nKey={'click_to_resend'}/>
            </span>
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
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
