export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phone_no: number;
  new_password ? :string
}

export type User = {
  user_id: number;
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
