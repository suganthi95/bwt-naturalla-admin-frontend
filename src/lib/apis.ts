/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductFormValues } from "@/types";
import { CouponInput, CreateUserPayload } from "@/types/type";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const BASE_FRONTEND_URL = import.meta.env.VITE_BASE_FRONTEND_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export const signin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await axios({
    method: "post",
    url: `${BASE_URL}/auth/login`,
    data: {
      email,
      password,
    },
  });
};


export const forgotPassword = async(email:string)=>{
return await axios({
  method:'post',
  url:`${BASE_URL}/auth/forgot/password`,
  data:{
    email
  }
})
}



export const verifyForgorPasswordToken = async(token:string)=>{
return await axios({
  method:'post',
  url:`${BASE_URL}/auth/verify/link/${token}`,
})
}



export const resetPassword = async(password: string, token: string)=>{
return await axios({
  method:'post',
  url:`${BASE_URL}/auth/reset/password`,
  headers:{
    Authorization:token
  },
  data:{
    password
  }
})
}

export const getDashboard = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/dashboard/review/product`,
    headers: {
      Authorization: token,
    },
  });
};
export const getDashboardOrders = async (token: string, param: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/dashboard/top/orders/${param}`,
    headers: {
      Authorization: token,
    },
  });
};
export const getDashboardCities = async (token: string, param: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/dashboard/top/cities/${param}`,
    headers: {
      Authorization: token,
    },
  });
};
export const getDashboardProducts = async (token: string, param: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/dashboard/top/products/${param}`,
    headers: {
      Authorization: token,
    },
  });
};

export const getAllCategories = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/category/getCategories`,
    headers: {
      Authorization: token,
    },
  });
};

export const getAllProducts = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/products`,
    headers: {
      Authorization: token,
    },
  });
};

export const getAllOrders = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/order`,
    headers: {
      Authorization: token,
    },
  });
};
export const getOrderDetails = async (token: string, id: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/order/${id}`,
    headers: {
      Authorization: token,
    },
  });
};

export const getProductCategories = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/category/getCategories`,
    headers: {
      Authorization: token,
    },
  });
};

export const getCategories = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/categories`,
    headers: {
      Authorization: token,
    },
  });
};
export const getCategoriesProductsIcon = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/category/product/icon`,
    headers: {
      Authorization: token,
    },
  });
};

export const addCategories = async (token: string, data: any) => {
  const formdata = new FormData();

  formdata.append("category_name", data.category_name);
  formdata.append("slug", data.slug);
  data.subCategories.forEach((subCategory: string, index: number) => {
    formdata.append(`subcategory_name[${index}]`, subCategory);
  });

  data.icon_data.forEach((item: any, index: number) => {
    formdata.append(
      `icon_data[${index}]`,
      JSON.stringify({ icon_id: item.icon_id, icon_text: item.effect_name })
    );
  });

  formdata.append("thumbnail_image", data.thumbnail);
  formdata.append("tax_percent", String(data.tax));

  return await axios({
    method: "post",
    url: `${BASE_URL}/category/addCategory`,
    data: formdata,
    headers: {
      Authorization: token,
    },
  });
};

export const UpdateCategories = async (token: string, data: any) => {
  const formdata = new FormData();

  formdata.append("category_name", data.category_name);
  formdata.append("slug", data.slug);
  data.subCategories.forEach((subCategory: string, index: number) => {
    formdata.append(`subcategory_name[${index}]`, subCategory);
  });
  data.icon_data.forEach((item: any, index: number) => {
    formdata.append(
      `icon_data[${index}]`,
      JSON.stringify({ icon_id: item.icon_id, icon_text: item.icon_text })
    );
  });
  formdata.append("thumbnail_image", data.thumbnail);
  formdata.append("category_id", data.category_id);

  formdata.append("tax_percent", String(data.tax));

  return await axios({
    method: "put",
    url: `${BASE_URL}/category/updateCategory`,
    data: formdata,
    headers: {
      Authorization: token,
    },
  });
};

export const getProductInfo = async (token: string, productId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/primary/detail/${productId}`,
    headers: {
      Authorization: token,
    },
  });
};

