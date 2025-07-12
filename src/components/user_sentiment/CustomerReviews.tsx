  import { CheckCircle2, Search } from "lucide-react";
  import { Badge } from "../ui/badge";
  import { Input } from "../ui/input";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../ui/select";

  import { ReviewListSkeleton } from "@/common/ReviewListSkeleton";
  import { ProductReview2 } from "@/types/type";
  import dayjs from "dayjs";
  ;

  export interface Props {
    Reviews:ProductReview2[]
    searchTerm:string;
    selectedTime:string;
    selectedProducts:string;
    selectedRatings:string;
    selectedDate:string;
    isLoading:boolean;
    isFetching:boolean;
    setSearchTerm?: (val: string) => void;
    setProducts?: (val: string) => void;
    setTime?: (val: string) => void;
    setRatings?: (val: string) => void;
    setDate?: (val: string) => void;
  }

  export default function CustomerReviews({ Reviews,searchTerm,selectedDate,selectedRatings,selectedTime,selectedProducts,setDate,setProducts,setRatings,setSearchTerm,setTime ,isLoading,isFetching}: Props) {
  
  

    return (
      <div className="p-4 bg-white rounded-md shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[22px]">User Feedback</h2>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(event) => setSearchTerm?.(event.target.value)}
                className="pl-10 pr-4 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <Select value={selectedTime} onValueChange={(val) => setTime?.(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alltime">All Time</SelectItem>

                <SelectItem value="last7">This Week</SelectItem>
                <SelectItem value="last30">This Month </SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

<Select value={selectedProducts} onValueChange={(val) => setProducts?.(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="shampoo">Shampoo</SelectItem>
                <SelectItem value="soap">Soap</SelectItem>
                <SelectItem value="cream">Cream</SelectItem>
              </SelectContent>
            </Select>

<Select value={selectedRatings} onValueChange={(val) => setRatings?.(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars & Up</SelectItem>
                <SelectItem value="3">3 Stars & Up</SelectItem>
                <SelectItem value="all">All Ratings</SelectItem>
              </SelectContent>
            </Select>

<Select value={selectedDate} onValueChange={(val) => setDate?.(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Newest First</SelectItem>
                <SelectItem value="old">Oldest First</SelectItem>
                <SelectItem value="high-rating">Highest Ratings</SelectItem>
                <SelectItem value="low-rating">Lowest Ratings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isFetching || isLoading ? (
            <ReviewListSkeleton />
          ) : (
            <ul className="pt-4 space-y-6">
              {Reviews?.map((review:ProductReview2, index:number) => (
                <li
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex gap-x-4">
                    {review?.product_thumbnail_image &&
                    <img
                      src={review.product_thumbnail_image ?? ""}
                      alt={review.product_name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
  }
                    <div className="w-full">
                      <div className="flex justify-between items-center ">
                        <h3 className="text-base font-semibold text-primary-black">
                          {review.product_name}
                        </h3>
                        <p className="text-sm text-[#6B7280]">{dayjs(review.created_at).format('MMM-DD-YYYY')}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            fill={star <= review.ratings ? "#facc15" : "none"}
                            viewBox="0 0 24 24"
                            stroke="#facc15"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M11.48 3.499a.75.75 0 011.04 0l2.647 2.687 3.427.427a.75.75 0 01.412 1.293l-2.493 2.537.656 3.774a.75.75 0 01-1.08.789L12 13.347l-3.088 1.659a.75.75 0 01-1.08-.79l.655-3.773-2.492-2.537a.75.75 0 01.412-1.293l3.427-.427L11.48 3.5z"
                            />
                          </svg>
                        ))}
                        <span className="text-sm text-gray-600">
                          {review.ratings} stars
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-semibold">{review.review_title}</p>

                      <p className="mt-1 text-sm text-gray-600">
                        {review.review_txt}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-green-100 text-[#166A51] text-xs font-medium  py-1 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="  fill-[#166A51]   text-white" />
                          Verified Purchase
                        </Badge>
                        <span className="text-sm text-muted-foreground ml-2">
                          by {review.first_name}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
