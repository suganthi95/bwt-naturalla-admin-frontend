import { Controller, useForm } from "react-hook-form"
import { LoaderCircle } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { ProductPriceFormType } from "@/types"
import { addProductPrice, getProductPrice } from "@/lib/apis"
import { useEffect } from "react"
import dayjs from "dayjs"

// const formSchema = z.object({
//   unitPrice: z.coerce.number().min(0),
//   strikeThroughPrice: z.coerce.number().min(0),
//   specialDiscountType: z.string().optional(),
//   specialDiscountAmount: z.coerce.number(),
//   specialDiscountPercentage: z.coerce.number(),
//   discountPeriodStartat: z.string(),
//   discountPeriodendat: z.string(),
//   minimumStockWarning: z.coerce.number(),
//   sku: z.string().min(1),
//   stockVisibility: z.string(),
//   currentStock: z.coerce.number(),
// })

export function ProductPrice() {

  const navigate = useNavigate();
  const productId = sessionStorage.getItem("product-id") as string;
  const { register, handleSubmit, watch, reset, control, formState: { errors } } = useForm<ProductPriceFormType>({
    defaultValues: {
      sku: "",
      specialDiscountType: "flat"
    }
  });

   const { data: productPriceDefaults } = useQuery({
      queryKey: [ "getProductPrice" ],
      queryFn: () => getProductPrice(productId),
      retry: 3,
      refetchOnWindowFocus: false,
      select: (data):ProductPriceFormType => {

        const { unit_price, strike_through_price, stock_visibility, special_discount_type, special_discount_percent, special_discount_amount, sku, minimum_stock_warning, discount_start_at, discount_end_at, current_stock } = data?.data?.data;
        return {
          unitPrice: unit_price,
          currentStock: current_stock,
          discountPeriodendat: dayjs(discount_end_at).format("YYYY-MM-DD"),
          discountPeriodStartat: dayjs(discount_start_at).format("YYYY-MM-DD"),
          minimumStockWarning: minimum_stock_warning,   
          sku, 
          specialDiscountAmount: special_discount_amount,
          specialDiscountPercentage: special_discount_percent,
          specialDiscountType: special_discount_type, 
          stockVisibility: stock_visibility === "true" ? "show" : "hide", 
          strikeThroughPrice: strike_through_price
        }
      },
      enabled: Boolean(productId)
  });
  
  console.log(productPriceDefaults);

  const { mutate, isPending } = useMutation({
      mutationKey: [ "product-price" ],
      mutationFn: addProductPrice,
      onSuccess: () => {
        toast.success("Request Success", {
            description: "Product Price & Stocks saved successfully"
        });

        if(location.pathname === "/products/add/product-price"){
          navigate("/products/add/product-specs");
        }

      },
      onError: (error: AxiosError<any>) => {
          console.log(error)
          toast.error("Request Failed", {
              description: error?.response?.data?.message
          })
      }
  })

  const onSubmit = (data: ProductPriceFormType) => {
    const productId = sessionStorage.getItem("product-id");
    
    if(productId === null){
      toast.success("Request Failed", {
          description: "Add Product Info to create description & specification"
      });
    }else{

      mutate({...data, productId})
    }
  }


  useEffect(() => {
    if(productPriceDefaults && productId){
        reset(productPriceDefaults);
    }
  }, [ productPriceDefaults, reset, productId ]);


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-xl mt-5 shadow-md w-[75%]">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <Label>Unit Price *</Label>
            <Input 
              disabled={isPending} 
              min={1} 
              type="number" 
              {...register("unitPrice", {
                required: {
                  value: true,
                  message: "Unit Price is required"
                }
              })} 
            />
            {errors?.unitPrice && <p className="text-sm text-red-500 mt-1">{errors?.unitPrice.message}</p>}
          </div>

          <div>
            <Label>Strike through Price *</Label>
            <Input 
              disabled={isPending} 
              min={1} 
              type="number" 
              {...register("strikeThroughPrice", {
                required: {
                  value: true,
                  message: "Strike through Price is required"
                }
              })} 
            />
            {errors?.strikeThroughPrice && <p className="text-sm text-red-500 mt-1">{errors?.strikeThroughPrice.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-10">
          <div>
            <Label>Special Discount Type</Label>

            <Controller
                name="specialDiscountType"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Special Discount type is required"
                  }
                }}
                render={({ field }) => (
                  <Select disabled={isPending} value={field.value} onValueChange={(val) => field.onChange(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="percent">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                )}  
            />
            
          </div>

          {watch("specialDiscountType") === "flat" ?
            <div>
              <Label>Special Discount (in Amount)</Label>
              <Input 
                type="number" 
                placeholder="Discount" 
                {...register("specialDiscountAmount", {
                  required: {
                  value: true,
                  message: "Special discount amount Price is required"
                }
                })} 
              />
              {errors?.specialDiscountAmount && <p className="text-sm text-red-500 mt-1">{errors?.specialDiscountAmount.message}</p>}
            </div> :

            <div>
              <Label>Special Discount (in Percentage)</Label>
              <Input 
                type="number" 
                placeholder="Discount" 
                {...register("specialDiscountPercentage", {
                  required: {
                    value: true,
                    message: "Strike through percentage is required"
                  }
                })} 
              />
              {errors?.specialDiscountPercentage && <p className="text-sm text-red-500 mt-1">{errors?.specialDiscountPercentage.message}</p>}
            </div>

          }

        </div>

        <div className="grid grid-cols-2 gap-10">
          <div>
            <Label>Special Discount Period Start Date</Label>
            <Input 
              disabled={isPending} 
              type="date" 
              placeholder="YYYY-MM-DD" 
              {...register("discountPeriodStartat", {
                required: {
                  value: true,
                  message: "Start at date is required"
                }
              })} 
            />
            {errors?.discountPeriodStartat && <p className="text-sm text-red-500 mt-1">{errors?.discountPeriodStartat.message}</p>}
          </div>

          <div>
            <Label>Special Discount Period End Date</Label>
            <Input 
              disabled={isPending} 
              type="date" 
              placeholder="YYYY-MM-DD" 
              {...register("discountPeriodendat", {
                required: {
                  value: true,
                  message: "End at date is required"
                }
              })} 
            />
            {errors?.discountPeriodendat && <p className="text-sm text-red-500 mt-1">{errors?.discountPeriodendat.message}</p>}

          </div>

        </div>

        

        

      <div className="pt-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <Label>Minimum Stock Warning</Label>
            <Input 
              disabled={isPending} 
              type="number" 
              {...register("minimumStockWarning", {
                required: {
                  value: true,
                  message: "Minimum stock warning is required"
                }
              })} 
            />
            {errors?.minimumStockWarning && <p className="text-sm text-red-500 mt-1">{errors?.minimumStockWarning.message}</p>}
          </div>

          <div>
            <Label>Stock Visibility</Label>
            <Controller
                name="stockVisibility"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Stock Visibility is required"
                  }
                }}
                render={({ field }) => (
                  <Select disabled={isPending} value={field.value} onValueChange={(val) => field.onChange(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Hide Stock" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hide">Hide Stock</SelectItem>
                      <SelectItem value="show">Show Stock</SelectItem>
                    </SelectContent>
                  </Select>
                )}  
            />
          </div>

          {/*<div className="relative">
            <Label>SKU *</Label>
            <Input 
              disabled={isPending} 
              placeholder="Enter product sku" 
              {...register("sku", {
                required: {
                  value: true,
                  message: "SKU is required"
                }
              })} 
            />
            {errors?.sku && <p className="text-sm text-red-500 mt-1">{errors?.sku.message}</p>}
            <RefreshCw className="absolute right-3 top-8 h-5 w-5 text-muted-foreground cursor-pointer" />
          </div>*/}

          <div>
            <Label>Current Stock</Label>
            <Input 
              disabled={isPending} 
              type="number" 
              placeholder="Enter current available quantity" 
              {...register("currentStock", {
                required: {
                  value: true,
                  message: "Current Stock is required"
                }
              })} 
            />
            {errors?.currentStock && <p className="text-sm text-red-500 mt-1">{errors?.currentStock.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-5">
        <Button onClick={() => navigate("/products/add/product-info")} disabled={isPending} type="button" variant="secondary">Back</Button>
        <Button disabled={isPending} type="submit">{isPending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : "Save & Next"}</Button>
      </div>
    </form>
  )
}
