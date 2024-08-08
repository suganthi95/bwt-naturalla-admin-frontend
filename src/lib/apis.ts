/* eslint-disable @typescript-eslint/no-explicit-any */
import { TokenResponse } from "@react-oauth/google";
import axios from "axios";

const BASE_URL_V2 = "https://backend-auth-c62gk7tmha-el.a.run.app/api/v1";
const BUSINESS_BASE_URL = "https://backend-reviews-c62gk7tmha-el.a.run.app/api/v1";
const PAYMENT_BASE_URL = "https://backend-payment-c62gk7tmha-el.a.run.app/api/v1"


export const getReviews = async ({ placeId, sort, token }: { placeId: string, sort: string, token: string }) => {

    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/workspace/google?placeId=${placeId}&sort=${sort}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        }
    })
}

export const getSuggestions = async (body: any) => {

    const { token, ...data } = body;

    return await axios({
        method: "post",
        url: `${BUSINESS_BASE_URL}/workspace/suggestions/generate`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        data
    })
} 


export const verifyGoogleUser = async (user: Omit<TokenResponse, "error" | "error_description" | "error_uri"> | undefined) => {

    return await axios({
        method: "get",
        url: `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user?.access_token}`,
        headers: {
            Authorization: `Bearer ${user?.access_token}`,
            Accept: 'application/json'
        }
    })
}

export const signupUser = async (data: { name: string, email: string, password: string }) => {
    return await axios({
        method: "post",
        url: `${BASE_URL_V2}/auth/register`,
        headers: {
            Accept: 'application/json'
        },
        data
    })
}

export const onBoardUser = async (data: { role: string, industry: string, business_type: string, heard_through: string, workspace_name: string, token: string }) => {

    const { token, ...body } = data;
    
    return await axios({
        method: "post",
        url: `${BASE_URL_V2}/auth/onboarding`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: body
    })
}

export const signinUser = async (data: { email: string, password: string }) => {
    return await axios({
        method: "post",
        url: `${BASE_URL_V2}/auth/login`,
        headers: {
            Accept: 'application/json'
        },
        data
    })
}

export const signInUserByGoogle = async (data: { email: string, name: string }) => {
    return await axios({
        method: "post",
        url: `${BASE_URL_V2}/auth/google-signin`,
        headers: {
            Accept: 'application/json'
        },
        data
    })
}

export const validateUser = async (token: string) => {
    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/workspace/validate-user`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const getBusinessSuggestions = async ({ input, uuid, token }: { input: string, uuid: string, token: string }) => {


    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/workspace/business/google/suggestions?query=${input}&session_token=${uuid}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
    })
}

export const getBusinessDetails = async ({ placeId, uuid, token }: { placeId: string, uuid: string, token: string }) => {

    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/workspace/business/google/place-details?place_id=${placeId}&session_token=${uuid}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
    })
}

export const addBusiness = async (data: any) => {

    return await axios({
        method: "post",
        url: `${BUSINESS_BASE_URL}/workspace/business`,
        headers: {
            Accept: 'application/json',
            "Authorization": data.token
        },
        data: {
            place_id: data.placeId,
            business_name: data.businessName,
            street_number: data.streetNumber,
            street: data.street,
            city: data.city,
            email: data.email,
            zip_code: data.zipCode
        }
    })
}

export const removeBusiness = async (data: { place_id: string, email: string, token: string }) => {

    const { token, ...body } = data;

    return await axios({
        method: "delete",
        url: `${BUSINESS_BASE_URL}/workspace/business`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: body
    })
}

export const getAllBusiness = async (token: string) => {
    
    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/workspace/business`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
    })
}

export const setActiveBusiness = async ({ place_id, token }: { place_id: string, token: string }) => {
    
    return await axios({
        method: "post",
        url: `${BUSINESS_BASE_URL}/workspace/business/set-active`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: {
            place_id
        }
    })
}

export const createSubscription = async ({ email, workspace_id, token }: { email: string, workspace_id: string, token: string }) => {
    
    return await axios({
        method: "post",
        url: `${PAYMENT_BASE_URL}/workspace/business/set-active`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: {
            email,
            workspace_id
        }
    })
}


