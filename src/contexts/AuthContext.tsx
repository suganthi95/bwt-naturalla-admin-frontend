// import { AuthType } from "@/types";
// import { ReactNode, createContext, useContext, useEffect, useState } from "react"


// type AppContextType = {
//     auth: AuthType | null,
//     setAuth: React.Dispatch<React.SetStateAction<AuthType | null>>,
//     placeId: string,
//     setPlaceId: React.Dispatch<React.SetStateAction<string>>,
// }

// const AppContext = createContext<AppContextType | null>(null);

// export const AppContextProvider = ({ children }: { children: ReactNode }) => {

//     const [ auth, setAuth ] = useState<AuthType | null>(() => {
//         const user = localStorage.getItem("auth");
//         if(user === null) return null;
//         return JSON.parse(user)
//     });

//     const [ placeId, setPlaceId ] = useState("");

//     useEffect(() => {
//         if(auth){
//             localStorage.setItem("auth", JSON.stringify(auth));
//         }
//     }, [auth]);

//     return(
//         <AppContext.Provider 
//             value={{
//                 auth,
//                 setAuth,
//                 placeId,
//                 setPlaceId
//             }}
//         >
//             {children}
//         </AppContext.Provider>
//     )
// }

// // eslint-disable-next-line react-refresh/only-export-components
// export const useAppContext = () => {
//     return useContext(AppContext) as AppContextType;
// }