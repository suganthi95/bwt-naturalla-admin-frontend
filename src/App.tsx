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

function App() {

  const { auth } = useAppContext();

  const { isLoading, isError, isSuccess, data } = useQuery({
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

  if(isError){
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in"/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/onboard" element={<OnBoard/>}/>
      </Routes>
    )
  }

  const PrivateRoute = () => isSuccess && data?.onboarded ? <Layout/> : isSuccess && data?.onboarded === false ? <Navigate to="/onboard"/> : <Navigate to="/sign-in"/>

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute/>}>
        <Route index element={<Home/>}/>
        <Route path="/dashboard" element={<Home/>}/>
        <Route path="/reviews" element={<Reviews/>}/>
        <Route path="/reviews/generate-response" element={<ReplyReview/>}/>
        <Route path="/business" element={<Business/>}/>
        <Route path="/bookmark" element={<ReviewBookmarks/>}/>
        <Route path="/billing" element={<Home/>}/>
        <Route path="/feedback" element={<Feedback/>}/>
        <Route path="/terms-and-conditions" element={<Home/>}/>
        <Route path="/settings" element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/logout" element={<Home/>}/>
        <Route path="/google-review" element={<Home/>}/>
      </Route>
      <Route path="/sign-in" element={<SignIn/>}/>
      <Route path="/sign-up" element={<SignUp/>}/>
      <Route path="/onboard" element={<OnBoard/>}/>
    </Routes>
  )

  
}

export default App
