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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CouponInput } from "@/types/type";
import { addConfigureCoupons } from "@/lib/apis";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";

const couponSchema = z
  .object({
    coupon_name: z.string().min(1, "Coupon name is required"),
    coupon_code: z.string().min(1, "Coupon code is required"),
    discount_type: z.enum(["flat", "percent"]),
    discount: z
      .number({ invalid_type_error: "Discount is required" })
      .min(1, "Discount must be greater than 0"),
    start_at: z.string().min(1, "Start date is required"),
    end_at: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      const now = new Date();
      const start = new Date(data.start_at);
      return start >= new Date(now.toDateString()); 
    },
    {
      message: "Start date cannot be in the past",
      path: ["start_at"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.start_at);
      const end = new Date(data.end_at);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["end_at"],
    }
  );


type CouponFormData = z.infer<typeof couponSchema>;
interface Props {
  onClose: (val: boolean) => void;
}
export default function AddCoupon({ onClose }: Props) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["addcoupon"],
    mutationFn: (payload: CouponInput) => addConfigureCoupons(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couponlists"] });
      onClose(false);
      toast.success("coupon created successfully");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      discount_type: "flat",
    },
  });

  const onSubmit = (data: CouponFormData) => {
    mutate({
      coupon_code: data.coupon_code,
      coupon_name: data.coupon_name,
      end_at: data.end_at,
      start_at: data.start_at,
      discount: data.discount,
      discount_type: data.discount_type,
    });
  };
  const startAt = watch("start_at");
  const getMinEndDateTime = () => {
    const now = new Date();

    if (startAt) {
      const start = new Date(startAt);
      return new Date(start.getTime() + 60 * 1000).toISOString().slice(0, 16); // +1 minute buffer
    }

    return now.toISOString().slice(0, 16);
  };

  const now = new Date().toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">
            Coupon Name
          </Label>
          <Input {...register("coupon_name")} />
          {errors.coupon_name && (
            <p className="text-red-500 text-sm">{errors.coupon_name.message}</p>
          )}
        </div>
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">
            Coupon Code
          </Label>
          <Input {...register("coupon_code")} />
          {errors.coupon_code && (
            <p className="text-red-500 text-sm">{errors.coupon_code.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">
            Discount Type
          </Label>
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
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">
            Discount Value
          </Label>
          <Input
            type="number"
            {...register("discount", { valueAsNumber: true })}
          />
          {errors.discount && (
            <p className="text-red-500 text-sm">{errors.discount.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">
            Start At
          </Label>
          <Input min={now} type="datetime-local" {...register("start_at")} />
          {errors.start_at && (
            <p className="text-red-500 text-sm">{errors.start_at.message}</p>
          )}
        </div>
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">
            End At
          </Label>
          <Input
            min={getMinEndDateTime()}
            type="datetime-local"
            {...register("end_at")}
          />
          {errors.end_at && (
            <p className="text-red-500 text-sm">{errors.end_at.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-x-3 justify-end">
        <Button type="submit" className="">
          {isPending ? <Loader2 className="animate-spin" /> : "Add Coupon"}
        </Button>
      </div>
    </form>
  );
}
