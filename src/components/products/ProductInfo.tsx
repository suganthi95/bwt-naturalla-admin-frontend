import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { CloudUpload } from "lucide-react"

const formSchema = z.object({
  productName: z.string().min(1),
  category: z.string().min(1),
  brand: z.string().min(1),
  unit: z.string(),
  minOrderQty: z.coerce.number().min(1),
  tags: z.array(z.string()).optional(),
  slug: z.string().optional(),
  galleryImages: z.any(),
  thumbnail: z.any()
})

type FormType = z.infer<typeof formSchema>


export function ProductInfo() {
  const [tags, setTags] = useState(["Face Wash"])
  const [tagInput, setTagInput] = useState("")

  const { register, handleSubmit, setValue, watch } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      category: "",
      brand: "",
      unit: "",
      minOrderQty: 1,
      slug: "",
      galleryImages: [],
      thumbnail: null
    }
  })

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const onSubmit = (data: any) => {
    data.tags = tags
    console.log(data)
  }

  useEffect(() => {
    watch((data) => {
        console.log(data)
    })
  }, [watch])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-xl mt-5 shadow-md w-[75%]">

        <div>
            <div>
                <Label>Product Name *</Label>
                <Input {...register("productName")} />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
                <Label>Category *</Label>
                <Select onValueChange={(val) => setValue("category", val)}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Skincare">Skincare</SelectItem>
                    <SelectItem value="Haircare">Haircare</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Brand *</Label>
                <Select onValueChange={(val) => setValue("brand", val)}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Brand A">Brand A</SelectItem>
                    <SelectItem value="Brand B">Brand B</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Unit</Label>
                <Input placeholder="Unit (eg kg, pc etc)" {...register("unit")} />
            </div>

            <div>
                <Label>Min Order Quantity *</Label>
                <Input type="number" {...register("minOrderQty")} />
            </div>

        </div>

        <div>
            <Label>Tags</Label>
            <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyPress}
                placeholder="Write & enter"
            />

            <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{tag}</span>
                ))}
            </div>
        </div>

        <div>
            <Label>Slug</Label>
            <Input {...register("slug")} placeholder="Product Slug" />
        </div>

        <div>
            <Label>Upload Product Image *</Label>
            <p className="text-sm text-muted-foreground mb-2">
                You need to add at least 4 images. Pay attention to the quality of the pictures you add, comply with the background color standards. Pictures must be in certain dimensions. Notice that the product shows all the details.
            </p>

            <div className="grid grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4].map((_, i) => (

                <Label htmlFor={`galleryImages.${i}`} className="flex flex-col gap-2 items-center justify-center border-dashed border-[2px] border-slate-400 rounded-lg p-6 my-4 w-[150px] h-[150px] cursor-pointer">
                    <CloudUpload className="h-5 w-5" />
                    <p className="text-xs text-center text-slate-400">Drop your images here or <span className="text-xs text-center text-primary-blue">Select click to browse</span></p>
                    <Input id={`galleryImages.${i}`} className="hidden" type="file" accept="image/*" {...register(`galleryImages.${i}`)} />
                </Label>
            ))}
            </div>
        </div>

        <div>
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <Label htmlFor="thumbnail" className="flex flex-col gap-2 items-center justify-center border-dashed border-[2px] border-slate-400 rounded-lg p-6 my-4 w-[250px] h-[250px] cursor-pointer">
                <CloudUpload />
                <p className="text-sm text-center text-slate-400">Drop your images here</p>
                <div className="flex gap-2 items-center w-[35%]">
                    <span className="bg-[#E7E7E7] h-[1px] w-full"></span>
                    <p className="text-xs text-[#6D6D6D]">OR</p>
                    <span className="bg-[#E7E7E7] h-[1px] w-full"></span>
                </div>
                <p className="text-sm text-center text-primary-blue">Select click to browse</p>
                <Input id="thumbnail" className="hidden" type="file" accept="image/*" {...register("thumbnail")} />
            </Label>

        </div>


        <div className="flex justify-end items-center gap-5 mt-4">
            <Button type="button" variant="secondary">Clear All</Button>
            <Button type="submit">Save & Next</Button>
        </div>
    </form>
  )
}
