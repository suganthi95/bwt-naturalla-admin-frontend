import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { CloudUpload, LoaderCircle, X } from "lucide-react"
import { Badge } from "../ui/badge"
import { useMutation, useQuery } from "@tanstack/react-query"
import { addProductInfo, getCategories, getProductInfo } from "@/lib/apis"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import { ProductInfoFormType } from "@/types"

// const formSchema = z.object({
//   productName: z.string({ required_error: "Product Name is required" }),
//   category: z.string({ required_error: "Select atleast one category" }),
//   subCategory: z.string({ required_error: "Select atleast one sub category" }),
//   unit: z.string(),
//   minOrderQty: z.coerce.number().min(1),
//   tags: z.array(z.string(), { required_error: "Atleast one tag is required" }),
//   slug: z.string({ required_error: "Slug is required" }),
//   galleryImages: z.any(),
//   thumbnail: z.custom<any>(val => val !== null && val instanceof FileList && val.length > 0, { message: "Thumbnail is required" })
// })



export function ProductInfo() {

    const productId = sessionStorage.getItem("product-id") as string;
    const navigate = useNavigate();
    const location = useLocation();
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");


    const { data: categories, isLoading, isError, isSuccess } = useQuery({
        queryKey: [ "getCategories" ],
        queryFn: () => getCategories(),
        retry: 3,
        refetchOnWindowFocus: false,
        select: (data) => data?.data?.data
    });

    const { data: productInfoDefaults } = useQuery({
        queryKey: [ "getProductInfo" ],
        queryFn: () => getProductInfo(productId),
        retry: 3,
        refetchOnWindowFocus: false,
        select: (data):ProductInfoFormType => {

            const { category_id, category_title, gallery_images, min_order_quantity, product_name, slug, subcategory_id, subcategory_name, tags, thumbnail_image, units } = data?.data?.data;
            return {
                productName: product_name,
                category: `${category_title}::${category_id.toString()}`,
                subCategory: `${subcategory_name}::${subcategory_id.toString()}`,
                unit: units,
                minOrderQty: min_order_quantity,
                tags: tags,
                slug: slug,
                galleryImages: gallery_images,
                thumbnail: thumbnail_image[0]
            }
        },
        enabled: Boolean(productId) && isSuccess
    });

    // console.log(productInfoDefaults)


    const { mutate, isPending } = useMutation({
        mutationKey: [ "product-info" ],
        mutationFn: addProductInfo,
        onSuccess: (data) => {
            sessionStorage.setItem("product-id", data.data.product_id);
            toast.success("Request Success", {
                description: "Product Info saved successfully"
            });

            if(location.pathname === "/products/add/product-info"){
                navigate("/products/add/product-price");
            }

        },
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", {
                description: error?.response?.data?.message
            })
        }
    })

    const { register, handleSubmit, setValue, watch, setError, control, reset, formState: { errors } } = useForm<ProductInfoFormType>({
        defaultValues: {
            productName: "",
            category: "",
            subCategory: "",
            unit: "",
            minOrderQty: 1,
            slug: "",
            galleryImages: [],
            thumbnail: null
        }
    })

    const addTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const value = e.currentTarget.value.trim();
            if (value && !tags.includes(value)) {
                setTags([...tags, value]);
                setTagInput("")
                setError("tags", { message: "" })
            }
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((k) => k !== tag));
    };

    const onSubmit = (data: any) => {
        console.log(errors)
        data.tags = tags;
        const productId = sessionStorage.getItem("product-id");
        if(productId === null){
            mutate(data);
        }else{

            mutate({...data, productId})
        }
    }

    useEffect(() => {
        if(productInfoDefaults){
            reset(productInfoDefaults);
            setTags(productInfoDefaults.tags)
        }
    }, [ productInfoDefaults, reset ]);

    // useEffect(() => {
    //     watch((name) => console.log(name))
    // }, [watch])


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-xl mt-5 shadow-md w-[75%]">

            <div>
                <div>
                    <Label>Product Name *</Label>
                    <Input 
                        disabled={isPending} 
                        placeholder="Enter Product Name"
                        {...register("productName", {
                            required: {
                                value: true,
                                message: "Product Name is required"
                            }
                        })} 
                    />
                    {errors?.productName && <p className="text-sm text-red-500 mt-1">{errors?.productName?.message}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <Label>Category *</Label>
                    <Controller
                        control={control}
                        name="category"
                        rules={{
                            required: {
                                value: true,
                                message: "Category is required"
                            }
                        }}
                        render={({ field }) => (
                            <Select 
                                disabled={isLoading || isError || isPending} 
                                value={field.value} 
                                onValueChange={(val) => {
                                    field.onChange(val)
                                }}
                            >
                                <SelectTrigger className="capitalize">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map((category: any, index: number) => (
                                        <SelectItem key={`${category.category_title}-${index}`} className="capitalize" value={`${category.category_title}::${category.category_id.toString()}`}>{category.category_title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}  
                    />
                    {errors?.category && <p className="text-sm text-red-500">{errors?.category?.message}</p>}
                </div>

                <div>
                    <Label>Sub-category *</Label>
                    <Controller
                        name="subCategory"
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: "Sub-category is required"
                            }
                        }}
                        render={({ field }) => (
                            <Select 
                                disabled={isLoading || isError || isPending} 
                                value={field.value}
                                onValueChange={(val) => field.onChange(val)}
                            >
                                <SelectTrigger className="capitalize">
                                <SelectValue placeholder="Select Sub-category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.filter((item: any) => item.category_id.toString() === watch("category")?.split("::")[1])[0]?.subcategories?.map((subcategory: any) => (
                                        <SelectItem key={subcategory.subcategory_name} className="capitalize" value={`${subcategory.subcategory_name}::${subcategory.subcategory_id.toString()}`}>{subcategory.subcategory_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}  
                    />
                    {errors?.subCategory && <p className="text-sm text-red-500">{errors?.subCategory?.message}</p>}
                </div>

                <div>
                    <Label>Unit</Label>
                    <Input 
                        disabled={isPending} 
                        placeholder="Unit (eg kg, pc etc)" 
                        {...register("unit", {
                            required: {
                                value: true,
                                message: "Unit is required"
                            }
                        })} 
                    />
                    {errors?.unit && <p className="text-sm text-red-500 mt-1">{errors?.unit?.message}</p>}
                </div>

                <div>
                    <Label>Min Order Quantity *</Label>
                    <Input 
                        disabled={isPending} 
                        min={1} 
                        type="number" 
                        {...register("minOrderQty", {
                            required: {
                                value: true,
                                message: "Minimum order quantity is required"
                            }
                        })} 
                    />
                    {errors?.minOrderQty && <p className="text-sm text-red-500 mt-1">{errors?.minOrderQty?.message}</p>}
                </div>

            </div>

            <div>
                <Label>Tags</Label>
                <Input
                    disabled={isPending}
                    value={tagInput}
                    onKeyDown={addTags}
                    placeholder="Write & enter"
                    {...register("tags", {
                        onChange: (e) => setTagInput(e.target.value),
                        validate: () => {
                            if(tags.length === 0){
                                return "Atleast one tag is required"
                            }
                        }
                    })}
                />
                {errors?.tags && tags.length === 0 && <p className="text-sm text-red-500">{errors?.tags?.message}</p>}

                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer bg-primary-blue text-white hover:bg-primary-blue/80"
                            onClick={() => removeTag(tag)}
                            >
                            {tag} ✕
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <Label>Slug</Label>
                <Input 
                    disabled={isPending} 
                    placeholder="Product Slug" 
                    {...register("slug", {
                        required: {
                            value: true,
                            message: "Slug is required"
                        }
                    })} 
                    
                />

                {errors?.slug && <p className="text-sm text-red-500">{errors?.slug?.message}</p>}
            </div>

            <div>
                <Label>Upload Product Image *</Label>
                <p className="text-sm text-muted-foreground mb-2">
                    You need to Upload at least 4 images (1000×1000 px) for best display quality, Pay attention to the quality of the pictures you add, comply with the background color standards. Pictures must be in certain dimensions. Notice that the product shows all the details.
                </p>

                <div className="grid grid-cols-5 gap-4">
                {[0, 1, 2, 3, 4].map((_, i) => (

                    <div key={i}>
                        {watch(`galleryImages.${i}`) ?
                            <div className="relative w-fit my-4">
                                <Button onClick={() => setValue(`galleryImages.${i}`, null)} type="button" variant="destructive" className="absolute z-[10] p-0 h-5 w-5 rounded-full -top-2 -right-2">
                                    <X className="h-3 w-3"/>
                                </Button>
                                <div className="rounded-lg w-[150px] h-[150px] overflow-hidden border">
                                    {watch(`galleryImages.${i}`) instanceof FileList && watch(`galleryImages.${i}`)[0] && <img className="h-full w-full object-cover" src={URL.createObjectURL(watch(`galleryImages.${i}`)[0])} alt="thumbnail" />}
                                    {watch(`galleryImages.${i}`)?.media_url && <img className="h-full w-full object-cover" src={watch(`galleryImages.${i}`)?.media_url} alt="thumbnail" />}
                                    
                                </div>
                            </div> :
                            <Label htmlFor={`galleryImages.${i}`} className="flex flex-col gap-2 items-center justify-center border-dashed border-[2px] border-slate-400 rounded-lg p-6 my-4 w-[150px] h-[150px] cursor-pointer">
                                <CloudUpload className="h-5 w-5" />
                                <p className="text-xs text-center text-slate-400">Drop your images here or <span className="text-xs text-center text-primary-blue">Select click to browse</span></p>
                                <Input 
                                    disabled={isPending} 
                                    id={`galleryImages.${i}`} 
                                    className="hidden" 
                                    type="file" 
                                    accept="image/*" 
                                    {...register(`galleryImages.${i}`)} 
                                />
                            </Label>
                        }
                        
                    </div>
                ))}
                </div>
            </div>

            <div>
                <Label htmlFor="thumbnail">Thumbnail</Label>

                {watch("thumbnail") !== null ?
                    <div className="relative w-fit my-4">
                        <Button onClick={() => setValue("thumbnail", null)} type="button" variant="destructive" className="absolute z-[10] p-0 h-5 w-5 rounded-full -top-2 -right-2">
                            <X className="h-3 w-3"/>
                        </Button>
                        <div className="rounded-lg w-[250px] h-[250px] overflow-hidden border">
                            {watch("thumbnail") instanceof FileList ? 
                                <img className="h-full w-full object-cover" src={URL.createObjectURL(watch("thumbnail" as any)[0])} alt="thumbnail" /> :
                                <img className="h-full w-full object-cover" src={watch("thumbnail" as any)?.media_url} alt="thumbnail" />
                            }
                            {/* <img className="h-full w-full object-cover" src={watch("thumbnail")?. URL.createObjectURL(watch("thumbnail" as any)[0])} alt="thumbnail" /> */}
                        </div>
                    </div> :
                    <Label htmlFor="thumbnail" className="flex flex-col gap-2 items-center justify-center border-dashed border-[2px] border-slate-400 rounded-lg p-6 my-4 w-[250px] h-[250px] cursor-pointer">
                        <CloudUpload />
                        <p className="text-sm text-center text-slate-400">Drop your images here</p>
                        <div className="flex gap-2 items-center w-[35%]">
                            <span className="bg-[#E7E7E7] h-[1px] w-full"></span>
                            <p className="text-xs text-[#6D6D6D]">OR</p>
                            <span className="bg-[#E7E7E7] h-[1px] w-full"></span>
                        </div>
                        <p className="text-sm text-center text-primary-blue">Select click to browse</p>
                        <Input 
                            disabled={isPending} 
                            id="thumbnail" 
                            className="hidden" 
                            type="file" 
                            accept="image/*" 
                            {...register("thumbnail", {
                                required: {
                                    value: true,
                                    message: "Thumbnail is required"
                                }
                            })} 
                        />
                    </Label>
                } 
                {errors?.thumbnail && <p className="text-sm text-red-500">{errors?.thumbnail?.message as string}</p>}

            </div>


            <div className="flex justify-end items-center gap-5 mt-4">
                {/* <Button type="button" variant="secondary">Clear All</Button> */}
                <Button disabled={isPending} type="submit">{isPending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : "Save & Next"}</Button>
            </div>
        </form>
    )
}
