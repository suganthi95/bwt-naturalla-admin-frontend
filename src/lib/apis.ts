/* eslint-disable @typescript-eslint/no-explicit-any */

import { AuthType } from "@/types";
import { TokenResponse } from "@react-oauth/google";
import axios from "axios";

const BASE_URL_V2 = "https://backend-auth-c62gk7tmha-el.a.run.app/api/v1";
const BUSINESS_BASE_URL = "https://backend-reviews-c62gk7tmha-el.a.run.app/api/v1";
const auth: AuthType = JSON.parse(localStorage.getItem("auth") as string);



export const getReviews = async ({ placeId, uuid }: { placeId: string, uuid: string }) => {
    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/reviews/business/google/place-details?place_id=${placeId}&session_token=${uuid}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth.token
        }
    })
}

export const getSuggestions = async (body: any) => {
    return await axios({
        method: "post",
        url: `${BASE_URL_V2}/suggestion/getSuggestion`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth.token
        },
        data: body
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

export const getBusinessSuggestions = async ({ input, uuid }: { input: string, uuid: string }) => {
    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/reviews/business/google/suggestions?query=${input}&session_token=${uuid}`,
        headers: {
            Accept: 'application/json',
            "Authorization": auth.token
        },
    })
}

export const getBusinessDetails = async ({ placeId, uuid }: { placeId: string, uuid: string }) => {
    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/reviews/business/google/place-details?place_id=${placeId}&session_token=${uuid}`,
        headers: {
            Accept: 'application/json',
            "Authorization": auth.token
        },
    })
}

export const addBusiness = async (data: any) => {
    return await axios({
        method: "post",
        url: `${BUSINESS_BASE_URL}/reviews/business`,
        headers: {
            Accept: 'application/json',
            "Authorization": auth.token
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

export const removeBusiness = async (data: { place_id: string, email: string }) => {
    return await axios({
        method: "delete",
        url: `${BUSINESS_BASE_URL}/reviews/business`,
        headers: {
            Accept: 'application/json',
            "Authorization": auth.token
        },
        data
    })
}

export const getAllBusiness = async () => {
    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/reviews/business`,
        headers: {
            Accept: 'application/json',
            "Authorization": auth.token
        },
    })
}

