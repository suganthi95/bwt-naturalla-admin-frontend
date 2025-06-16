
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
    specificationPDF: FileList;
    isFeatured: boolean;
    todayDeal: boolean;
    offerEndingSoon: boolean;
    bestSelling: boolean;
    benefitKeywords: string;
    length: number;
    weight: number;
    height: number;
    breadth: number;
};

export type ProductSEOFormValues = {
  metaTitle: string;
  metaDescription: string;
  metaImageUrl: string;
};
