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

