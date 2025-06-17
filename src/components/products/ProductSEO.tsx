import { ProductSEOFormValues } from "@/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";


function ProductSEO() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductSEOFormValues>();

    const [keywords, setKeywords] = useState<string[]>([]);

    const onSubmit = (data: ProductSEOFormValues) => {
        console.log({
            ...data,
            metaKeywords: keywords,
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

            <div className="grid grid-cols-2 gap-10">
                {/* Meta Keywords */}
                <div>
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                        id="metaKeywords"
                        placeholder="Type keyword and press Enter"
                        onKeyDown={addKeyword}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.map((kw) => (
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

                {/* Meta Image URL */}
                <div>
                    <Label htmlFor="metaImageUrl">Meta Image URL</Label>
                    <Input
                        id="metaImageUrl"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        {...register("metaImageUrl", {
                            required: "Meta image URL is required",
                            pattern: {
                            value:
                                /^(https?:\/\/.*\.(?:png|jpg|jpeg|webp|svg|gif|bmp|tiff))$/i,
                            message: "Enter a valid image URL",
                            },
                        })}
                    />
                    {errors.metaImageUrl && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.metaImageUrl.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-5 mt-6">
                <Button type="button" variant="secondary">Back</Button>
                <Button type="submit">Submit</Button>
            </div>
        </form>
    )
}

export default ProductSEO