export const deleteCategory = async (token: string, id: string) => {
  return await axios({
    method: "delete",
    url: `${BASE_URL}/Category/deleteCategory/${id}`,
    headers: {
      Authorization: token,
    },
  });
};
export const getUsers = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/auth/getAllUsers`,
    headers: {
      Authorization: token,
    },
  });
};

export const getUserHistory = async (token: string, id: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/order/user-history/${id}`,
    headers: {
      Authorization: token,
    },
  });
};

export const getUserHistoryByYear = async (
  token: string,
  id: string,
  year?: string
) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/order/user-order-history/yearly/${id}/${year}`,
    headers: {
      Authorization: token,
    },
  });
};

export const getUserOrderDetail = async (token: string, order_id: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/order/user-order/${order_id}`,
    headers: {
      Authorization: token,
    },
  });
};

export const createUser = async (token: string, payload: CreateUserPayload) => {
  return await axios({
    method: "post",
    url: `${BASE_URL}/auth/createUser`,
    data: payload,
    headers: {
      Authorization: token,
    },
  });
};

export const updateUser = async (
  token: string,
  payload: CreateUserPayload,
  id: string
) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/auth/updateUser/${id}`,
    data: payload,
    headers: {
      Authorization: token,
    },
  });
};

export const deleteUser = async (token: string, id: string) => {
  return await axios({
    method: "delete",
    url: `${BASE_URL}/auth/deleteUser/${id}`,
    headers: {
      Authorization: token,
    },
  });
};
export const toggleUserStatus = async (
  token: string,
  id: string,
  status: string
) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/auth/update/status/${id}`,
    data: {
      status,
    },
    headers: {
      Authorization: token,
    },
  });
};

export const getConfigureCouponlist = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/coupon/getcouponlisting`,
    headers: {
      Authorization: token,
    },
  });
};

export const addConfigureCoupons = async (
  token: string,
  payload: CouponInput
) => {
  return await axios({
    method: "post",
    url: `${BASE_URL}/coupon/addcoupon`,
    data: payload,
    headers: {
      Authorization: token,
    },
  });
};

export const updateConfigureCoupons = async (
  token: string,
  payload: CouponInput,
  coupon_id: number
) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/coupon/update/${coupon_id}`,
    data: payload,
    headers: {
      Authorization: token,
    },
  });
};
export const deleteConfigureCoupons = async (token: string, id: number) => {
  return await axios({
    method: "delete",
    url: `${BASE_URL}/coupon/delete/${id}`,
    headers: {
      Authorization: token,
    },
  });
};

export const PaymentProviders = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/payment/getAllPayments`,
    headers: {
      Authorization: token,
    },
  });
};

export const togglePayment = async ({
  token,
  provider_id,
  enabled,
  user_id,
}: {
  token: string;
  provider_id: string;
  enabled: boolean;
  user_id: number;
}) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/payment/updatepayment/${provider_id}`,
    data: {
      enabled,
      user_id,
    },
    headers: {
      Authorization: token,
    },
  });
};

export const getShippingfee = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/shipment/getshipping-fee`,
    headers: {
      Authorization: token,
    },
  });
};

export const updateShippingfee = async (
  shipping_type_id: number,
  min_amount: number,
  shipping_fee: number,
  shipping_fee_type: string,
  token: string
) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/shipment/updateshippingfee/${shipping_type_id}`,
    data: {
      shipping_fee,
      min_amount,
      shipping_fee_type,
    },
    headers: {
      Authorization: token,
    },
  });
};

