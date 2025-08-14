import { Badge } from "../ui/badge";
import { Mail, Phone } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrderDetails, updateOrderStatus } from "@/lib/apis";
import { Order } from "@/types/type";
import { useAppContext } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface Props {
  Order: Order;
}

export default function OrderDetails({ Order }: Props) {
  const { auth } = useAppContext();
  const [orderStatus, setOrderStatus] = useState("");
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["getorderdetails", String(Order.order_id)],
    queryFn: () => getOrderDetails(auth?.token ?? "", String(Order?.order_id)),
    select: (data) => data?.data,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateOrderStatus"],
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast.success("Request Success", { description: "Order status updated" });
      queryClient.invalidateQueries({ queryKey: ["getAllorders"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error("Request Failed", {
        description: error?.response?.data.messagae,
      });
    },
  });

  const handleChange = (val: string) => {
    setOrderStatus(val);
    mutate({
      id: Order.order_id.toString(),
      status: val,
      token: auth?.token as string,
    });
  };

  useEffect(() => {
    if (data) {
      setOrderStatus(Order.order_status);
    }
  }, [data]);

  return (
    <>
      <div className="p-4 grid grid-cols-2 xl:grid-cols-6">
        <div className=" col-span-4">
          <div className="p-4 space-y-4">
            <h2 className="font-semibold">Products</h2>
            {data?.product?.map((product: any, index: number) => (
              <div
                key={index}
                className="flex gap-4 bg-white border rounded-lg p-4 shadow-sm"
              >
                <img
                  src={product.product_thumbnail_image}
                  alt={product.product_name}
                  className="w-24 h-28 object-cover rounded-md"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-800">
                      {product.product_name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      SKU: {product.sku}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {product.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex  flex-col gap-2 items-center mt-2">
                  <span className="text-base font-semibold text-primary-black">
                    Rs.{product.order_amount}
                  </span>
                  {/* <span className="text-sm text-gray-400 line-through">
                    Rs.{product.oldPrice}
                  </span> */}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 space-y-4">
            <h2 className="font-semibold">Shipment Details</h2>
            <div className="border-2 flex justify-between items-center p-3">
              <p className="font-medium text-sm text-lead">Status</p>
              <Badge className="bg-[#F1E1F9] text-purple-500">
                {data?.shipment[0]?.current_status}
              </Badge>
            </div>
          </div>

          <div className="space-y-4  p-4 text-[15px] font-medium text-title">
            <h3 className="text-lg font-semibold">Payment Summary </h3>

            <div className="flex justify-between">
              <p className="flex flex-col leading-tight">
                <span>Subtotal</span>
                {/* <span className="text-xs">Inclusive of all tax</span> */}
              </p>
              <span className="font-semibold">₹{Order.sub_total}.00</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>- ₹{Order.tax}.00</span>
            </div>
            {Order.coupon_discount && (
              <div className="flex justify-between ">
                <span className="flex flex-col">Coupon</span>
                <span className=" font-semibold ">
                  - ₹{Order.coupon_discount}.00
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="flex flex-col">Shipping Cost</span>
              <span className={`font-semibold gap-x-1.5 flex items-center`}>
                ₹{Order.shipping_fee}.00
              </span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span className="font-semibold text-[#0B130B]">Grand Total</span>
              <span className="text-[#0B130B] font-bold">
                ₹{Order.order_amount}.00
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-4 space-y-4 text-primary-black">
            <h2 className="font-semibold">Customer</h2>

            <div className="border p-2 px-4 flex items-center gap-x-3">
              {Order?.profile_pic ? (
                <img
                  src={
                    Order?.profile_pic ||
                    "https://ik.imagekit.io/nd8r7mpaev/Atlants/user.png?updatedAt=1738227108834"
                  }
                  alt="user"
                  className="size-10 rounded-full"
                />
              ) : (
                <img
                  src="https://ik.imagekit.io/nd8r7mpaev/Atlants/user.png?updatedAt=1738227108834"
                  alt="user"
                  className="size-10 rounded-full"
                />
              )}
              <p className="text-primary-black">
                {Order.shipmet_first_name} {Order.shipment_last_name}
              </p>
            </div>
          </div>

          <div className=" space-y-4 p-4 text-primary-black">
            <h2 className="font-semibold">Contact Info</h2>

            <div className=" p-2 px-4 space-y-2 border ">
              <p className="text-sm flex items-center gap-x-2 text-[#6C7D95]">
                {" "}
                <Mail /> {Order.shipment_email}
              </p>
              {Order.phone_number && (
                <p className="text-sm flex items-center gap-x-2 text-[#6C7D95]">
                  {" "}
                  <Phone /> {Order.phone_number}
                </p>
              )}
            </div>
          </div>

          <div className=" space-y-4 p-4 text-primary-black">
            <h2 className="font-semibold">Shipping Address</h2>

            <div className="border rounded-lg  p-2 px-4 space-y-3.5">
              <div className="flex items-center gap-x-4 justify-between">
                <h2 className="font-semibold">
                  {Order.shipmet_first_name} {Order.shipment_last_name}
                </h2>
              </div>

              <div className="text-textPrimary">
                <p>{Order.address}</p>
                {/* <p>Seetha Nagar</p> */}
                <p>
                  {Order.city}, {Order.state} - {Order.pincode}.
                </p>
              </div>

              <p className="font-medium text-lead text-textPrimary">
                Ph: {Order.shipment_phone_no}
              </p>
            </div>
          </div>

          <div className=" space-y-4 p-4 text-primary-black">
            <h2 className="font-semibold">Billing Address</h2>

            <div className="border rounded-lg  p-2 px-4 space-y-3.5">
              <div className="flex items-center gap-x-4 justify-between">
                <h2 className="font-semibold">
                  {Order.billing_first_name} {Order.billing_last_name}
                </h2>
              </div>

              <div className="text-textPrimary">
                <p>{Order.address}</p>
                {/* <p>Seetha Nagar</p> */}
                <p>
                  {Order.billing_city}, {Order.billing_state} -{" "}
                  {Order.billing_pincode}.
                </p>
              </div>

              <p className="font-medium text-lead text-textPrimary">
                Ph: {Order.billing_phone_no}
              </p>
            </div>

            <div className="space-y-3">
              <label className="font-semibold" htmlFor="">
                Order Status
              </label>
              <Select
                disabled={isPending || orderStatus === "failed"}
                value={orderStatus}
                onValueChange={handleChange}
              >
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Select order status" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "order confirmed",
                    "Ready to Dispatch",
                    "Processing",
                    "Shipped",
                    "Delivered",
                    "Not Delivered",
                    "Cancelled",
                    "failed",
                  ].map((item) => (
                    <SelectItem className="capitalize" value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
