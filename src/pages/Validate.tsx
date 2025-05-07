import { ASSETS } from "@/assets/assets"
import Loader from "@/components/ui/Loader"
import { useAppContext } from "@/contexts/AuthContext";
import { validateUser } from "@/lib/apis";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";
import { ValidateUserType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

function Validate() {
  const location = useLocation();
  const user = localStorage.getItem("auth");
  const parsedUser = user ? JSON.parse(user) : null;
  const Mail = parsedUser?.data?.email;
   useEffect(() => {
     initializeGA();
     trackpPageView(location.pathname,Mail);
   }, []);
  const { auth } = useAppContext();
  const { isLoading, isSuccess, data } = useQuery({
      queryKey: [ "validateUser" ],
      queryFn: () => validateUser(auth?.token as string),
      retry: 0,
      select: (data): ValidateUserType => data?.data?.data,
      refetchOnWindowFocus: false,
      enabled: Boolean(auth?.token)
  });

  if(isLoading){
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

  if(isSuccess && data?.onboarded){
    return <Navigate to="/dashboard"/>
  }

  if(isSuccess && !data?.onboarded){
    return <Navigate to="/onboard"/>
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