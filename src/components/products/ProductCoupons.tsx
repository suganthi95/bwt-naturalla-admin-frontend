
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "../ui/label"

const coupons = [
  { label: "Coupon 1", value: "en" },
  { label: "Coupon 2", value: "fr" },
  { label: "Coupon 3", value: "de" },
  { label: "Coupon 4", value: "es" },
  { label: "Coupon 5", value: "pt" },
  { label: "Coupon 6", value: "ru" },
  { label: "Coupon 7", value: "ja" },
  { label: "Coupon 8", value: "ko" },
  { label: "Coupon 9", value: "zh" },
] as const

const FormSchema = z.object({
  coupon: z.string({
    required_error: "Please select a coupon.",
  }),
})

export function ProductCoupons() {

    const { watch, setValue, handleSubmit } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast("You submitted the following values", {
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-xl mt-5 shadow-md w-[75%]">

            <div className="grid grid-cols-1 gap-1">
                <Label>Select Coupon</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="default"
                            role="combobox"
                            className={cn(
                                "w-1/2 justify-between bg-white text-black border hover:bg-slate-100",
                                !watch("coupon") && "text-muted-foreground"
                            )}
                        >
                            {watch("coupon")
                                ? coupons.find(
                                    (coupon) => coupon.value === watch("coupon")
                                )?.label
                                : "Select coupon"}
                        <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[500px]">
                        <Command>
                            <CommandInput
                                placeholder="Search coupon..."
                                className="h-9"
                            />
                            <CommandList>
                            <CommandEmpty>No coupon found.</CommandEmpty>
                            <CommandGroup>
                                {coupons.map((coupon) => (
                                    <CommandItem
                                        value={coupon.label}
                                        key={coupon.value}
                                        onSelect={() => {
                                            setValue("coupon", coupon.value)
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
            </div>
            <div className="flex items-center justify-end gap-5 mt-6">
                <Button type="button" variant="secondary">Back</Button>
                <Button type="submit">Submit</Button>
            </div>
        </form>
    )
}
