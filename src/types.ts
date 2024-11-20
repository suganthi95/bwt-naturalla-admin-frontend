import { ReactElement } from "react"

export type ReviewType = {
    "is_bookmarked": boolean,
    "google_id": string,
    "review_id": string,
    "review_pagination_id": string,
    "author_link": string,
    "author_title": string,
    "author_id": string,
    "author_image": string,
    "author_reviews_count": number,
    "author_ratings_count": number,
    "review_text": string,
    "review_img_urls": string | null,
    "review_img_url": string | null,
    "review_questions": {
        "Food": string,
        "Service": string,
        "Atmosphere": string
    },
    "review_photo_ids": string |null,
    "owner_answer": string | null,
    "owner_answer_timestamp": number | null,
    "owner_answer_timestamp_datetime_utc": string | null,
    "review_link": string,
    "review_rating": number,
    "review_timestamp": number,
    "review_datetime_utc": string | null,
    "review_likes": number,
    "reviews_id": string | null,
    "sentiment": "positive" | "negative",
}

export type ReviewSuggestionType = {
    casual_tone: {
        response: string,
        generation_id: string
    },
    professional_tone: {
        response: string,
        generation_id: string
    },
    overall_sentiment: "positive" | "negative",
    sentiment_score: number,
    remaining_credit: {
        credit: number
    }
}

export interface AuthType {
    data: User
    message: "Success",
    token: string
}

export interface User {
    name: string,
    email: string,
    password: string | null,
    role: string | null,
    industry: string | null,
    created_at: Date,
    through: "google",
    workspaces: string[],
    business_type: string | null,
    heard_through: string | null,
    active_workspace_name: string,
    onboarded: boolean
}

export interface GetBusinessType {
    business_name: string
    street_number: string
    street: string
    city: string
    email: string
    zip_code: string
    place_id: string,
    created_at: Date
}

export type SignUpType = {
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}

export type OnBoardType = {
    business: string,
    role: string,
    industry: string[],
    heardThrough: string,
    workspaceName: string
}

export interface ValidateUserType {
    name: string
    email: string
    password: string
    role: string
    industry: string
    created_at: string
    through: string
    workspaces: string[]
    business_type: string
    heard_through: string
    onboarded: boolean
    active_workspace: string
    onboarded_at: Date | null
    credit: number,
    notification: boolean,
    timezone: string | null,
    workspaceList: WorkspaceList[],
    businessList: BusinessList[],
    remaining_credits: number,
    remaining_instant_Credits: number,
    plan_end_date: Date,
    plan_name: "pro-plan" | "standard plan" | "free trial"

}
  
export interface WorkspaceList {
    workspace_name: string
    workspace_id: string
    active_business: string | null
}

export interface BusinessList {
    business_name: string,
    place_id: string
}

export interface DashboardDataType {
    credits: number,
    total_credits: number,
    instant_credits: number,
    total_instant_credits: number,
    totalRatings: number
    chartData: any,
    total_business: string
}

export type CollapseType  = {
    "general": MenuType[]
    "menu": MenuType[]
    "apps/integrations": MenuType[]
}

export type MenuType = {
    name: string
    route: string
    icon: ReactElement,
    shouldVisible: boolean
}

export type FeedbackFormType = {
    feedbackType: string,
    message: string,
    file: FileList
}

export interface BillingResponse {
    period: string
    plan_name: string
    ends_on: string
    next_due: string
    total_credits: number
    used_credits: number
    workspace_id: string
}

export interface PaymentHistoryResponseType {
    payment_id: string
    invoice_id: string
    method: string
    payment_date: string
    payment_status: string
    amount_paid: number
    validity_from: string
    validity_to: string
}