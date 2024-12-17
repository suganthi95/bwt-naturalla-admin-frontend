/* eslint-disable @typescript-eslint/no-explicit-any */
import { TokenResponse } from "@react-oauth/google";
import axios, { GenericAbortSignal } from "axios";

export const PAYMENT_KEY = "rzp_test_xSZldxULopihDB"  // test
// export const PAYMENT_KEY = "rzp_live_mz2A9YRKJoRNfV"       // live

// production
// const BASE_URL_V2 = "https://backend-auth-c62gk7tmha-el.a.run.app/api/v1";
// const BUSINESS_BASE_URL = "https://backend-reviews-c62gk7tmha-el.a.run.app/api/v1";
// const PAYMENT_BASE_URL = "https://backend-payment-91592131102.asia-south1.run.app/api/v1"

//staging
const BASE_URL_V2 = "https://backend-auth-staging-91592131102.asia-south1.run.app/api/v1";
const BUSINESS_BASE_URL = "https://backend-reviews-staging-91592131102.asia-south1.run.app/api/v1";
const PAYMENT_BASE_URL = "https://backend-payment-staging-91592131102.asia-south1.run.app/api/v1";



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
        method: "post",
        url: `${BASE_URL_V2}/auth/verify/google-user`,
        data: {
            access_token: user?.access_token
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
            zip_code: data.zipCode,
            total_reviews: data.totalReviews
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

export const deleteAccount = async ({ token, email }: { token: string, email: string }) => {

    return await axios({
        method: "delete",
        url: `${BASE_URL_V2}/auth/delete-account/${email}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
    })
}

export const sendFeedback = async ({ token, feedbackType, message, file }: { token: string, feedbackType: string, message: string, file: FileList }) => {

    const formdata = new FormData();
    formdata.append("feedback_type", feedbackType);
    formdata.append("message", message);

    if(file[0] !== undefined){
        formdata.append("file", file[0]);
    }

    return await axios({
        method: "post",
        url: `${BUSINESS_BASE_URL}/workspace/feedback`,
        headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": token
        },
        data: formdata
    })
}

export const setNotification = async ({ token, status }: { token: string, status: boolean }) => {
    
    return await axios({
        method: "get",
        url: `${BASE_URL_V2}/auth/set-notification/${status}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const setTimezone = async ({ token, timezone }: { token: string, timezone: string }) => {
    
    return await axios({
        method: "post",
        url: `${BASE_URL_V2}/auth/update-timezone`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: {
            timezone
        }
    })
}

export const getSentimentDistribution = async ({ token, placeId }: { token: string, placeId: string }) => {
    
    return await axios({
        method: "get",
        url: `https://intelliresponsedashboard01-91592131102.asia-south1.run.app/sentiment_distribution/${placeId}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const reviewLenAnalysis = async ({ token, placeId }: { token: string, placeId: string }) => {
    
    return await axios({
        method: "get",
        url: `https://intelliresponsedashboard01-91592131102.asia-south1.run.app/review_length_analysis/${placeId}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const reviewActiveTime = async ({ token, placeId }: { token: string, placeId: string }) => {
    
    return await axios({
        method: "get",
        url: `https://intelliresponsedashboard01-91592131102.asia-south1.run.app/reviews_active_time/${placeId}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const avgSentiment = async ({ token, placeId }: { token: string, placeId: string }) => {
    
    return await axios({
        method: "get",
        url: `https://intelliresponsedashboard01-91592131102.asia-south1.run.app/average_sentiment_over_time/${placeId}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const sentimentDistributionOvertime = async ({ token, placeId }: { token: string, placeId: string }) => {
    
    return await axios({
        method: "get",
        url: `https://intelliresponsedashboard01-91592131102.asia-south1.run.app/sentiment_distribution_over_time/${placeId}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const responseRate = async ({ token, placeId }: { token: string, placeId: string }) => {
    
    return await axios({
        method: "get",
        url: `https://intelliresponsedashboard01-91592131102.asia-south1.run.app/response_rate/${placeId}`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const fetchSubscriptionPlans = async ({ token, latitude, longitude }: { token: string, latitude: number | null, longitude: number | null }) => {

    return await axios({
        method: "post",
        url: `${PAYMENT_BASE_URL}/payment/fetch/plans`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: {
            latitude: latitude,
            longitude: longitude
        }
    })
}

export const createSubscription = async ({ token, planId, country }: { token: string, planId: number | null, country: string }) => {
    
    return await axios({
        method: "post",
        url: `${PAYMENT_BASE_URL}/payment/initiate/subscription`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: {
            plan_id: planId,
            country: country
        }
    })
}

export const verifySubscription = async ({ token, razorpay_payment_id, razorpay_signature, razorpay_subscription_id }: { token: string, razorpay_payment_id: string, razorpay_signature: string, razorpay_subscription_id: string }) => {
    
    return await axios({
        method: "post",
        url: `${PAYMENT_BASE_URL}/payment/verify-subscription`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: {
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id
        }
    })
}

export const getBillings = async ({ token }: { token: string }) => {
    
    return await axios({
        method: "get",
        url: `${PAYMENT_BASE_URL}/payment/get/subscription`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}


export const cancelSubscription = async ({ token }: { token: string }) => {
    
    return await axios({
        method: "put",
        url: `${PAYMENT_BASE_URL}/payment/cancel/subscription`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const getCreditsList = async ({ token, latitude, longitude }: { token: string, latitude: null | number, longitude: null | number }) => {
    
    return await axios({
        method: "post",
        url: `${PAYMENT_BASE_URL}/payment/credit/items`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: {
            latitude: latitude,
            longitude: longitude
        }
    })
}

export const buyCredits = async ({ token, itemId, country }: { token: string, itemId: number, country: string }) => {
    
    return await axios({
        method: "post",
        url: `${PAYMENT_BASE_URL}/payment/create/order`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: {
            item_id: itemId,
            country
        }
    })
}

export const verifyCreditCheckout = async ({ token, razorpay_payment_id, razorpay_signature, razorpay_order_id }: { token: string, razorpay_payment_id: string, razorpay_signature: string, razorpay_order_id: string }) => {
    
    return await axios({
        method: "post",
        url: `${PAYMENT_BASE_URL}/payment/verify/checkout/payment`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        },
        data: {
            razorpay_payment_id,
            razorpay_signature,
            razorpay_order_id
        }
    })
}

export const getPaymentHistoryTable = async ({ token }: { token: string }) => {
    
    return await axios({
        method: "get",
        url: `${PAYMENT_BASE_URL}/payment/details`,
        headers: {
            Accept: 'application/json',
            "Authorization": token
        }
    })
}

export const fetchInvoice = async ({ token, paymentId }: { token: string, paymentId: string }) => {
    
    return await axios({
        method: "post",
        url: `${PAYMENT_BASE_URL}/payment/invoice/receipt`,
        headers: {
            Accept: "application/pdf",
            "Authorization": token
        },
        responseType: "blob",
        data: {
            payment_id: paymentId
        }
    })
}

export const verifyOtp = async ({ token, otp }: { token: string, otp: string }) => {
    
    return await axios({
        method: "post",
        url: `${BASE_URL_V2}/auth/verify/otp`,
        headers: {
            "Authorization": token
        },
        data: {
            otp
        }
    })
}

export const resendOtp = async ({ token }: { token: string }) => {
    
    return await axios({
        method: "post",
        url: `${BASE_URL_V2}/auth/resend/otp`,
        headers: {
            "Authorization": token
        }
    })
}


