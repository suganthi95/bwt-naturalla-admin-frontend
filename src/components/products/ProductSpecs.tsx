import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ProductFormValues } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addProductSpecs, getProductSpecs } from "@/lib/apis";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Download, LoaderCircle, X } from "lucide-react";
import { downloadPDF } from "@/lib/utils";
import TextEditor from "../ui/TextEditor";


function ProductSpecs() {
        
    const navigate = useNavigate();
    const productId = sessionStorage.getItem("product-id") as string;   
    const { register, handleSubmit, watch, setValue, setError, control, reset, formState: { errors } } = useForm<ProductFormValues>();

    const [keywords, setKeywords] = useState<string[]>([]);

    const { data: productSpecDefaults } = useQuery({
        queryKey: [ "getProductSpecs" ],
        queryFn: () => getProductSpecs(productId),
        retry: 3,
        refetchOnWindowFocus: false,
        select: (data):ProductFormValues => {

            const { benefit_keys, benefits, best_selling, breadth, height, how_to_use, ingredients, is_featured, isin_todays_deal, length, long_description, offer_ending_soon, pdf_id, pdf_url, short_description, weight } = data?.data?.data;

            return {
                benefitKeywords: benefit_keys,
                benefits,
                bestSelling: best_selling,
                breadth,
                height,
                howToUse: how_to_use,
                ingredients,
                isFeatured: is_featured,
                length,
                longDescription: long_description,
                offerEndingSoon: offer_ending_soon, 
                shortDescription: short_description,
                specificationPDF: { pdf_id, pdf_url },
                todayDeal: isin_todays_deal,
                weight,
                productId
            }
        },
        enabled: Boolean(productId)
    });

    const { mutate, isPending } = useMutation({
        mutationKey: [ "product-price" ],
        mutationFn: addProductSpecs,
        onSuccess: () => {
            
            toast.success("Request Success", {
                description: "Product Specifications saved successfully"
            });

            if(location.pathname === "/products/add/product-specs"){
                navigate("/products/add/discounts");
            }

        },
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", {
                description: error?.response?.data?.message
            })
        }
    })

    const onSubmit = (data: ProductFormValues) => {
        const productId = sessionStorage.getItem("product-id");

        if(productId === null){
            toast.success("Request Failed", {
                description: "Add Product Info to create description & specification"
            });
        }else{

            mutate({...data, benefitKeywords: keywords, productId})
        }
    };
    
    const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            console.log(keywords);
        e.preventDefault();
        const value = e.currentTarget.value.trim();
        if (value && !keywords?.includes(value)) {
            setKeywords([...keywords, value]);
            e.currentTarget.value = "";
            setError("benefitKeywords", { message: "" })
        }
        }
    };


    const removeKeyword = (keyword: string) => {
        setKeywords(keywords?.filter((k) => k !== keyword));
    };

    useEffect(() => {
        watch((name) => console.log(name))
    }, [watch])

    useEffect(() => {
        if(productSpecDefaults && productId){
            reset(productSpecDefaults);
         setKeywords(Array.isArray(productSpecDefaults?.benefitKeywords) ? productSpecDefaults?.benefitKeywords : []);
            setValue("benefitKeywords", []);
        }
    }, [ productSpecDefaults, reset, productId ]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-6 bg-white rounded-xl mt-5 shadow-md w-[75%]"
        >
            <div>
                <Label>Short Description</Label>

                <div className="mt-1">
                    <Controller
                        rules={{
                            required: {
                                value: true,
                                message: "Short description is required"
                            }
                        }}
                        name="shortDescription"
                        control={control}
                        render={({ field }) => (
                            <TextEditor content={field.value} handleChange={(value: any) => field.onChange(value)}/>
                        )}
                    />
                </div>
                
                {/* <Textarea 
                    rows={5} 
                    {...register("shortDescription", {
                        required: {
                            value: true,
                            message: "Short description is required"
                        }
                    })} 
                /> */}

                {errors?.shortDescription && <p className="text-sm text-red-500 mt-1">{errors?.shortDescription.message}</p>}
            </div>

            <div>
                <Label>Long Description</Label>

                <div className="mt-1">
                    <Controller
                        rules={{
                            required: {
                                value: true,
                                message: "Long description is required"
                            }
                        }}
                        name="longDescription"
                        control={control}
                        render={({ field }) => (
                            <TextEditor content={field.value} handleChange={(value: any) => field.onChange(value)}/>
                        )}
                    />
                </div>
                {/* <Textarea 
                    rows={5} 
                    {...register("longDescription", {
                        required: {
                            value: true,
                            message: "Long description is required"
                        }
                    })} 
                    
                /> */}
                {errors?.longDescription && <p className="text-sm text-red-500 mt-1">{errors?.longDescription.message}</p>}
            </div>

            <div>
                <Label>Benefits</Label>

                <div className="mt-1">
                    <Controller
                        rules={{
                            required: {
                                value: true,
                                message: "Benefits is required"
                            }
                        }}
                        name="benefits"
                        control={control}
                        render={({ field }) => (
                            <TextEditor content={field.value} handleChange={(value: any) => field.onChange(value)}/>
                        )}
                    />
                </div>
                {/* <Textarea 
                    rows={5} 
                    {...register("benefits", {
                        required: {
                            value: true,
                            message: "Benefits is required"
                        }
                    })} 
                /> */}
                {errors?.benefits && <p className="text-sm text-red-500 mt-1">{errors?.benefits.message}</p>}
            </div>

            <div>
                <Label>How to Use</Label>

                <div className="mt-1">
                    <Controller
                        rules={{
                            required: {
                                value: true,
                                message: "How to use description is required"
                            }
                        }}
                        name="howToUse"
                        control={control}
                        render={({ field }) => (
                            <TextEditor content={field.value} handleChange={(value: any) => field.onChange(value)}/>
                        )}
                    />
                </div>

                {/* <Textarea 
                    rows={5} 
                    {...register("howToUse", {
                        required: {
                            value: true,
                            message: "How to use description is required"
                        }
                    })} 
                /> */}
                {errors?.howToUse && <p className="text-sm text-red-500 mt-1">{errors?.howToUse.message}</p>}
            </div>

            <div>
                <Label>Ingredients</Label>
                <Textarea 
                    rows={5} 
                    {...register("ingredients", {
                        required: {
                            value: true,
                            message: "Ingredients is required"
                        }
                    })} 
                />
                {errors?.ingredients && <p className="text-sm text-red-500 mt-1">{errors?.ingredients.message}</p>}
            </div>

            <div>
                <Label>Product Specification PDF</Label>
                {watch("specificationPDF")?.pdf_url ? 
                    <div className="flex flex-row items-center justify-between gap-5">
                        <Button onClick={() => downloadPDF(watch("specificationPDF")?.pdf_url)} className="w-full flex flex-row items-center justify-between" type="button" variant={"secondary"}>specifications.pdf <Download className="h-4 w-4" /></Button>
                        <Button onClick={() => setValue("specificationPDF", null)} size={"icon"} type="button" variant={"secondary"}><X/></Button>
                    </div>
                    
                    :

                    <Input
                        type="file"
                        accept="application/pdf"
                        {...register("specificationPDF")}
                    />
                }
                
            </div>

            <div className="grid grid-cols-2 gap-y-10">
                <div className="flex items-center gap-4">
                    <Label htmlFor="isFeatured">Is Featured :</Label>
                    <Switch
                        id="isFeatured"
                        checked={watch("isFeatured")}
                        onCheckedChange={(value) => setValue("isFeatured", value)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <Label htmlFor="todayDeal">Today Deal :</Label>
                    <Switch
                        id="todayDeal"
                        checked={watch("todayDeal")}
                        onCheckedChange={(value) => setValue("todayDeal", value)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <Label htmlFor="offerEndingSoon">Offer Ending Soon :</Label>
                    <Switch
                        id="offerEndingSoon"
                        checked={watch("offerEndingSoon")}
                        onCheckedChange={(value) => setValue("offerEndingSoon", value)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <Label htmlFor="bestSelling">Best Selling :</Label>
                    <Switch
                    id="bestSelling"
                    checked={watch("bestSelling")}
                    onCheckedChange={(value) => setValue("bestSelling", value)}
                    />
                </div>
            </div>

            <div>
                <Label>Benefit Keywords (Type the benefit keywords and Press "Enter")</Label>
                <Input
                    placeholder="Type keyword and press Enter"
                    onKeyDown={addKeyword}
                    {...register("benefitKeywords", {
                        validate: () => {
                            if(keywords?.length === 0){
                                return "Atleast one benefit keyword is required"
                            }
                        }
                    })}
                />
                {errors?.benefitKeywords && <p className="text-sm text-red-500 mt-1">{errors?.benefitKeywords?.message}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                    {keywords?.map((kw: any) => (
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

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Length (in CM)</Label>
                    <Input 
                        type="number" 
                        step="any"
                        {...register("length", 
                            { 
                                valueAsNumber: true, 
                                required: {
                                    value: true,
                                    message: "Length is required"
                                }
                            }
                        )} 
                    />
                    {errors?.length && <p className="text-sm text-red-500 mt-1">{errors?.length.message}</p>}
                </div>
                <div>
                    <Label>Weight (in KG)</Label>
                    <Input 
                        type="number"
                        step="any"
                        {...register("weight", { 
                            valueAsNumber: true,
                            required: {
                                value: true,
                                message: "Weight is required"
                            }
                        })} 
                    />
                    {errors?.weight && <p className="text-sm text-red-500 mt-1">{errors?.weight?.message}</p>}
                </div>
                <div>
                    <Label>Height (in CM)</Label>
                    <Input 
                        type="number" 
                        step="any"
                        {...register("height", { 
                            valueAsNumber: true,
                            required: {
                                value: true,
                                message: "Height is required"
                            }
                        })} 
                    />
                    {errors?.height && <p className="text-sm text-red-500 mt-1">{errors?.height.message}</p>}
                </div>
                <div>
                    <Label>Breadth (in CM)</Label>
                    <Input 
                        type="number" 
                        step="any"
                        {...register("breadth", { 
                            valueAsNumber: true,
                            required: {
                                value: true,
                                message: "Breadth is required"
                            }
                        })} 
                    />
                    {errors?.breadth && <p className="text-sm text-red-500 mt-1">{errors?.breadth.message}</p>}
                </div>
            </div>

            <div className="flex items-center justify-end gap-5 mt-6">
                <Button onClick={() => navigate("/products/add/product-price")} disabled={isPending} type="button" variant="secondary">Back</Button>
                <Button disabled={isPending} type="submit">{isPending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : "Save & Next"}</Button>
            </div>
        </form>
    )
}

export default ProductSpecs