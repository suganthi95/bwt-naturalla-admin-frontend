import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/AuthContext";
import {
  getDashboardCities,
  getDashboardOrders,
  getDashboardProducts,
} from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
import { MapPin, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function OrdersLists() {
  const { auth } = useAppContext();
  const [Isorder, setIsOrder] = useState("7 days");
  const [Isproduct, setIsProduct] = useState("7 days");
  const [Iscities, setIsCities] = useState("7 days");

  const {
    data: OrderLists,
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
  } = useQuery({
    queryKey: ["getdahsboardorders", Isorder],
    queryFn: () => getDashboardOrders(auth?.token ?? "", Isorder),
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data?.data,
    retry: 1,
  });

  const {
    data: ProductLists,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
  } = useQuery({
    queryKey: ["getdahsboardproducts", Isproduct],
    queryFn: () => getDashboardProducts(auth?.token ?? "", Isproduct),
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data?.data,
    retry: 1,
  });

  const {
    data: CitiesLists,
    isLoading: isCitiesLoading,
    isFetching: isCitiesFetching,
  } = useQuery({
    queryKey: ["getdahsboardcities", Iscities],
    queryFn: () => getDashboardCities(auth?.token ?? "", Iscities),
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data?.data,
    retry: 1,
  });

  return (
    <div className=" grid  grid-cols-2 gap-y-6 lg:grid-cols-3 gap-x-3 shadow-sm p-4">
      <div className="bg-white p-4 h-fit rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-800">
            Orders List
          </h2>
          <Select defaultValue={Isorder} onValueChange={(e) => setIsOrder(e)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24 hours">Last 24 hours</SelectItem>
              <SelectItem value="7 days">Last 7 days</SelectItem>
              <SelectItem value="30 days">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4  h-96 overflow-y-auto ">
          {OrderLists?.length === 0 || !OrderLists ? (
            <div className="flex flex-col items-center text-center py-16 opacity-60">
              <img
                src="https://ik.imagekit.io/nd8r7mpaev/Atlants/user.png?updatedAt=1738227108834"
                alt="No orders"
                className="w-14 h-14 mb-4 opacity-60"
              />
              <div className="text-lg font-medium text-gray-800">
                No Orders Yet
              </div>
              <div className="text-sm text-gray-500">
                Orders will appear here once available!
              </div>
            </div>
          ) : (
            OrderLists?.map((client: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition"
              >
                <img
                  src={
                    client?.profile_pic ||
                    "https://ik.imagekit.io/nd8r7mpaev/Atlants/user.png?updatedAt=1738227108834"
                  }
                  alt={client?.first_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {client?.first_name} {client?.last_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {client?.phone_no}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {isOrdersLoading ? (
          <span className="text-sm text-gray-500">Loading...</span>
        ) : isOrdersFetching ? (
          <span className="text-sm text-gray-400 animate-pulse">
            Refreshing...
          </span>
        ) : null}
      </div>

      <div className="bg-white p-4 h-fit rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-800">
            Top Products
          </h2>
          <Select
            defaultValue={Isproduct}
            onValueChange={(e) => setIsProduct(e)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7 days">Last 7 Days</SelectItem>
              <SelectItem value="30 days">This Month</SelectItem>
              <SelectItem value="90 days">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 h-96 overflow-y-auto">
          {ProductLists?.length === 0 || !ProductLists ? (
            <div className="flex flex-col items-center text-center py-16 opacity-60">
              <ShoppingBag className="w-14 h-14 mb-4 text-gray-400" />
              <div className="text-lg font-medium text-gray-800">
                No Products Found
              </div>
              <div className="text-sm text-gray-500">
                No products are currently available. New products will appear
                here soon!
              </div>
            </div>
          ) : (
            ProductLists?.map((product: any, index: number) => (
              <div
                key={index}
                className="flex items-start gap-4 p-2 rounded-lg hover:bg-gray-50 transition"
              >
                <img
                  src={product?.product_thumbnail_image}
                  alt={product?.product_name}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-primary-black">
                    {product?.product_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product?.order_count} items
                  </div>
                </div>
                <div className="flex flex-col items-center justify-between text-sm mt-1 text-gray-600">
                  <span className="text-primary-black font-medium">
                    {product.growth}
                  </span>
                  <span className="font-semibold">{product?.price}</span>
                </div>
              </div>
            ))
          )}
        </div>
        {isProductsLoading ? (
          <span className="text-sm text-gray-500">Loading...</span>
        ) : isProductsFetching ? (
          <span className="text-sm text-gray-400 animate-pulse">
            Refreshing...
          </span>
        ) : null}
      </div>
      <div className="bg-white p-4 h-fit rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-800">Top Cities</h2>
          <Select defaultValue={Iscities} onValueChange={(e) => setIsCities(e)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7 days">Last 7 Days</SelectItem>
              <SelectItem value="30 days">This Month</SelectItem>
              <SelectItem value="90 days">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 h-96 overflow-y-auto">
          {CitiesLists?.length === 0 || !CitiesLists ? (
            <div className="flex flex-col items-center text-center py-16 opacity-60">
              <MapPin className="w-14 h-14 mb-4 text-gray-400" />
              <div className="text-lg font-medium text-gray-800">
                No Cities Listed
              </div>
              <div className="text-sm text-gray-500">
                Cities with orders will appear here once available!
              </div>
            </div>
          ) : (
            CitiesLists?.map((city: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center px-2 py-2  rounded-lg hover:bg-gray-50 transition"
              >
                <span className="text-gray-800 text-sm font-medium">
                  {city?.city}
                </span>
                <span className="text-sm text-gray-600 font-semibold">
                  {city?.order_count}
                </span>
              </div>
            ))
          )}
        </div>
        {isCitiesLoading ? (
          <span className="text-sm text-gray-500">Loading...</span>
        ) : isCitiesFetching ? (
          <span className="text-sm text-gray-400 animate-pulse">
            Refreshing...
          </span>
        ) : null}
      </div>
    </div>
  );
}
