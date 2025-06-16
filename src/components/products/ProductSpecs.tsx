import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ProductFormValues } from "@/types";


function ProductSpecs() {
        
    const { register, handleSubmit, watch, setValue } = useForm<ProductFormValues>();

    const [keywords, setKeywords] = useState<string[]>([]);

    const onSubmit = (data: ProductFormValues) => {
        console.log({
        ...data,
        benefitKeywords: keywords,
        });
    };

    const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        e.preventDefault();
        const value = e.currentTarget.value.trim();
        if (value && !keywords.includes(value)) {
            setKeywords([...keywords, value]);
            e.currentTarget.value = "";
        }
        }
    };

    const removeKeyword = (keyword: string) => {
        setKeywords(keywords.filter((k) => k !== keyword));
    };

    useEffect(() => {
        watch((name) => console.log(name))
      }, [watch])

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-6 bg-white rounded-xl mt-5 shadow-md w-[75%]"
        >
            <div>
                <Label>Short Description</Label>
                <Textarea rows={5} {...register("shortDescription")} />
            </div>

            <div>
                <Label>Long Description</Label>
                <Textarea rows={5} {...register("longDescription")} />
            </div>

            <div>
                <Label>Benefits</Label>
                <Textarea rows={5} {...register("benefits")} />
            </div>

            <div>
                <Label>How to Use</Label>
                <Textarea rows={5} {...register("howToUse")} />
            </div>

            <div>
                <Label>Ingredients</Label>
                <Textarea rows={5} {...register("ingredients")} />
            </div>

            <div>
                <Label>Product Specification PDF</Label>
                <Input
                    type="file"
                    accept="application/pdf"
                    {...register("specificationPDF")}
                />
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
                <Label>Benefit Keywords</Label>
                <Input
                placeholder="Type keyword and press Enter"
                onKeyDown={addKeyword}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((kw: any) => (
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
                    <Input type="number" {...register("length", { valueAsNumber: true })} />
                </div>
                <div>
                    <Label>Weight (in KG)</Label>
                    <Input type="number" {...register("weight", { valueAsNumber: true })} />
                </div>
                <div>
                    <Label>Height (in CM)</Label>
                    <Input type="number" {...register("height", { valueAsNumber: true })} />
                </div>
                <div>
                    <Label>Breadth (in CM)</Label>
                    <Input type="number" {...register("breadth", { valueAsNumber: true })} />
                </div>
            </div>

            <div className="flex items-center justify-end gap-5 mt-6">
                <Button type="button" variant="secondary">Back</Button>
                <Button type="submit">Save & Next</Button>
            </div>
        </form>
    )
}

export default ProductSpecs