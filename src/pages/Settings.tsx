import Banners from "@/components/settings/Banners";
import PromotionalOffer from "@/components/settings/PromotionalOffer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AuthContext";
import { getShippingfee, updateShippingfee } from "@/lib/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const { auth } = useAppContext();
  const { data } = useQuery({
    queryKey: ["getshipping"],
    queryFn: () => getShippingfee(auth?.token ?? ""),
    select: (data) => data?.data?.data,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const shipping = data?.[0];

  // refs to read user input
  const shippingFeeRef = useRef<HTMLInputElement>(null);
  const min_amountRef = useRef<HTMLInputElement>(null);

  const [shippingType, setShippingType] = useState<string>(
    shipping?.shipping_fee_type || "flat"
  );

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateshippingfee"],
    mutationFn: ({
      shipping_type_id,
      min_amount,
      shipping_fee,
      shipping_fee_type,
      token,
    }: {
      shipping_type_id: number;
      min_amount: number;
      shipping_fee: number;
      shipping_fee_type: string;
      token: string;
    }) =>
      updateShippingfee(
        shipping_type_id,
        min_amount,
        shipping_fee,
        shipping_fee_type,
        token
      ),
    onSuccess: () => toast.success("Shipping settings updated successfully"),
    onError: () => toast.error("Failed to update shipping"),
  });

  const handleSave = () => {
    if (
      !shipping?.shipping_type_id ||
      !shippingFeeRef.current ||
      !min_amountRef.current
    )
      return;

    const shipping_fee = Number(shippingFeeRef.current.value);
    if (isNaN(shipping_fee)) {
      toast.error("Invalid shipping fee amount");
      return;
    }
    const min_amount = Number(min_amountRef.current.value);
    if (isNaN(min_amount)) {
      toast.error("Invalid min  amount");
      return;
    }

    mutate({
      shipping_type_id: shipping.shipping_type_id,
      min_amount: min_amount,
      shipping_fee,
      shipping_fee_type: shippingType,
      token: auth?.token ?? "",
    });
  };

  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-[15px] text-[#4B5563]">
          Configure shipping rates, banners, and FAQs for your store
        </p>
      </div>

      <Tabs defaultValue="shipping">
        <TabsList className="bg-[#ECF0F4] w-full ">
          <TabsTrigger
            value="shipping"
            className="w-full rounded-md data-[state=active]:text-primary-black font-semibold "
          >
            Shipping
          </TabsTrigger>
          <TabsTrigger
            value="banner"
            className="w-full rounded-md data-[state=active]:text-primary-black font-semibold "
          >
            Banners
          </TabsTrigger>
            <TabsTrigger
            value="promotion"
            className="w-full rounded-md data-[state=active]:text-primary-black font-semibold "
          >
            Promotional Offers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="shipping">
          <div className="bg-white rounded-xl space-y-3 p-4 col-span-2">
            <h2 className="text-primary-black font-semibold">
              Shipping Method
            </h2>
            <RadioGroup
              defaultValue={shipping?.shipping_fee_type}
              className="space-y-2 mt-4"
              onValueChange={setShippingType}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={shipping?.shipping_fee_type} id="flat" />
                <Label htmlFor="flat" className="font-medium text-[15px]">
                  Flat Rate Shipping
                </Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-primary-black font-semibold mb-2">
                Flat Rate Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  INR
                </span>
                <input
                  type="number"
                  ref={shippingFeeRef}
                  defaultValue={shipping?.shipping_fee ?? ""}
                  placeholder="0.00"
                  className="pl-12 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#1E401D]"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                This flat rate will be applied to all orders regardless of
                weight, size, or destination.
              </p>
            </div>
            <div>
              <Label className="text-sm text-primary-black font-semibold mb-2">
                Free Shipping Threshold
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  INR
                </span>
                <input
                  type="number"
                  ref={min_amountRef}
                  defaultValue={shipping?.min_amount ?? ""}
                  placeholder="0.00"
                  className="pl-12 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#1E401D]"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Orders above this amount will qualify for free shipping. Leave
                blank to disable.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? "Saving..." : "Save Configuration"}
              </Button>
              <p className="text-sm text-[#6B7280]">
                 Last updated: {shipping?.updated_at}
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="banner">
          <Banners />
        </TabsContent>
        <TabsContent value="promotion">
            <PromotionalOffer/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
