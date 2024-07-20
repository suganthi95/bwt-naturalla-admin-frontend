/* eslint-disable @typescript-eslint/no-explicit-any */

import { AuthType } from "@/types";
import { TokenResponse } from "@react-oauth/google";
import axios from "axios";

const BASE_URL = "https://rising-memory-402507.el.r.appspot.com";
const auth: AuthType = JSON.parse(localStorage.getItem("auth") as string);


export const getReviews = async (reviewId: string) => {
    return await axios({
        method: "get",
        url: `${BASE_URL}/review/getReviews/${reviewId}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth.server_token
        }
    })
}

export const getSuggestions = async (body: any) => {
    return await axios({
        method: "post",
        url: `${BASE_URL}/suggestion/getSuggestion`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth.server_token
        },
        data: body
    })
} 

export const copyToClipboard = async (data: { tone: string, id: string }) => {
    return await axios({
        method: "post",
        url: `${BASE_URL}/suggestion/copyToClipboard`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth.server_token
        },
        data: data
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

export const signInUser = async (data: any) => {
    return await axios({
        method: "post",
        url: `${BASE_URL}/user/signInUser`,
        headers: {
            Accept: 'application/json'
        },
        data
    })
}

export const getBusinessSuggestions = async (input: string) => {

    return await axios({
        method: "get",
        url: `${BASE_URL}/business/businessSuggestions?query=${input}&language=en`,
    })
}

export const getBusinessDetails = async ({ placeId, uuid }: { placeId: string, uuid: string }) => {
    return await axios({
        method: "get",
        url: `${BASE_URL}/business/placeDetails?placeId=${placeId}&sessionToken=${uuid}`,
    })
}

export const addBusiness = async (data: any) => {
    return await axios({
        method: "post",
        url: `${BASE_URL}/business/addBusiness`,
        headers: {
            Accept: 'application/json'
        },
        data
    })
}

export const getAllBusiness = async ({ email, userId }: { email: string, userId: string }) => {
    return await axios({
        method: "post",
        url: `${BASE_URL}/business/getBusiness`,
        headers: {
            Accept: 'application/json'
        },
        data: {
            email,
            userId
        }
    })
}

