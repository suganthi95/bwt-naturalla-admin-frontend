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
    activeWorkspace: string,
    onboarded: boolean
}

export interface GetBusinessType {
    _id: string
    placeId: string
    businessName: string
    streetNumber: string
    street: string
    city: string
    zipCode: string
    userId: string
    userEmail: string
    createdAt: string
    updatedAt: string
    __v: number
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