import { forgotPassword, verifyForgorPasswordToken, resetPassword } from "@/lib/apis"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useForgotPassword = ()=>{
    return useMutation({
        mutationKey:['forgotPassword'],
        mutationFn:(email:string)=>forgotPassword(email)
    })
}
export const useVerifyForgotPasswordToken = (token:string)=>{
    return useQuery({
        queryKey:['forgotPasswordTokenVerify',token],
        queryFn:()=>verifyForgorPasswordToken(token),
        enabled:!!token,
        retry:1
    })
}
export const useResetPassword = ()=>{
    return useMutation({
        mutationKey:['resetPassword'],
        mutationFn:(args:{password:string,token:string})=>resetPassword(args.password,args.token)
    })
}