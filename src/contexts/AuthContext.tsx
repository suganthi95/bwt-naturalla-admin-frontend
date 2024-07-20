import { AuthType } from "@/types";
import { ReactNode, createContext, useContext, useEffect, useState } from "react"


type AppContextType = {
    auth: AuthType | null,
    setAuth: React.Dispatch<React.SetStateAction<AuthType | null>>,
    activeBusiness: { businessName: string, placeId: string } | null,
    setActiveBusiness: React.Dispatch<React.SetStateAction<{ businessName: string, placeId: string } | null>>
}

const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {

    const [ auth, setAuth ] = useState<AuthType | null>(() => {
        const user = localStorage.getItem("auth");
        if(user === null) return null;
        return JSON.parse(user)
    });

    const [ activeBusiness, setActiveBusiness ] = useState<{ businessName: string, placeId: string } | null>(() => {
        const activeBusiness = localStorage.getItem("activeBusiness");
        if(activeBusiness === null) return null;
        return JSON.parse(activeBusiness)
    })

    useEffect(() => {
        if(auth){
            localStorage.setItem("auth", JSON.stringify(auth));
        }

        if(activeBusiness){
            localStorage.setItem("activeBusiness", JSON.stringify(activeBusiness));
        }
    }, [auth, activeBusiness]);

    return(
        <AppContext.Provider 
            value={{
                auth,
                setAuth,
                activeBusiness,
                setActiveBusiness
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    return useContext(AppContext) as AppContextType;
}