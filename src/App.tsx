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

function App() {

  const { auth } = useAppContext();

  // protected route
  const PrivateRoute = () => auth?.message === "Success" && auth?.data?.onboarded ? <Layout/> : auth?.message === "Success" && auth?.data?.onboarded === false ? <Navigate to="/onboard"/> : <Navigate to="/sign-in"/>

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute/>}>
        <Route index element={<Home/>}/>
        <Route path="/dashboard" element={<Home/>}/>
        <Route path="/reviews" element={<Reviews/>}/>
        <Route path="/reviews/generate-response" element={<ReplyReview/>}/>
        <Route path="/business" element={<Business/>}/>
        <Route path="/bookmark" element={<Home/>}/>
        <Route path="/billing" element={<Home/>}/>
        <Route path="/feedback" element={<Home/>}/>
        <Route path="/terms-and-conditions" element={<Home/>}/>
        <Route path="/settings" element={<Home/>}/>
        <Route path="/profile" element={<Home/>}/>
        <Route path="/logout" element={<Home/>}/>
      </Route>
      <Route path="sign-in" element={<SignIn/>}/>
      <Route path="sign-up" element={<SignUp/>}/>
      <Route path="/onboard" element={<OnBoard/>}/>
    </Routes>
  )
}

export default App
