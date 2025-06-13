import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarDays, RefreshCw } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"

const formSchema = z.object({
  unitPrice: z.coerce.number().min(0),
  specialDiscountType: z.string().optional(),
  specialDiscount: z.coerce.number().optional(),
  vatTax: z.string().optional(),
  discountPeriod: z.string().optional(),
  minimumStockWarning: z.coerce.number().optional(),
  sku: z.string().min(1),
  stockVisibility: z.string().optional(),
  currentStock: z.coerce.number().optional(),
  hasVariant: z.boolean().optional()
})

export function ProductPrice() {
  const {
    register,
    setValue,
    handleSubmit,
    watch
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitPrice: 0,
      sku: "",
      hasVariant: false
    }
  })

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-xl mt-5 shadow-md w-[75%]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Unit Price *</Label>
          <Input type="number" {...register("unitPrice")} />
        </div>

        <div>
          <Label>Special Discount</Label>
          <Input type="number" placeholder="Discount" {...register("specialDiscount")} />
        </div>

        <div>
          <Label>Special Discount Type</Label>
          <Select onValueChange={(val) => setValue("specialDiscountType", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Flat">Flat</SelectItem>
              <SelectItem value="Percentage">Percentage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>VAT & TAX</Label>
          <Select onValueChange={(val) => setValue("vatTax", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0%">0%</SelectItem>
              <SelectItem value="5%">5%</SelectItem>
              <SelectItem value="18%">18%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Special Discount Period</Label>
          <div className="relative">
            <Input {...register("discountPeriod")} placeholder="YYYY-MM-DD" />
            <CalendarDays className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6 md:mt-auto">
          <Switch
            checked={watch("hasVariant")}
            onCheckedChange={(val) => setValue("hasVariant", val)}
          />
          <Label className="text-sm">Has Variant</Label>
        </div>
      </div>

      <div className="pt-4 border-t border-muted">
        <h3 className="font-semibold mb-4">Product Stock</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Minimum Stock Warning</Label>
            <Input type="number" {...register("minimumStockWarning")} />
          </div>

          <div>
            <Label>Stock Visibility</Label>
            <Select onValueChange={(val) => setValue("stockVisibility", val)}>
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
            <Input {...register("sku")} placeholder="Enter product sku" />
            <RefreshCw className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground cursor-pointer" />
          </div>

          <div>
            <Label>Current Stock</Label>
            <Input type="number" {...register("currentStock")} placeholder="Enter current available quantity" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-5 mt-6">
        <Button type="button" variant="secondary">Back</Button>
        <Button type="submit">Save & Next</Button>
      </div>
    </form>
  )
}
