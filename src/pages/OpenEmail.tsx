import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
export default function OpenEmail() {
  const { state } = useLocation();
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
    <section className="min-h-screen flex items-center justify-center bg-[#F7F7F7] ">
      <div className="grid place-items-center px-4 shadow-2xl bg-white rounded-xl">
        <div className="w-full max-w-lg px-4 py-6 sm:px-6 lg:px-8 space-y-2.5 md:space-y-6 text-center">
          <div className="flex justify-center">
            <Icons.ForgotEmail />
          </div>

          <h2 className="font-bold text-xl sm:text-4xl uppercase text-textPrimary dark:text-white">
            Check your email
          </h2>

          <p className="text-[#4B515C] dark:text-white/70 font-light text-sm sm:text-base">
            We sent a password reset link to <strong>{email}</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Button
              type="button"
              variant={'outline'}
              className="p-2 px-4 border border-[#333333]/30 dark:bg-transparent dark:border-gray-800 bg-primary/8 text-[#333333] md:h-12 md:rounded-[12px] dark:text-white w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2" /> Back to Login
            </Button>
            <Button
              type="submit"
              className="p-2 px-4 md:h-12 md:rounded-[12px] dark:text-white w-full"
              onClick={handleOpenEmail}
            >
              Open Email
            </Button>
          </div>
          <p className="text-sm dark:text-white/70  text-[#333333] ">
            Didn't received the email ?{" "}
            <strong className="cursor-pointer">Click to respond</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
