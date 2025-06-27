import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addCoupons, getCoupons, getProductCoupons } from "@/lib/apis";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppContext } from "@/contexts/AuthContext";

const FormSchema = z.object({
  coupon: z.number({
    required_error: "Please select a coupon.",
  }),
});

export function ProductCoupons() {
  const { auth } = useAppContext();
  const navigate = useNavigate();
  const productId = sessionStorage.getItem("product-id") as string;

  const {
    data: coupons,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["getCoupons"],
    queryFn: () => getCoupons(auth?.token ?? ""),
    refetchOnWindowFocus: false,
    retry: 3,
    select: (data) =>
      data?.data?.data.map((item: any) => ({
        label: item.coupon_code,
        value: item.coupon_id,
        name: item.coupon_name,
      })),
  });

  const { data: productCouponDefaults } = useQuery({
    queryKey: ["getProductCoupons"],
    queryFn: () => getProductCoupons(auth?.token ?? "", productId),
    retry: 3,
    refetchOnWindowFocus: false,
    select: (data) => {
      const { coupon_id } = data?.data?.data;
      return {
        coupon: coupon_id,
      };
    },
    enabled: Boolean(productId) && isSuccess,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["addCoupon"],
    mutationFn: ({
      token,
      data,
    }: {
      token: string;
      data: {
        coupon: number;
        productId: string;
      };
    }) => addCoupons(token, data),
  });

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const productId = sessionStorage.getItem("product-id");

    if (productId === null) {
      toast.success("Request Failed", {
        description: "Add Product Info to submit coupons & discounts",
      });
    } else {
      mutate({
        token: auth?.token ?? "",
        data: {
          coupon: data.coupon,
          productId: productId,
        },
      });
    }
  }

  useEffect(() => {
    if (productCouponDefaults && productId) {
      reset(productCouponDefaults);
    }
  }, [productCouponDefaults, reset, productId]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white rounded-xl mt-5 shadow-md w-[75%]"
    >
      <div className="grid grid-cols-1 gap-1">
        <Label>Select Coupon</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              disabled={isLoading || isError || isPending}
              variant="default"
              role="combobox"
              className={cn(
                "w-1/2 justify-between bg-white text-black border hover:bg-slate-100",
                !watch("coupon") && "text-muted-foreground"
              )}
            >
              {watch("coupon")
                ? coupons?.find(
                    (coupon: any) => coupon.value === watch("coupon")
                  )?.label
                : "Select coupon"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[500px]">
            <Command>
              <CommandInput placeholder="Search coupon..." className="h-9" />
              <CommandList>
                <CommandEmpty>No coupon found.</CommandEmpty>
                <CommandGroup>
                  {coupons?.map((coupon: any) => (
                    <CommandItem
                      value={coupon.label}
                      key={coupon.value}
                      onSelect={() => {
                        setValue("coupon", coupon.value);
                      }}
                    >
                      {coupon.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          coupon.value === watch("coupon")
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors?.coupon?.message && (
          <p className="text-red-500 text-sm">{errors?.coupon?.message}</p>
        )}
      </div>
      <div className="flex items-center justify-end gap-5 mt-6">
        <Button
          onClick={() => navigate("/products/add/product-specs")}
          disabled={isPending}
          type="button"
          variant="secondary"
        >
          Back
        </Button>
        <Button disabled={isPending} type="submit">
          {isPending ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}
