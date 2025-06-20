import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const couponSchema = z.object({
  coupon_name: z.string().min(1, "Coupon name is required"),

  coupon_code: z.string().min(1, "Coupon code is required"),
  coupon_type: z.enum(["product_based", "shipping_based"]),
  discount_type: z.enum(["flat", "percent"]),
  discount: z.number().min(1, "Discount must be greater than 0"),
  start_at: z.string().min(1, "Start date is required"),
  end_at: z.string().min(1, "End date is required"),
  mini_shipping: z.number().min(0, "Minimum shipping is required"),
  max_discount: z.number().min(0, "Max discount is required"),
});

type CouponFormData = z.infer<typeof couponSchema>;
interface Props {
  onClose: (val: boolean) => void;
}
export default function AddCoupon({ onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      coupon_type: "product_based",
      discount_type: "flat",
    },
  });

  const onSubmit = (data: CouponFormData) => {
    console.log("Coupon submitted:", data);
    onClose(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">Coupon Name</Label>
          <Input {...register("coupon_name")} />
          {errors.coupon_name && (
            <p className="text-red-500 text-sm">{errors.coupon_name.message}</p>
          )}
        </div>
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">Coupon Code</Label>
          <Input {...register("coupon_code")} />
          {errors.coupon_code && (
            <p className="text-red-500 text-sm">{errors.coupon_code.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">Coupon Type</Label>
          <Select
            onValueChange={(val) =>
              setValue("coupon_type", val as "product_based" | "shipping_based")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select coupon type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product_based">Product Based</SelectItem>
              <SelectItem value="invoice_based">Shipping Based</SelectItem>
            </SelectContent>
          </Select>
          {errors.coupon_type && (
            <p className="text-red-500 text-sm">{errors.coupon_type.message}</p>
          )}
        </div>
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">Discount Type</Label>
          <Select
            onValueChange={(val) =>
              setValue("discount_type", val as "flat" | "percent")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select discount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flat">Flat</SelectItem>
              <SelectItem value="percent">Percent</SelectItem>
            </SelectContent>
          </Select>
          {errors.discount_type && (
            <p className="text-red-500 text-sm">
              {errors.discount_type.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label className="block text-sm font-semibold text-[#232323] mb-1">Discount Value</Label>
        <Input
          type="number"
          {...register("discount", { valueAsNumber: true })}
        />
        {errors.discount && (
          <p className="text-red-500 text-sm">{errors.discount.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">Start At</Label>
          <Input type="datetime-local" {...register("start_at")} />
          {errors.start_at && (
            <p className="text-red-500 text-sm">{errors.start_at.message}</p>
          )}
        </div>
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">End At</Label>
          <Input type="datetime-local" {...register("end_at")} />
          {errors.end_at && (
            <p className="text-red-500 text-sm">{errors.end_at.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">Minimum Shipping</Label>
          <Input
            type="number"
            {...register("mini_shipping", { valueAsNumber: true })}
          />
          {errors.mini_shipping && (
            <p className="text-red-500 text-sm">
              {errors.mini_shipping.message}
            </p>
          )}
        </div>

        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">Max Discount</Label>
          <Input
            type="number"
            {...register("max_discount", { valueAsNumber: true })}
          />
          {errors.max_discount && (
            <p className="text-red-500 text-sm">
              {errors.max_discount.message}
            </p>
          )}
        </div>
      </div>
<div className="flex items-center gap-x-3 justify-end">
   
      <Button type="submit" className="">
        Add Coupon
      </Button>

</div>
    </form>
  );
}
