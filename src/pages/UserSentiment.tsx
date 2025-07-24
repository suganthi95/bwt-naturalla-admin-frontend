import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerReviews from "@/components/user_sentiment/CustomerReviews";
import CustomerSupport from "@/components/user_sentiment/CustomerSupport";
import { useAppContext } from "@/contexts/AuthContext";
import { getCustomerReviews } from "@/lib/apis";
import { ProductReview2 } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function UserSentiment() {
  const { auth } = useAppContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProducts, setProducts] = useState<string>("");
  const [selectedTime, setTime] = useState<string>("");
  const [selectedRatings, setRatings] = useState<string>("");
  const [selectedDate, setDate] = useState<string>("");
  const {
    data: Reviews,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "customerReviews",
      selectedDate,
      selectedProducts,
      selectedRatings,
      selectedTime,
    ],
    queryFn: () =>
      getCustomerReviews({
        token: auth?.token ?? "",
        category_id: selectedProducts,
        sort: selectedDate,
        selectby_time: selectedTime,
        ratings: selectedRatings,
      }),
    retry: 1,
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data,
  });

  const [filteredData, setFilteredData] = useState<ProductReview2[]>(
    Reviews?.data ?? []
  );
  useEffect(() => {
    if (!Reviews) return;

    const filtered = Reviews?.data?.filter((item: ProductReview2) =>
      item?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filtered);
  }, [Reviews, searchTerm]);

  return (
    <div className="flex flex-col overflow-hidden p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div>
        <h1 className="text-xl font-semibold">User Sentiment</h1>
        <p className="text-xs text-slate-400">Manage all user interactions</p>
      </div>

      <div>
        <Tabs defaultValue="support" className="w-full">
          <div className="flex border-b-2  pb-1 items-center justify-between flex-wrap gap-2 mb-4">
            <TabsList className="flex translate-y-1.5 gap-2 bg-transparent p-0">
              <TabsTrigger
                value={"support"}
                className=" px-4 py-2 text-sm font-medium  transition-colors duration-200 ease-in-out  bg-transparen data-[state=active]:shadow-none   data-[state=active]:border-b-2 border-b-secondary-green   data-[state=active]:bg-transparent data-[state=active]:text-secondary-green"
              >
                Customer Support
              </TabsTrigger>

              <TabsTrigger
                value="reviews"
                className="group flex items-center gap-x-2 px-4 py-2 text-sm font-medium  transition-colors duration-200 ease-in-out  bg-transparen data-[state=active]:shadow-none   data-[state=active]:border-b-2 border-b-secondary-green   data-[state=active]:bg-transparent data-[state=active]:text-secondary-green"
              >
                Customer Reviews
                <Badge className="bg-gray-200 text-black group-data-[state=active]:bg-secondary-green group-data-[state=active]:text-white">
                  {Reviews?.data?.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="support">
            <CustomerSupport />
          </TabsContent>
          <TabsContent value="reviews">
            <CustomerReviews
              Category={Reviews?.category}
              Reviews={filteredData}
              isFetching={isFetching}
              isLoading={isLoading}
              searchTerm={searchTerm}
              selectedDate={selectedDate}
              selectedRatings={selectedRatings}
              selectedTime={selectedTime}
              setDate={setDate}
              setProducts={setProducts}
              setRatings={setRatings}
              setSearchTerm={setSearchTerm}
              setTime={setTime}
              selectedProducts={selectedProducts}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
