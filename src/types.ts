
export type ProductsType = {
    product_id: number
    admin_id: any
    product_name: string
    category_id: number
    brand: any
    tags: any
    slug: string
    barcode: any
    units: any
    min_order_quantity: number
    unit_price: number
    created_at: string
    is_discounted: boolean
    short_description: string
    long_description: string
    benefits: string
    how_to_use: string
    ingredients: string
    product_specification_pdf: any
    is_featured: boolean
    isin_todays_deal: boolean
    created_by: any
    discount_type: string
    start_at: any
    end_at: any
    vat_tax: any
    meta_title: any
    meta_description: any
    meta_keywords: any
    meta_image_url: any
    cash_on_delivery: boolean
    shipping_days: any
    best_selling: boolean
    offer_ending_soon: boolean
    description_images: number[]
    thumbnail_image: number
    discount_amount: any
    discount_percent: number
    discounted_price: any
    gallery_images: number[]
    product_videos: any
    strike_through_price: number
    product_size: string
    coupon_id: number
    benefit_keys: any
    publish: boolean
}

export type ProductFormValues = {
    shortDescription: string;
    longDescription: string;
    benefits: string;
    howToUse: string;
    ingredients: string;
    specificationPDF: any;
    isFeatured: boolean;
    todayDeal: boolean;
    offerEndingSoon: boolean;
    bestSelling: boolean;
    benefitKeywords: string[];
    length: number;
    weight: number;
    height: number;
    breadth: number;
    productId: string | null | File
};

export type ProductSEOFormValues = {
  metaTitle: string;
  metaDescription: string;
  metaImageUrl: string;
  metaKeyword: string[];
  metaImage: any;
};

export type AuthType = {
  token: string,
  firstname: string,
  lastname: string,
  email: string,
  role: "admin"
}

export type ProductPriceFormType = {
  unitPrice: number;
  strikeThroughPrice: number;
  specialDiscountType: "flat" | "percent";
  specialDiscountAmount: number | null;
  specialDiscountPercentage: number | null;
  discountPeriodStartat: string | null;
  discountPeriodendat: string | null;
  minimumStockWarning: number;
  sku: string;
  stockVisibility: string;
  currentStock: number;
};
export type ProductIcon = {
  icon_id: number;
  icon_url: string;
  icon_name: string;
  icon_text: string;
  prod_icon_id: number;
};
export type ProductInfoFormType = {
  category_id:number
  productName: string;
  category: string;
  subCategory: string;
  unit: string;
  minOrderQty: number;
  tags: string[];
  slug: string;
  hsn_code:string
  icon_data:ProductIcon[]
  product_effects ?:any | null;
  galleryImages: any;
  thumbnail: FileList | null;
};

export interface ShipmentDetailsType {
  status: boolean
  shipment: {
    shipment_id: string
    awb_code: string
    courier_name: string
    pickup_scheduled_date: string
    estimated_delivery_date: string
    delivered_date: any
    delivered_to: string
    origin: string
    destination: string
    tracking_link: string
    current_status: string
    shipping_label: string
    manifest: string
  }
  package: {
    product_id: number
    product_name: string
    length: any
    breadth: any  
    height: any
    weight: any
  }[]
  tracking_timeline: any[]
}

export type OrderTimeline = {
  order_history_id: number;
  order_id: number;
  status: string;
  order_code: string;
  updated_time: string;
  shipment_status: string;
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
  payment_method: string;
  phone_number: string | null;
  payment_status: string;
  delivery_status: string;
  shipping_type_id: number | null;
  sub_total: number;
  discount_amount: number | null;
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
  billing_first_name: string;
  billing_last_name: string;
  billing_email: string;
  billing_phone_no: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_pincode: string;
  source: string;
  updated_at: string | null;
  updated_by: string | null;
  bag_discount: number;
  total_mrp: number;
};
