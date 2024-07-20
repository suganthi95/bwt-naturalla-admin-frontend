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
    "reviews_id": string | null
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
    user: User
    server_token: string
}

export interface User {
    _id: string
    email: string
    profilePic: string
    fullname: string
    username: string
    businessId: string[]
    loggedIn: LoggedIn[]
    createdAt: string
    updatedAt: string
    __v: number
}
  
export interface LoggedIn {
    timeStamp: string
    createdAt: string
    updatedAt: string
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