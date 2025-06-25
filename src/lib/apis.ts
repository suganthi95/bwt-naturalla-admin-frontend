/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductFormValues } from "@/types";
import { CouponInput, CreateUserPayload } from "@/types/type";
import axios from "axios";

//staging

const BASE_URL = "https://naturalla-admin-backend.onrender.com/api";

const axiosInstance = axios.create({
  baseURL:BASE_URL,
  headers:{
        "Content-Type": "application/json",

  }
})

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

export const getDashboard = async () => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/dashboard/review/product`,
  });
};
export const getDashboardOrders = async (param: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/dashboard/top/orders/${param}`,
  });
};
export const getDashboardCities = async (param: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/dashboard/top/cities/${param}`,
  });
};
export const getDashboardProducts = async (param: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/dashboard/top/products/${param}`,
  });
};

export const getAllCategories = async () => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/category/getCategories`,
  });
};

export const getAllProducts = async () => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/products`,
  });
};

export const getAllOrders = async () => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/order`,
  });
};
export const getOrderDetails = async (id: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/order/${id}`,
  });
};

export const getProductCategories = async () => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/category/getCategories`,
  });
};

export const getCategories = async () => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/categories`,
  });
};

export const addCategories = async (data: any) => {
  const formdata = new FormData();

  formdata.append("category_name", data.category_name);
  formdata.append("slug", data.slug);
  data.subCategories.forEach((subCategory: string, index: number) => {
    formdata.append(`subcategory_name[${index}]`, subCategory);
  });

  formdata.append("thumbnail_image", data.thumbnail);
  formdata.append("tax_percent", String(data.tax));

  return await axios({
    method: "post",
    url: `${BASE_URL}/category/addCategory`,
    data: formdata,
  });
};

export const UpdateCategories = async (data: any) => {
  const formdata = new FormData();

  formdata.append("category_name", data.category_name);
  formdata.append("slug", data.slug);
  data.subCategories.forEach((subCategory: string) => {
    formdata.append("subcategory_name", subCategory);
  });

  formdata.append("thumbnail_image", data.thumbnail);
  formdata.append("category_id", data.category_id);

  formdata.append("tax_percent", String(data.tax));

  return await axios({
    method: "put",
    url: `${BASE_URL}/category/updateCategory`,
    data: formdata,
  });
};

export const getProductInfo = async (productId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/primary/detail/${productId}`,
  });
};

export const deleteCategory = async (id: string) => {
  return await axios({
    method: "delete",
    url: `${BASE_URL}/Category/deleteCategory/${id}`,
  });
};
export const getUsers = async () => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/auth/getAllUsers`,
  });
};
export const createUser = async (payload: CreateUserPayload) => {
  return await axios({
    method: "post",
    url: `${BASE_URL}/auth/createUser`,
    data: payload,
  });
};

export const updateUser = async (payload: CreateUserPayload, id: string) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/auth/updateUser/${id}`,
    data: payload,
  });
};

export const deleteUser = async (id: string) => {
  return await axios({
    method: "delete",
    url: `${BASE_URL}/auth/deleteUser/${id}`,
  });
};

export const getConfigureCouponlist = async () => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/coupon/getcouponlisting`,
  });
};

export const addConfigureCoupons = async (payload: CouponInput) => {
  return await axios({
    method: "post",
    url: `${BASE_URL}/coupon/addcoupon`,
    data: payload,
  });
};

export const updateConfigureCoupons = async (
  payload: CouponInput,
  coupon_id: number
) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/coupon/update/${coupon_id}`,
    data: payload,
  });
};
export const deleteConfigureCoupons = async (id: number) => {
  return await axios({
    method: "delete",
    url: `${BASE_URL}/coupon/delete/${id}`,
  });
};

export const PaymentProviders = async () => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/payment/getAllPayments`,
  });
};

export const togglePayment = async ({
  provider_id,
  enabled,
  user_id,
}: {
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
  });
};

export const getShippingfee = async () => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/shipment/getshipping-fee`,
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

export const getCoupons = async () => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/coupons`,
  });
};

export const addProductInfo = async (data: any) => {
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

  data.galleryImages.forEach((image: any, index: number) => {
    if (image.media_id) {
      formdata.append(`gallery_images_id[${index}]`, image.media_id);
    } else {
      formdata.append(`gallery_images`, image[0]);
      formdata.append(`gallery_images_id[${index}]`, "null");
    }
  });

  data.tags.forEach((tag: string, index: number) => {
    formdata.append(`tags[${index}]`, tag);
  });

  return await axios({
    method: "post",
    url: `${BASE_URL}/products/add-product`,
    data: formdata,
  });
};

export const addProductPrice = async (data: any) => {
  return await axios({
    method: "post",
    url: `${BASE_URL}/products/product-price-stock`,
    data: {
      product_id: parseInt(data.productId),
      unit_price: data.unitPrice,
      strike_through_price: data.strikeThroughPrice,
      special_discount_type: data.specialDiscountType,
      special_discount_percent: data.specialDiscountPercentage,
      special_discount_amount: data.specialDiscountAmount,
      discount_start_at: data.discountPeriodStartat,
      discount_end_at: data.discountPeriodendat,
      current_stock: data.currentStock,
      stock_visibility: data.stockVisibility === "show" ? true : false,
      minimum_stock_warning: data.minimumStockWarning,
      sku: data.sku,
    },
  });
};

export const addProductSpecs = async (data: ProductFormValues) => {
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
  });
};

export const addCoupons = async (data: {
  coupon: number;
  productId: string;
}) => {
  return await axios({
    method: "post",
    url: `${BASE_URL}/products/add/coupon`,
    data: {
      coupon_id: data.coupon,
      product_id: parseInt(data.productId),
    },
  });
};

export const addMetaSEO = async (data: any) => {
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
  });
};

export const updateProductToggle = async (data: any) => {
  return await axios({
    method: "put",
    url: `${BASE_URL}/products/update/toggles/${data.productId}`,
    data: {
      ...data,
    },
  });
};

export const getProductPrice = async (productId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/price/stock/${productId}`,
  });
};

export const getProductSpecs = async (productId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/spec/${productId}`,
  });
};

export const getProductCoupons = async (productId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/coupon/${productId}`,
  });
};

export const getProductSEO = async (productId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/products/meta/info/${productId}`,
  });
};

export const getShipmentList = async () => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/shipment/getShipmentList`,
  });
};

export const getShipmentDetails = async (shipmentId: string) => {
  return await axios({
    method: "get",
    url: `${BASE_URL}/shipment/getShipmentDetails/${shipmentId}`,
  });
};

export const deleteProduct = async (productId: string) => {
  return await axios({
    method: "delete",
    url: `${BASE_URL}/products/products/${productId}`,
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
