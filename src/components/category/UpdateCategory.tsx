import React, { useState } from "react";
import { FieldErrors, Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { UpdateCategories } from "@/lib/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

interface Props {
  onClose: (val: boolean) => void;
  Data: any;
}

const schema = z.object({
  category_name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  tax: z.number().min(0, "Tax is required"),
  thumbnail: z.any(), // manual validation later
});

type FormValues = z.infer<typeof schema>;

export default function UpdateCategory({ onClose, Data }: Props) {
  const queryClient = useQueryClient();
  const [existingImage, setExistingImage] = useState<string>(
    Data?.thumbnail_url || ""
  );
  const { mutate, isPending } = useMutation({
    mutationKey: ["addcategory"],
    mutationFn: (data: FormValues) => UpdateCategories(data),
    onSuccess: () => {
      toast.success("category added successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllcategories"] });
      onClose(false);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    },
  });
  const resolver: Resolver<FormValues> = async (values, context, options) => {
    const result = await zodResolver(schema)(values, context, options);

    const fileUploaded = values.thumbnail && values.thumbnail.length > 0;
    const isValid = !!fileUploaded || !!existingImage;

    if (!isValid) {
      (result.errors as FieldErrors<FormValues>).thumbnail = {
        type: "custom",
        message: "Thumbnail is required",
      };
    }

    return result;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      category_name: Data.category_title,
      slug: Data.slug ?? "",
      tax: Data.tax_percent,
      thumbnail: [],
    },
  });

  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>(
    (Data?.subcategories || []).map((item: any) => item.subcategory_name)
  );

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

  const onSubmit = async (data: FormValues) => {
    const isValid = await trigger();
    if (!isValid) return;

    const finalData = {
      ...data,
      thumbnail: data.thumbnail?.[0] || existingImage,
      subCategories,
      category_id: Data.category_id,
    };

    mutate(finalData);
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
            Tax <span className="text-red-500">*</span>
          </label>

          <Select
            onValueChange={(value) => setValue("tax", Number(value))}
            defaultValue="0"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tax %" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0%</SelectItem>
              <SelectItem value="5">5%</SelectItem>
              <SelectItem value="12">12%</SelectItem>
              <SelectItem value="18">18%</SelectItem>
              <SelectItem value="28">28%</SelectItem>
            </SelectContent>
          </Select>

          {errors.tax && (
            <p className="text-red-500 text-sm mt-1">{errors.tax.message}</p>
          )}
        </div>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed ${
            isDragging ? "border-blue-500" : "border-[#1E401D]"
          } rounded-lg p-6 flex items-center justify-center relative min-h-40 max-h-96`}
        >
          {thumbnailFile ? (
            <div className="relative w-full h-full">
              <img
                src={URL.createObjectURL(thumbnailFile)}
                alt="Preview"
                className="object-contain h-80 w-full rounded-md"
              />
              <button
                type="button"
                onClick={() => setValue("thumbnail", [])}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ) : Data.thumbnail_url ? (
            <div className="relative w-full h-full">
              <img
                src={Data.thumbnail_url}
                alt="Preview"
                className="object-contain h-80 w-full rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  setValue("thumbnail", []);
                  setExistingImage("");
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
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

        <div className="pt-2 flex justify-end">
          <Button type="submit">
            {isPending ? <Loader2 className="animate-spin" /> : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
