export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phone_no: number;
  user_password  :string
}
export type Blog = {
  blog_id: number;
  blog_title: string;
  blog_desc: string;
  blog_home_image: string | null;
  blog_status: "draft" | "published";
  blog_tags: string[];
  created_by: number;
  created_at: string;
  updated_at: string | null;
  publish: boolean;
  blog_content: string;
  blog_images: number;
  blog_image_url: string;
  created_time:string
};

export type User = {
  user_id: number;
  has_order:boolean;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  user_password: string;
  pin_code: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  role: string;
  status:string;
  last_login:string | null
  device_token: string | null;
  otp_verified: boolean | null;
  language: string | null;
  password_updated_at: string | null;
  created_at: string;
  signup_otp: string | null;
  login_otp: string | null;
  signed_up: boolean | null;
  gender: string | null;
  date_of_birth: string | null;
  profile_pic: string | null;
  verify_email: boolean;
};

export type Order = {
  billing_first_name: string;
  billing_last_name: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_phone_no: string;
  order_id: number;
  user_id: number;
  order_date: string;
  quantity: number | null;
  address: string;
  city: string;
  state: string;
  country: string | null;
  pincode: string;
  order_amount: number;
  cash_on_delivery: boolean;
  payment_method: "prepaid" | "cod" | string;
  order_code: string;
  phone_number: string | null;
  payment_status: "paid" | "unpaid" | string;
  delivery_status: string;
  shipping_type_id: number | null;
  sub_total: number;
  discount_amount: number;
  coupon_discount: number | null;
  tax: number;
  shipping_fee: number;
  product_ids: number[];
  assign_delivery: boolean;
  order_status: string;
  shipmet_first_name: string;
  shipment_last_name: string;
  shipment_email: string;
  shipment_phone_no: string;
  coupon_id: number | null;
  cart_ids: number[] | null;
  coupon_dis_amount: number | null;
  shipment_retry_count: number;
  awb_code: string | null;
  shipment_status: string | null;
  track_url: string | null;
  profile_pic :string
};


export type ProductReview = {
  review_id: number;
  product_id: number;
  review_author_id: number;
  review_txt: string;
  ratings: number;
  created_at: string; 
  review_title: string;
  review_media_files: string | null;
  first_name: string;
  last_name: string;
  profile_pic: string | null;
};

export type CouponInput = {
  coupon_code: string;
  coupon_id ? :number;
  start_at: string; 
  end_at: string;   
  discount_type: string;
  discount: number;
  created_by ?: number;
  coupon_name: string;
  status?: string;
};

export interface Coupon {
  coupon_id: number;
  coupon_type: "ProductBased" | "CategoryBased" | "OrderBased" | string;
  coupon_code: string;
  start_at: string; // ISO date string
  end_at: string;   // ISO date string
  discount_type: string;
  discount: number;
  created_at: string; // ISO date string
  created_by: number | null;
  mini_shipping: number | null;
  max_discount: number | null;
  product_id: number | null;
  coupon_name: string;
  status: "active" | "inactive" | string;
  usage: number;
  limits: number | null;
}


export type ProductEffectIcon = {
  icon_text: string;
  icon_id: number;
  icon_name: string;
  created_at: string;
  icon_url: string;
  prod_icon_id: number;
};

export type BannersType = {
  banner_id: number
  name: string
  cta_link: string
  published: boolean
  type: string
  banner_image_id: number[]
  image_urls: string[]
}

export type UserOrderHistoryType = {
  order_id: number;
  order_date: string; // ISO date string
  items: number | null; 
  total_amount: number;
  order_status: string;
  invoice_url: string
};

export type GetLegalPagesType = {
  page_id: number
  page_title: string
  page_content: string
  status: string
  word_count: number
  updated_by: number
  updated_at: string
  first_name: string
  last_name: string
  updated_time: string
  redirect_url: string
}

export interface OrderDetailsByUserType {
  order_id: number
  order_code: string
  order_date: string
  status: string
  total_amount: number
  items: any[]
  shipping_address: {
    name: string
    address: string
    phone_no: string
  }
  payment_info: {
    subtotal: number
    tax: number
    discount: number
    shipping_cost: number
    grand_total: number
  }
}



export type ContactUsTicket = {
  contactus_id: number;
  first_name: string;
  last_name: string;
  contact_email: string;
  contact_phone_no: string;
  subject: string | null;
  message_body: string;
  attachment: string[];
  priority: string;
  status: string;
  customer_id: number;
  created_at: string; // ISO date string
  issue_type_id: number;
  subissue_id: number;
  admin_read_status: boolean;
  customer_read_status: boolean;
  issue_type: string;
  sub_issue: string;
  created_time: string; // formatted date string
  attachment_data: any[];
};



export type ProductReview2 = {
  review_id: number;
  product_id: number;
  review_author_id: number;
  review_txt: string;
  ratings: number;
  created_at: string; // ISO timestamp as string
  review_title: string;
  review_media_files: string[] | null;
  product_name: string;
  product_thumbnail_image: string | null;
  first_name: string;
  last_name: string;
};


export type Category = {
  category_id: number;
  category_title: string;
};