export const getCoupons = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/coupons`,
    headers: {
      Authorization: token,
    },
  });
};

export const getCategoryBasedIcons = async (token: string, id: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/category/icon/${id}`,
    headers: {
      Authorization: token,
    },
  });
};
export const ImportProdcuts = async ({
  token,
  data,
}: {
  token: string;
  data: any;
}) => {
  const formdata = new FormData();
  formdata.append("file", data);

  return await axios({
    method: "post",
    url: `${BASE_URL}/dataImport/import-csv`,
    data: formdata,
    headers: {
      Authorization: token,
    },
  });
};
export const addProductInfo = async ({
  token,
  data,
}: {
  token: string;
  data: any;
}) => {
  const formdata = new FormData();
  formdata.append("product_name", data.productName);
  formdata.append("category_id", data.category.split("::")[1]);
  formdata.append("subcategory_id", data.subCategory.split("::")[1]);
  formdata.append("units", data.unit);
  formdata.append("min_order_quantity", data.minOrderQty);
  formdata.append("hsn_code", data.hsn_code);
  formdata.append("slug", data.slug);
  formdata.append("product_id", data.productId ? data.productId : null);

  if (data.thumbnail.media_id) {
    formdata.append("thumbnail_image_id", data.thumbnail.media_id);
  } else {
    formdata.append("thumbnail_image", data.thumbnail[0]);
  }

  data.galleryImages?.forEach((image: any, index: number) => {
    if (image === null) {
      formdata.append(`gallery_images_id[${index}]`, "null");
    } else if (image.media_id) {
      formdata.append(`gallery_images_id[${index}]`, image.media_id);
    } else {
      formdata.append(`gallery_images`, image[0]);
      formdata.append(`gallery_images_id[${index}]`, "null");
    }
  });

  data?.tags?.forEach((tag: string, index: number) => {
    formdata.append(`tags[${index}]`, tag);
  });
  data?.pairs?.forEach((item: any, index: number) => {
    formdata.append(`icon_ids[${index}]`, `${item.icon_id}`);
  });
  return await axios({
    method: "post",
    url: `${BASE_URL}/products/add-product`,
    data: formdata,
    headers: {
      Authorization: token,
    },
  });
};

export const addProductPrice = async ({
  token,
  data,
}: {
  token: string;
  data: any;
}) => {
  return await axios({
    method: "post",
    url: `${BASE_URL}/products/product-price-stock`,
    data: {
      product_id: parseInt(data.productId),
      unit_price: data.unitPrice,
      strike_through_price: data.strikeThroughPrice,
      special_discount_type: data.specialDiscountType,
      special_discount_percent: data?.specialDiscountPercentage,
      special_discount_amount: data?.specialDiscountAmount,
      discount_start_at:
        data.discountPeriodStartat === "Invalid Date"
          ? null
          : data.discountPeriodStartat,
      discount_end_at:
        data.discountPeriodendat === "Invalid Date"
          ? null
          : data.discountPeriodendat,
      current_stock: data.currentStock,
      stock_visibility: data.stockVisibility === "show" ? true : false,
      minimum_stock_warning: data.minimumStockWarning,
      sku: data.sku,
    },
    headers: {
      Authorization: token,
    },
  });
};

export const addProductSpecs = async ({
  token,
  data,
}: {
  token: string;
  data: ProductFormValues;
}) => {
  const formdata = new FormData();
  formdata.append("product_id", data.productId as string);
  formdata.append("short_description", data.shortDescription);
  formdata.append("long_description", data.longDescription);
  formdata.append("benefits", data.benefits);
  formdata.append("how_to_use", data.howToUse);
  formdata.append("ingredients", data.ingredients);
  formdata.append("is_featured", data.isFeatured ? "true" : "false");
  formdata.append("best_selling", data.bestSelling ? "true" : "false");
  formdata.append("offer_ending_soon", data.offerEndingSoon ? "true" : "false");
  formdata.append("isin_todays_deal", data.todayDeal ? "true" : "false");
  formdata.append("length", data.length.toString());
  formdata.append("weight", data.weight.toString());
  formdata.append("height", data.height.toString());
  formdata.append("breadth", data.breadth.toString());
  // formdata.append("pdf", data.specificationPDF[0]);

  if (data.specificationPDF.pdf_id) {
    formdata.append("pdf_id", data.specificationPDF?.pdf_id);
  } else {
    formdata.append("pdf", data.specificationPDF[0]);
  }

  data.benefitKeywords?.forEach((item: string, index: number) => {
    formdata.append(`benefit_keys[${index}]`, item);
  });

  return await axios({
    method: "post",
    url: `${BASE_URL}/products/product-description`,
    data: formdata,
    headers: {
      Authorization: token,
    },
  });
};

