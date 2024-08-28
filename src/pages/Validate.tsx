import { ASSETS } from "@/assets/assets"
import Loader from "@/components/ui/Loader"
import { useAppContext } from "@/contexts/AuthContext";
import { validateUser } from "@/lib/apis";
import { ValidateUserType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

function Validate() {

  const { auth } = useAppContext();
  const { isSuccess, data } = useQuery({
      queryKey: [ "validateUser" ],
      queryFn: () => validateUser(auth?.token as string),
      retry: 0,
      select: (data): ValidateUserType => data?.data?.data,
      refetchOnWindowFocus: false,
      enabled: Boolean(auth?.token)
  });

  if(isSuccess && data?.onboarded){
    return <Navigate to="/dashboard"/>
  }

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-3">
        <div className="hidden lg:flex flex-row items-center gap-1">
            <img className="h-8 w-8" src={ASSETS.LOGO} alt="logo" />
            <p className="font-bold text-3xl text-primary">Intelli<span className="text-secondary">Response</span></p>
        </div>
        <div>
          <Loader/>
        </div>
    </div>
  )
}

export default Validate