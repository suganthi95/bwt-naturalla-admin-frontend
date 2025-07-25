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
import { Coupon, CouponInput } from "@/types/type";
import { updateConfigureCoupons } from "@/lib/apis";
import { toast } from "sonner";
import axios from "axios";
import { Info, Loader2 } from "lucide-react";
import { useAppContext } from "@/contexts/AuthContext";

const couponSchema = z.object({
  coupon_name: z.string().min(1, "Coupon name is required"),

  coupon_code: z.string().min(1, "Coupon code is required"),
  discount_type: z.string().min(1, "Discount type is required"), // Removed enum
  status: z.string().min(1, "Status is required"),
  discount: z.number().min(1, "Discount must be greater than 0"),
  start_at: z.string().min(1, "Start date is required"),
  end_at: z.string().min(1, "End date is required"),
});

type CouponFormData = z.infer<typeof couponSchema>;
interface Props {
  onClose: (val: boolean) => void;
  CouponDetails: Coupon;
}
export default function UpdateCoupon({ onClose, CouponDetails }: Props) {
  const { auth } = useAppContext();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["updatecoupon"],
    mutationFn: ({
      token,
      payload,
      coupon_id,
    }: {
      token: string;
      payload: CouponInput;
      coupon_id: number;
    }) => updateConfigureCoupons(token, payload, coupon_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couponlists"] });
      onClose(false);
      toast.success("Coupon updated successfully");
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
    formState: { errors },
    setValue,
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      coupon_name: CouponDetails?.coupon_name || "",
      coupon_code: CouponDetails?.coupon_code || "",
      discount_type: CouponDetails?.discount_type || "flat",
      status: CouponDetails?.status || "active",
      discount: CouponDetails?.discount || 0,
      start_at: CouponDetails?.start_at?.slice(0, 16) || "",
      end_at: CouponDetails?.end_at?.slice(0, 16) || "",
    },
  });

  const onSubmit = (data: CouponFormData) => {
    mutate({
      token: auth?.token ?? "",
      payload: {
        coupon_code: data.coupon_code,
        coupon_name: data.coupon_name,
        end_at: data.end_at,
        start_at: data.start_at,
        discount: data.discount,
        discount_type: data.discount_type,
        status: data.status,
      },
      coupon_id: CouponDetails.coupon_id,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4 p-4">
      {/* <span className="text-xs text-muted-foreground">
        This coupon has expired and is automatically set to{" "}
        <span className="font-medium text-red-500">Inactive</span>. To
        reactivate, update the <span className="font-medium">Start Date</span>,{" "}
        <span className="font-medium">End Date</span>, and set the{" "}
        <span className="font-medium text-green-600">Status</span> to Active.
      </span> */}

      <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-1">
        <Info className="w-4 h-4 mt-0.5 text-blue-500" />
        <span>
          This coupon has expired and is automatically set to
          <span className="text-red-500 font-medium"> Inactive</span>. To
          reactivate, update the <span className="font-medium">Start Date</span>
          ,<span className="font-medium"> End Date</span>, and set the
          <span className="text-green-600 font-medium"> Status</span> to Active.
        </span>
      </div>

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
      <div>
        <Label className="block text-sm font-semibold text-[#232323] mb-1">
          Status
        </Label>
        <Select
          onValueChange={(val) =>
            setValue("status", val as "active" | "inactive")
          }
          defaultValue={CouponDetails?.status}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-red-500 text-sm">{errors.status.message}</p>
        )}
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
          <Input type="datetime-local" {...register("start_at")} />
          {errors.start_at && (
            <p className="text-red-500 text-sm">{errors.start_at.message}</p>
          )}
        </div>
        <div>
          <Label className="block text-sm font-semibold text-[#232323] mb-1">
            End At
          </Label>
          <Input type="datetime-local" {...register("end_at")} />
          {errors.end_at && (
            <p className="text-red-500 text-sm">{errors.end_at.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-x-3 justify-end">
        <Button type="submit" className="">
          {isPending ? <Loader2 className="animate-spin" /> : "Update Coupon"}
        </Button>
      </div>
    </form>
  );
}
