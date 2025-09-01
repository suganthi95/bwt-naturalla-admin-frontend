import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PasswordUpdated() {
    const navigate = useNavigate()
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F7F7F7] ">
      <div className="grid place-items-center  px-4">
        <div className="w-full max-w-md px-4 py-6 sm:px-6 lg:px-8 space-y-2.5 md:space-y-6 text-center">
          <div className="flex justify-center">
            <Icons.ForgotPasswordSuccess />
          </div>

          <h2 className="font-bold text-xl sm:text-4xl uppercase text-textPrimary dark:text-white">
            Password Updated!
          </h2>

          <p className="text-title dark:text/70 font-light text-sm sm:text-base">
            Your new password has been successfully reset. Click below to login
            in magically.{" "}
          </p>

          <div className=" mt-4">
         
            <Button
              type="submit"
              className="p-2 px-4 md:h-12 md:rounded-[12px] dark:text-white w-full"
              onClick={()=>navigate('/login')}
            >
             Login
            </Button>
          </div>
          {/* <p className="text-sm text-[#333333] dark:text-white/70 ">
            Didn't received the email ?{" "}
            <strong className="cursor-pointer">Click to respond</strong>
          </p> */}
        </div>
      </div>
    </section>
  );
}
