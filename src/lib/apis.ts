/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
  

//staging
const BASE_URL = "https://naturalla-admin-backend.onrender.com/api";


export const forgotPasswordEmailRequest = async(email:string)=>{
 return await axios({
    method:'post',
    url:`${BASE_URL}/auth/forgot/password`,
    data:{
        email
    }
 })
}

export const getAllProducts = async()=>{
    return await axios({
        method:'get',
        url:`${BASE_URL}/products/products`,
    })
}

export const getAllOrders =async()=>{
    return await axios({
        method:'get',
        url:`${BASE_URL}/order`
    })
}