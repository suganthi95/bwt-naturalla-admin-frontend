import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Layout from "./components/layout/Layout"
import Reviews from "./pages/Reviews"
import ReplyReview from "./pages/ReplyReview"
import SignIn from "./pages/SignIn"
import { useAppContext } from "./contexts/AuthContext"
import Business from "./pages/Business"
import SignUp from "./pages/SignUp"
import OnBoard from "./pages/OnBoard"
import ReviewBookmarks from "./pages/ReviewBookmarks"
import Profile from "./pages/Profile"
import Feedback from "./pages/Feedback"
import { validateUser } from "./lib/apis"
import { useQuery } from "@tanstack/react-query"
import { ValidateUserType } from "./types"
import { ASSETS } from "./assets/assets"
import Loader from "./components/ui/Loader"
import Welcome from "./pages/Welcome"
import Validate from "./pages/Validate"
import Settings from "./pages/Settings"
import { useEffect } from "react"
import useMode from "./hooks/useMode"
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Billing from "./pages/Billing"
import PaymentSuccess from "./pages/PaymentSuccess"
import PaymentFailure from "./pages/PaymentFailure"
import VerifyOTP from "./pages/VerifyOTP"
import axios from "axios"


dayjs.extend(utc);
dayjs.extend(timezone);

function App() {

  const { auth } = useAppContext();
  const [ mode ] = useMode();

  // darkmode

  useEffect(() => {
    
    if(mode === "dark"){
      document.documentElement.classList.toggle('dark', true);
    }else{
      document.documentElement.classList.toggle('dark', false);
    }
  }, [ mode ]);

  // get location

  useEffect(() => {

    const location = localStorage.getItem("loc");

    if(!location){
      (async () => {
        try{
  
          const response = await axios.get("http://ip-api.com/json");
  
          if((response).status === 200){
            localStorage.setItem("loc", response.data.country)
          }
  
        }catch(error){
          console.log("error fetching location: ", error);
        }
      })()
    }
  }, []);

  const { isLoading, isSuccess, data, isError } = useQuery({
      queryKey: [ "validateUser" ],
      queryFn: () => validateUser(auth?.token as string),
      retry: 0,
      select: (data): ValidateUserType => data?.data?.data,
  });


  if(isLoading){
      return <div className="h-screen flex items-center justify-center flex-col gap-3">
          <div className="hidden lg:flex flex-row items-center gap-1">
              <img className="h-8 w-8" src={ASSETS.LOGO} alt="logo" />
              <p className="font-bold text-3xl text-primary">Intelli<span className="text-secondary">Response</span></p>
          </div>
          <div>
              <Loader/>
          </div>
      </div>
  }

  let privateRoute;

  if(isError){
    privateRoute = <Navigate to="/sign-in"/>
  }

  if(isSuccess && data?.onboarded){
    privateRoute = <Layout/>
  }

  if(isSuccess && data?.onboarded === false){
    privateRoute = <Navigate to="/validate"/>
  }

  return (
    <Routes>
      <Route path="/" element={privateRoute}>
        <Route index element={<Home/>}/>
        <Route path="/dashboard" element={<Home/>}/>
        <Route path="/reviews" element={<Reviews/>}/>
        <Route path="/reviews/generate-response" element={<ReplyReview/>}/>
        <Route path="/business" element={<Business/>}/>
        <Route path="/bookmark" element={<ReviewBookmarks/>}/>
        {[ "pro-plan", "standard plan" ].includes(data?.plan_name as string) && <Route path="/billing" element={<Billing/>}/>}
        <Route path="/feedback" element={<Feedback/>}/>
        <Route path="/terms-and-conditions" element={<Home/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/logout" element={<Home/>}/>
        <Route path="/google-review" element={<Home/>}/>
      </Route>
      <Route path="/sign-in" element={<SignIn/>}/>
      <Route path="/sign-up" element={<SignUp/>}/>
      <Route path="/verify-email" element={<VerifyOTP/>}/>
      <Route path="/onboard" element={<OnBoard/>}/>
      <Route path="/welcome" element={<Welcome/>}/>
      <Route path="/validate" element={<Validate/>}/>
      <Route path="/payment-success" element={<PaymentSuccess/>}/>
      <Route path="/payment-failure" element={<PaymentFailure/>}/>
      <Route path="*" element={<SignIn/>}/>
    </Routes>
  )

  
}

export default App
