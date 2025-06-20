import { ProductSEOFormValues } from "@/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CloudUpload, LoaderCircle, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { addMetaSEO, getProductSEO } from "@/lib/apis";


function ProductSEO() {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
        setValue,
        reset
    } = useForm<ProductSEOFormValues>({
        defaultValues: {
            metaImage: null,
            metaKeyword: []
        }
    });

    const productId = sessionStorage.getItem("product-id") as string; 
    const navigate = useNavigate();
    const [keywords, setKeywords] = useState<string[]>([]);

    const { data: productSEODefaults } = useQuery({
        queryKey: [ "getProductSEO" ],
        queryFn: () => getProductSEO(productId),
        retry: 3,
        refetchOnWindowFocus: false,
        select: (data): ProductSEOFormValues => {
            const { meta_description, meta_image_url, meta_keywords, meta_title } = data?.data?.data;
            return {
                metaDescription: meta_description,
                metaKeyword: meta_keywords,
                metaTitle: meta_title,
                metaImage: meta_image_url,
                metaImageUrl: ""
            }
        },
        enabled: Boolean(productId)
    });

    const { mutate, isPending } = useMutation({
        mutationKey: [ "addMetaSEO" ],
        mutationFn: addMetaSEO,
        onSuccess: () => {
            sessionStorage.removeItem("product-id");
            navigate("/products");
            toast.success("Request Success", {
                description: "SEO added successfully"
            });

        },
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", {
                description: error?.response?.data?.message
            })
        }
    })

    const onSubmit = (data: ProductSEOFormValues) => {

        const productId = sessionStorage.getItem("product-id");
        
        if(productId === null){
            toast.success("Request Failed", {
                description: "Add Product Info to submit SEO informations"
            });
        }else{

            mutate({
                ...data,
                metaKeywords: keywords,
                productId: productId
            })
        }

    };

    const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const value = e.currentTarget.value.trim();
            if (value && !keywords.includes(value)) {
                setKeywords([...keywords, value]);
                e.currentTarget.value = "";
                setError("metaKeyword", { message: "" })
            }
        }
    };

    const removeKeyword = (keyword: string) => {
        setKeywords(keywords.filter((k) => k !== keyword));
    };

    useEffect(() => {
        if(productSEODefaults && productId){
            reset(productSEODefaults);
            setKeywords(productSEODefaults.metaKeyword)
            setValue("metaKeyword", []);
        }
    }, [ productSEODefaults, reset, productId ]);


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-6 bg-white rounded-xl mt-5 shadow-md w-[75%]"
        >
            <div className="grid grid-cols-2 gap-10">
                {/* Meta Title */}
                <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                        id="metaTitle"
                        placeholder="Enter meta title"
                        {...register("metaTitle", { required: "Meta title is required" })}
                    />
                    {errors.metaTitle && (
                        <p className="text-sm text-red-500 mt-1">{errors.metaTitle.message}</p>
                    )}
                </div>

                {/* Meta Description */}
                <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Input
                        id="metaDescription"
                        placeholder="Enter meta description"
                        {...register("metaDescription", {
                            required: "Meta description is required",
                        })}
                    />
                    {errors.metaDescription && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.metaDescription.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Meta Keywords */}
            <div>
                <Label htmlFor="metaKeywords">Meta Keywords (Type the keywords and Press "Enter")</Label>
                <Input
                    id="metaKeywords"
                    placeholder="Type keyword and press Enter"
                    onKeyDown={addKeyword}
                    {...register("metaKeyword", {
                        validate: () => {
                            if(keywords.length === 0){
                                return "Meta keyword is required"
                            }
                        }
                    })}
                />

                {errors.metaKeyword && (
                    <p className="text-sm text-red-500 mt-1">
                        {errors?.metaKeyword.message}
                    </p>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                    {keywords?.map((kw) => (
                        <Badge
                            key={kw}
                            variant="secondary"
                            className="cursor-pointer bg-primary-blue text-white hover:bg-primary-blue/80"
                            onClick={() => removeKeyword(kw)}
                            >
                            {kw} ✕
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <Label htmlFor="metaImage">Meta Image</Label>

                {watch("metaImage") !== null ?
                    <div className="relative w-fit my-4">
                        <Button onClick={() => setValue("metaImage", null)} type="button" variant="destructive" className="absolute z-[10] p-0 h-5 w-5 rounded-full -top-2 -right-2">
                            <X className="h-3 w-3"/>
                        </Button>
                        <div className="rounded-lg w-[250px] h-[250px] overflow-hidden border">
                            {typeof watch("metaImage") === "string" && <img className="h-full w-full object-cover" src={watch("metaImage")} alt="metaImage" />}
                            {watch("metaImage") instanceof FileList && <img className="h-full w-full object-cover" src={URL.createObjectURL(watch("metaImage")[0])} alt="metaImage" />}
                            
                        </div>
                    </div> :
                    <Label htmlFor="metaImage" className="flex flex-col gap-2 items-center justify-center border-dashed border-[2px] border-slate-400 rounded-lg p-6 my-4 w-[250px] h-[250px] cursor-pointer">
                        <CloudUpload />
                        <p className="text-sm text-center text-slate-400">Drop your images here</p>
                        <div className="flex gap-2 items-center w-[35%]">
                            <span className="bg-[#E7E7E7] h-[1px] w-full"></span>
                            <p className="text-xs text-[#6D6D6D]">OR</p>
                            <span className="bg-[#E7E7E7] h-[1px] w-full"></span>
                        </div>
                        <p className="text-sm text-center text-primary-blue">Select click to browse</p>
                        <Input 
                            id="metaImage" 
                            className="hidden" 
                            type="file" 
                            accept="image/*" 
                            {...register("metaImage", {
                                required: {
                                    value: true,
                                    message: "Meta Image is required"
                                }
                            })} 
                        />
                    </Label>
                }  

                {errors.metaImage && (
                    <p className="text-sm text-red-500 mt-1">
                        {errors?.metaImage?.message as string}
                    </p>
                )}

            </div>


            <div className="flex items-center justify-end gap-5 mt-6">
                <Button onClick={() => navigate("/products/add/discounts")} disabled={isPending} type="button" variant="secondary">Back</Button>
                <Button disabled={isPending} type="submit">{isPending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : "Submit"}</Button>
            </div>
        </form>
    )
}

export default ProductSEO