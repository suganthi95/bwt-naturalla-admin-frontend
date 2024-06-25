import axios from "axios";
const BASE_URL = "https://rising-memory-402507.el.r.appspot.com"

export const getReviews = async (reviewId: string) => {
    return await axios({
        method: "get",
        url: `${BASE_URL}/review/getReviews/${reviewId}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RncDM0QGhnbWFpbC5jb20iLCJpYXQiOjE3MTkzMTMzNTcsImV4cCI6MTcxOTkxODE1N30.y0cf3S432j2VXGfW2Hx1gPsMz7pmn4qzB46HIgVUpZg"
        }
    })
}