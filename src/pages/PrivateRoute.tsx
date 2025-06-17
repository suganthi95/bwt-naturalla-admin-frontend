import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/contexts/AuthContext"
import { Navigate } from "react-router-dom";

function PrivateRoute() {

    const { auth } = useAppContext();

    if(auth?.token && auth.role === "admin"){
        return <Layout/>
    }

    return <Navigate to="/sign-in"/>
}

export default PrivateRoute