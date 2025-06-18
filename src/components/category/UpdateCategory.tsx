import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Props {
  onClose: (val: boolean) => void;
}

const schema = z.object({
  category_name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  thumbnail: z
    .any()
    .refine((file) => file?.length > 0, "Thumbnail is required"),
});

type FormValues = z.infer<typeof schema>;

export default function UpdateCategory({ onClose }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>([]);

  const thumbnailFile = watch("thumbnail")?.[0];
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setValue("thumbnail", [file]);
    }
  };

  const onSubmit = (data: FormValues) => {
    const finalData = {
      ...data,
      sub_categories: subCategories,
    };
    console.log(finalData);
    onClose(false)
  };

  const handleAddSubCategory = () => {
    if (subCategoryInput.trim()) {
      setSubCategories((prev) => [...prev, subCategoryInput.trim()]);
      setSubCategoryInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && subCategoryInput.trim()) {
      e.preventDefault();
      setSubCategories((prev) => [...prev, subCategoryInput.trim()]);
      setSubCategoryInput("");
    }
  };

  return (
    <div className="p-2 px-4">
    

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl bg-white  rounded-lg"
      >
        <div>
          <label className="block text-sm font-semibold text-[#232323] mb-1">
            Category Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("category_name")}
            placeholder="Enter category name"
          />
          {errors.category_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#232323] mb-1">
            Sub-Category Name
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={subCategoryInput}
              onChange={(e) => setSubCategoryInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add subcategory"
            />
            <Button type="button" onClick={handleAddSubCategory}>
              Add
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {subCategories.map((item, i) => (
              <Badge
                key={i}
                variant="outline"
                className="px-2 py-1 rounded-lg text-sm flex items-center gap-1"
              >
                {item}
                <X
                  className="w-4 h-4 cursor-pointer ml-1"
                  onClick={() =>
                    setSubCategories((prev) => prev.filter((x) => x !== item))
                  }
                />
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#232323] mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <Input {...register("slug")} placeholder="product-slug" />
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#232323] mb-1">
            Thumbnail <span className="text-red-500">*</span>
          </label>
          {thumbnailFile ? (
            <div className="w-[192px]  relative rounded-md ">
              <img
                src={URL.createObjectURL(thumbnailFile)}
                alt="Preview"
                className="w-full h-fulll object-contain"
              />
              <button
                type="button"
                onClick={() => setValue("thumbnail", [])}
                className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed ${
                isDragging ? "border-blue-500" : "border-[#1E401D]"
              } rounded-lg p-6 flex items-center justify-center relative min-h-40 max-h-96`}
            >
              {thumbnailFile ? (
                <img
                  src={URL.createObjectURL(thumbnailFile)}
                  alt="Preview"
                  className="object-contain h-80 w-full rounded-md"
                />
              ) : (
                <label className="flex flex-col items-center justify-center text-gray-500 cursor-pointer w-full h-full">
                  <CloudUpload className="w-8 h-8 mb-2 text-[#1E401D]" />
                  <p className="text-xs font-medium text-[#BFBFBF]">
                    Drop your image or{" "}
                    <span className="text-blue-500">click to browse</span>
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("thumbnail")}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
          {errors.thumbnail && (
            <p className="text-red-500 text-sm mt-1">
              {errors.thumbnail.message as string}
            </p>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
}