export const addCoupons = async (payload: {
  token: string;
  data: { coupon: number | null; productId: string };
}) => {
  return await axios({
    method: "post",
    url: `${BASE_URL}/products/add/coupon`,
    data: {
      coupon_id: payload.data.coupon,
      product_id: parseInt(payload.data.productId),
    },
    headers: {
      Authorization: payload.token,
    },
  });
};

export const addMetaSEO = async ({
  token,
  data,
}: {
  token: string;
  data: any;
}) => {
  const formdata = new FormData();
  formdata.append("product_id", data.productId as string);
  formdata.append("meta_title", data.metaTitle);
  formdata.append("meta_description", data.metaDescription);

  data.metaKeywords.forEach((item: string, index: number) => {
    formdata.append(`meta_keywords[${index}]`, item);
  });

  if (typeof data.metaImage === "string") {
    formdata.append("image_url", data.metaImage);
  }

  if (data.metaImage instanceof FileList) {
    formdata.append("image", data.metaImage[0]);
  }

  return await axios({
    method: "post",
    url: `${BASE_URL}/products/meta/info`,
    data: formdata,
    headers: {
      Authorization: token,
    },
  });
};

export const updateProductToggle = async (token: string, data: any) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/products/update/toggles/${data.productId}`,
    data: {
      ...data,
    },
    headers: {
      Authorization: token,
    },
  });
};

export const getProductPrice = async (token: string, productId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/price/stock/${productId}`,
    headers: {
      Authorization: token,
    },
  });
};

export const getProductSpecs = async (token: string, productId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/spec/${productId}`,
    headers: {
      Authorization: token,
    },
  });
};

export const getProductCoupons = async (token: string, productId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/coupon/${productId}`,
    headers: {
      Authorization: token,
    },
  });
};

export const getProductSEO = async (token: string, productId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/meta/info/${productId}`,
    headers: {
      Authorization: token,
    },
  });
};

export const getProductFaq = async (token: string, productId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/faq/${productId}`,
    headers: {
      Authorization: token,
    },
  });
};

export const postProductFaq = async ({
  token,
  productId,
  faq,
}: {
  token: string;
  productId: string;
  faq: any;
}) => {
  const data = faq.map((item: any) => ({
    qn: item.question,
    ans: item.answer,
  }));

  return await axios({
    method: "post",
    url: `${BASE_URL}/products/faq/${productId}`,
    headers: {
      Authorization: token,
    },
    data: {
      faq: data,
    },
  });
};

export const getShipmentList = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/shipment/getShipmentList`,
    headers: {
      Authorization: token,
    },
  });
};

export const getShipmentDetails = async (token: string, shipmentId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/shipment/getShipmentDetails/${shipmentId}`,
    headers: {
      Authorization: token,
    },
  });
};

export const deleteProduct = async ({
  token,
  productId,
}: {
  token: string;
  productId: string;
}) => {
  return await axios({
    method: "delete",
    url: `${BASE_URL}/products/products/${productId}`,
    headers: {
      Authorization: token,
    },
  });
};

export const getProfile = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/profile/profile-info`,
    headers: {
      Authorization: token,
    },
  });
};

export const updateProfile = async ({
  firstname,
  lastname,
  email,
  phoneNumber,
  token,
}: any) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/profile/update-password`,
    headers: {
      Authorization: token,
    },
    data: {
      first_name: firstname,
      last_name: lastname,
      email: email,
      phone_no: phoneNumber,
      // user_password: ,
      // new_password: ,
    },
  });
};

