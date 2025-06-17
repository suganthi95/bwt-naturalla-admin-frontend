/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
  

//staging
const BASE_URL = "https://naturalla-admin-backend.onrender.com/api";


export const signin = async({ email, password }: { email: string, password: string })=>{
 return await axios({
    method:'post',
    url:`${BASE_URL}/auth/login`,
    data:{
        email,
        password
    }
 })
}

export const getAllProducts = async() => {
    return await axios({
        method:'get',
        url:`${BASE_URL}/products/products`,
    })
}

export const getAllOrders = async() => {
    return await axios({
        method:'get',
        url:`${BASE_URL}/order`
    })
}

export const addProductInfo = async (data: any) => {

    const formdata = new FormData();
    formdata.append("product_name", data.productName)
    formdata.append("category_id", "1")
    formdata.append("subcategory_id", "1")
    formdata.append("units", data.unit)
    formdata.append("min_order_quantity", data.minOrderQty)
    formdata.append("slug", data.slug)
    formdata.append("thumbnail_image", data.thumbnail[0])
    formdata.append("product_id", data.productId ? data.productId : null)

    data.galleryImages.forEach((image: any) => {
        formdata.append(`gallery_images`, image[0])
    })

    data.tags.forEach((tag: string, index: number) => {
        formdata.append(`tags[${index}]`, tag)
    })

    return await axios({
        method:'post',
        url:`${BASE_URL}/products/add-product`,
        data: formdata
    })
}