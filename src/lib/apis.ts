/* eslint-disable @typescript-eslint/no-explicit-any */
import { TokenResponse } from "@react-oauth/google";
import axios, { GenericAbortSignal } from "axios";

const BASE_URL_V2 = "https://backend-auth-c62gk7tmha-el.a.run.app/api/v1";
const BUSINESS_BASE_URL = "https://backend-reviews-c62gk7tmha-el.a.run.app/api/v1";
// const PAYMENT_BASE_URL = "https://backend-payment-c62gk7tmha-el.a.run.app/api/v1"


export const getReviews = async ({ placeId, page, sort, token, signal }: { placeId: string, page: number, sort: string, token: string, signal: GenericAbortSignal }) => {

    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/workspace/google?placeId=${placeId}&page=${page}&sort=${sort}`,
        // url: `${BUSINESS_BASE_URL}/workspace/google?placeId=${placeId}&sort=${sort}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        signal: signal
    })
}

export const getReviewById = async ({ token, placeId, reviewId }: { token: string, placeId: string, reviewId: string }) => {

    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/workspace/review-by-id?place_id=${placeId}&review_id=${reviewId}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
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

export const onBoardUser = async (data: { role: string, industry: string[], business_type: string, heard_through: string, workspace_name: string, token: string }) => {

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

export const getBusinessSuggestions = async ({ input, latitude, longitude, token }: { input: string, latitude: number | null, longitude: number | null, token: string }) => {

    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/workspace/business/google/suggestions?query=${input}${latitude ? `&latitude=${latitude}` : ""}${longitude ? `&longitude=${longitude}` : ""}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
    })
}

export const getBusinessDetails = async ({ placeId, token }: { placeId: string, token: string }) => {

    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/workspace/business/google/place-details?place_id=${placeId}`,
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

export const getDashboard = async ({ placeId, sessionToken, token }: { placeId: string, sessionToken: string, token: string }) => {
    
    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/workspace/dashboard?place_id=${placeId}&session_token=${sessionToken}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const bookmarkReview = async ({ token, place_id, status, review_id }: { token: string, place_id: string, status: boolean, review_id: string }) => {
    
    return await axios({
        method: "post",
        url: `${BUSINESS_BASE_URL}/workspace/bookmark-review/${status}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: {
            place_id,
            review_id
        }
    })
}

export const getAllBookmarkedReviews = async ({ placeId, token }: { placeId: string, token: string }) => {
    
    return await axios({
        method: "get",
        url: `${BUSINESS_BASE_URL}/workspace/bookmark-review/${placeId}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const setUserOnboardStatus = async ({ token }: { token: string }) => {
    
    return await axios({
        method: "get",
        url: `${BASE_URL_V2}/auth/update-onboard-status`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const updateUserProfile = async (data: any) => {
    
    const { token, body } = data;

    return await axios({
        method: "put",
        url: `${BASE_URL_V2}/auth/update-user`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: { ...body }
    })
}

export const deleteAccount = async (token: string) => {

    return await axios({
        method: "delete",
        url: `${BASE_URL_V2}/auth/delete-account`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
    })
}