export const updatePassword = async (
  token: string,
  user_password: string,
  new_password: string
) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/profile/updateNewPassword`,
    headers: {
      Authorization: token,
    },
    data: {
      user_password,
      new_password,
    },
  });
};

export const getBlogs = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/blogs`,
    headers: {
      Authorization: token,
    },
  });
};

export const createBlog = async (token: string, data: any) => {
  const formdata = new FormData();
  formdata.append("blog_title", data.title);
  formdata.append("blog_desc", data.description);
  formdata.append("blog_status", data.status);
  // formdata.append("blog_publish", data.showPublish);
  formdata.append("blog_publish", "false");

  formdata.append("blog_image", data.thumbnail);
  formdata.append("blog_content", data.content);

  data?.tags?.forEach((item: string, index: number) => {
    formdata.append(`blog_tags[${index}]`, item);
  });
  return await axios({
    method: "post",
    url: `${BASE_URL}/blogs`,
    data: formdata,
    headers: {
      Authorization: token,
    },
  });
};
export const editBlog = async (token: string, data: any) => {
  const formdata = new FormData();

  formdata.append("blog_title", data.title);
  formdata.append("blog_desc", data.description);
  formdata.append("blog_status", data.status);
  // formdata.append("blog_publish", data.showPublish);
  formdata.append("blog_publish", "false");

  formdata.append("blog_image", data.thumbnail);
  formdata.append("blog_content", data.content);

  data?.tags?.forEach((item: string, index: number) => {
    formdata.append(`blog_tags[${index}]`, item);
  });
  return await axios({
    method: "put",
    url: `${BASE_URL}/blogs/${data.id}`,
    data: formdata,
    headers: {
      Authorization: token,
    },
  });
};

export const deleteBlog = async (token: string, id: string) => {
  return await axios({
    method: "delete",
    url: `${BASE_URL}/blogs/${id}`,
    headers: {
      Authorization: token,
    },
  });
};

export const getLegalPagesList = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/legal/page`,
    headers: {
      Authorization: token,
    },
  });
};

export const getLegalPageDetails = async (token: string, id: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/legal/page/${id}`,
    headers: {
      Authorization: token,
    },
  });
};

export const editLegalPage = async (token: string, id: string) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/legal/page/update/${id}`,
    headers: {
      Authorization: token,
    },
  });
};

export const getCustomerQueries = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/customer/support`,
    headers: {
      Authorization: token,
    },
  });
};

export const getAllBanners = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/banners/banners`,
    headers: {
      Authorization: token,
    },
  });
};

export const deleteBanner = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}) => {
  return await axios({
    method: "delete",
    url: `${BASE_URL}/banners/delete-banner/${id}`,
    headers: {
      Authorization: token,
    },
  });
};

export const getTicketDetails = async (token: string, id: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/customer/support/${id}`,
    headers: {
      Authorization: token,
    },
  });
};

export const addBanner = async ({
  token,
  title,
  type,
  bannerImage,
  publish,
  ctaLink,
}: {
  token: string;
  title: string;
  type: string;
  bannerImage: FileList;
  publish: boolean;
  ctaLink: string;
}) => {
  const formdata = new FormData();

  formdata.append("name", title);
  formdata.append("cta_link", ctaLink);
  formdata.append("published", publish ? "true" : "false");
  formdata.append("type", type);
  formdata.append("images", bannerImage[0]);

  return await axios({
    method: "post",
    url: `${BASE_URL}/banners/create-banner`,
    headers: {
      Authorization: token,
    },
    data: formdata,
  });
};

