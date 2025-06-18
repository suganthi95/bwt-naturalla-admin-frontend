import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { LoaderCircle, RefreshCw } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { addProductPrice } from "@/lib/apis"

const formSchema = z.object({
  unitPrice: z.coerce.number().min(0),
  strikeThroughPrice: z.coerce.number().min(0),
  specialDiscountType: z.string().optional(),
  specialDiscountAmount: z.coerce.number(),
  specialDiscountPercentage: z.coerce.number(),
  discountPeriodStartat: z.string(),
  discountPeriodendat: z.string(),
  minimumStockWarning: z.coerce.number(),
  sku: z.string().min(1),
  stockVisibility: z.string(),
  currentStock: z.coerce.number(),
})

export function ProductPrice() {

  const navigate = useNavigate();
  const { register, setValue, handleSubmit, watch } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitPrice: 0,
      sku: "",
    }
  });

  const { mutate, isPending } = useMutation({
      mutationKey: [ "product-price" ],
      mutationFn: addProductPrice,
      onSuccess: () => {
          navigate("/products/add/product-specs");
          toast.success("Request Success", {
              description: "Product Price & Stocks saved successfully"
          });

      },
      onError: (error: AxiosError<any>) => {
          console.log(error)
          toast.error("Request Failed", {
              description: error?.response?.data?.message
          })
      }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const productId = sessionStorage.getItem("product-id");
    
    if(productId === null){
      toast.success("Request Failed", {
          description: "Add Product Info to create description & specification"
      });
    }else{

      mutate({...data, productId})
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-xl mt-5 shadow-md w-[75%]">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <Label>Unit Price *</Label>
            <Input disabled={isPending} min={1} type="number" {...register("unitPrice")} />
          </div>

          <div>
            <Label>Strike through Price *</Label>
            <Input disabled={isPending} min={1} type="number" {...register("strikeThroughPrice")} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-10">
          <div>
            <Label>Special Discount Type</Label>
            <Select disabled={isPending} onValueChange={(val) => setValue("specialDiscountType", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {watch("specialDiscountType") === "flat" ?
            <div>
              <Label>Special Discount (in Amount)</Label>
              <Input type="number" placeholder="Discount" {...register("specialDiscountAmount")} />
            </div> :

            <div>
              <Label>Special Discount (in Percentage)</Label>
              <Input type="number" placeholder="Discount" {...register("specialDiscountPercentage")} />
            </div>

          }

        </div>

        <div className="grid grid-cols-2 gap-10">
          <div>
            <Label>Special Discount Period Start Date</Label>
            <div className="relative">
              <Input disabled={isPending} type="date" {...register("discountPeriodStartat")} placeholder="YYYY-MM-DD" />
            </div>
          </div>

          <div>
            <Label>Special Discount Period End Date</Label>
            <div className="relative">
              <Input disabled={isPending} type="date" {...register("discountPeriodendat")} placeholder="YYYY-MM-DD" />
            </div>
          </div>

        </div>

        

        

      <div className="pt-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <Label>Minimum Stock Warning</Label>
            <Input disabled={isPending} type="number" {...register("minimumStockWarning")} />
          </div>

          <div>
            <Label>Stock Visibility</Label>
            <Select disabled={isPending} onValueChange={(val) => setValue("stockVisibility", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Hide Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hide">Hide Stock</SelectItem>
                <SelectItem value="show">Show Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Label>SKU *</Label>
            <Input disabled={isPending} {...register("sku")} placeholder="Enter product sku" />
            <RefreshCw className="absolute right-3 top-8 h-5 w-5 text-muted-foreground cursor-pointer" />
          </div>

          <div>
            <Label>Current Stock</Label>
            <Input disabled={isPending} type="number" {...register("currentStock")} placeholder="Enter current available quantity" />
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
