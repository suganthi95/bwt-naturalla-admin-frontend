export type ReviewType = {
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
    "sentiment": "Strongly Positive",
    "sentimentScore": 0.75
}

export type ReviewSuggestionType = {
    casual_tone: string,
    balanced_tone: string,
    professional_tone: string,
    overall_sentiment: "positive" | "negative",
    _id: string,
    review: {
        _id: string,
        createdAt: string,
        updatedAt: string
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
    place_id: string
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
    industry: string,
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
    credit: number
    workspaceList: WorkspaceList[]
    businessList: BusinessList[]
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