export const updateBanner = async ({
  token,
  title,
  type,
  bannerImage,
  publish,
  ctaLink,
  bannerImageId,
  id,
}: {
  token: string;
  title: string;
  type: string;
  bannerImage: FileList;
  publish: boolean;
  ctaLink: string;
  bannerImageId: number;
  id: number;
}) => {
  const formdata = new FormData();

  formdata.append("name", title);
  formdata.append("cta_link", ctaLink);
  formdata.append("published", publish ? "true" : "false");
  formdata.append("type", type);

  if (typeof bannerImage === "string") {
    formdata.append("existing_image_ids", bannerImageId.toString());
  }

  if (bannerImage instanceof FileList) {
    formdata.append("images", bannerImage[0]);
  }

  return await axios({
    method: "put",
    url: `${BASE_URL}/banners/update-banner/${id}`,
    headers: {
      Authorization: token,
    },
    data: formdata,
  });
};

export const addReply = async (
  token: string,
  ticket_id: string,
  reply_message: string
) => {
  return await axios({
    method: "post",
    url: `${BASE_URL}/customer/support/reply/${ticket_id}`,
    data: {
      reply_message,
    },
    headers: {
      Authorization: token,
    },
  });
};

export const updatePriority = async (
  token: string,
  ticket_id: string,
  priority: string
) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/customer/support/update/priority/${ticket_id}`,
    data: {
      priority,
    },
    headers: {
      Authorization: token,
    },
  });
};

export const updateStatus = async (
  token: string,
  ticket_id: string,
  status: string
) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/customer/support/update/status/${ticket_id}`,
    data: {
      status,
    },
    headers: {
      Authorization: token,
    },
  });
};

export const getAllLegalPages = async (token: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/legal/page`,
    headers: {
      Authorization: token,
    },
  });
};

export const getLegalPage = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/legal/page/${id}`,
    headers: {
      Authorization: token,
    },
  });
};

export const updateLegalPage = async ({ token, ...data }: any) => {
  const formdata = new FormData();

  formdata.append("page_title", data.title);
  formdata.append("page_content", data.content);
  formdata.append("status", data.status);

  return await axios({
    method: "put",
    url: `${BASE_URL}/legal/page/update/${data.id}`,
    headers: {
      Authorization: token,
    },
    data: formdata,
  });
};

export const updateOrderStatus = async ({
  token,
  id,
  status,
}: {
  token: string;
  id: string;
  status: string;
}) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/order/update/status/${id}`,
    headers: {
      Authorization: token,
    },
    data: {
      status: status,
    },
  });
};
// customer/support/list/reviews?category_id=1&sort=newest&selectby_time=1 week&ratings=3

export const getCustomerReviews = async ({
  token,
  category_id,
  sort,
  selectby_time,
  ratings,
}: {
  token: string;
  category_id?: string;
  sort?: string;
  selectby_time?: string;
  ratings?: string;
}) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/customer/support/list/reviews?category_id=${category_id}&sort=${sort}&selectby_time=${selectby_time}&ratings=${ratings}`,
    headers: {
      Authorization: token,
    },
  });
};
export const getAllPromo = async ({ token }: { token: string }) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/promo/offer`,
    headers: {
      Authorization: token,
    },
  });
};
export const addPromo = async ({
  token,
  promo_offer_txt,
}: {
  token: string;
  promo_offer_txt: string;
}) => {
  return await axios({
    method: "post",
    url: `${BASE_URL}/promo/offer`,
    data: {
      promo_offer_txt,
    },
    headers: {
      Authorization: token,
    },
  });
};
export const editPromo = async ({
  token,
  id,
  promo_offer_txt,
}: {
  token: string;
  id: string;
  promo_offer_txt: string;
}) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/promo/offer/${id}`,
    data: {
      promo_offer_txt,
    },
    headers: {
      Authorization: token,
    },
  });
};

export const deletePromo = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}) => {
  return await axios({
    method: "delete",
    url: `${BASE_URL}/promo/offer/${id}`,
  
    headers: {
      Authorization: token,
    },
  });
};
