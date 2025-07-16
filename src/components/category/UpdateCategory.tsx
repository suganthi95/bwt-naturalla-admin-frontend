import React, { useState } from "react";
import { useForm, FieldErrors, Resolver } from "react-hook-form";
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
} from "@/components/ui/select";
import { getCategoriesProductsIcon, UpdateCategories } from "@/lib/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { useAppContext } from "@/contexts/AuthContext";
import { ProductEffectIcon } from "@/types/type";
type ProductIcon = {
  icon_id: number;
  icon_url: string;
  icon_name: string;
  icon_text: string;
  prod_icon_id: number;
};
interface Props {
  onClose: (val: boolean) => void;
  Data: any;
}

const schema = z.object({
  category_name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  tax: z.number().min(0, "Tax is required"),
  thumbnail: z.any(),
  products_icon: z.any(),
  products_effect_name: z.string(),
});

type FormValues = z.infer<typeof schema>;

export default function UpdateCategory({ onClose, Data }: Props) {
  const { auth } = useAppContext();
  const queryClient = useQueryClient();
  const { data: ProductIcons } = useQuery({
    queryKey: ["getproductsicon"],
    queryFn: () => getCategoriesProductsIcon(auth?.token ?? ""),
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data?.data,
  });

  const [existingImage, setExistingImage] = useState(Data?.thumbnail_url || "");
  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>(
    Data?.subcategories?.map((item: any) => item.subcategory_name) || []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [pairs, setPairs] = useState<ProductIcon[]>(Data?.icon_data);

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
      slug: Data.slug || "",
      tax: Data.tax_percent,
      thumbnail: [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: (args: { token: string; data: FormValues }) =>
      UpdateCategories(args.token, args.data),
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllcategories"] });
      onClose(false);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    },
  });

  const icon = watch("products_icon");
  const effects = watch("products_effect_name");
  // const isAddDisabled = !icon || !effects || effects.trim() === "";

  const handleAdd = () => {
      if (!icon) {
    toast.warning("Select a new icon");
    return;
  }

  if (!effects || effects.trim() === "") {
    toast.warning("Add an effect name");
    return;
  }
    if (icon && effects) {
      const selectedIcon = ProductIcons?.find(
        (item: ProductEffectIcon) => item.icon_id === icon
      );

      if (!selectedIcon) return;
      const alreadyAdded = pairs.some(
        (pair) => pair.icon_id === icon && pair.icon_text === effects
      );
      if (alreadyAdded) {
        toast.warning("This icon-effect pair is already added");
        return;
      }

      setPairs((prev) => [
        ...prev,
        {
          ...selectedIcon,
          icon_text: effects,
        },
      ]);

      setValue("products_icon", null);
      setValue("products_effect_name", "");
    }
  };

  const thumbnailFile = watch("thumbnail")?.[0];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setValue("thumbnail", [file]);
    }
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
      handleAddSubCategory();
    }
  };
  console.log(subCategories);
  

  const onSubmit = async (data: FormValues) => {
    const isValid = await trigger();
    if (!isValid) return;
    if (pairs.length === 0) {
      toast.warning("You must add at least one icon effect pair");
      return;
    }

    if (subCategories.length === 0) {
      toast.warning("You must add at least one subcategory");
      return;
    }
    const finalData = {
      ...data,
      thumbnail: data.thumbnail?.[0] || existingImage,
      icon_data: pairs,
      subCategories,
      category_id: Data.category_id,
    };

    mutate({ token: auth?.token ?? "", data: finalData });
  };

  return (
    <div className="p-2 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl bg-white rounded-lg"
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

          {subCategories.length === 0 && (
            <p className="text-sm text-red-500 mt-1">Subcategory is required</p>
          )}

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
            defaultValue={String(Data.tax_percent)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tax %" />
            </SelectTrigger>
            <SelectContent>
              {[0, 5, 12, 18, 28].map((rate) => (
                <SelectItem key={rate} value={String(rate)}>
                  {rate}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tax && (
            <p className="text-red-500 text-sm mt-1">{errors.tax.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-end gap-4 w-full">
            <div className="w-2/3">
              <label className="block text-sm font-semibold text-[#232323] mb-1">
                Product Effects Icon <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={(value) =>
                  setValue("products_icon", Number(value))
                }
                value={icon !== null ? icon?.toString() : undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {ProductIcons?.map((item: any) => (
                    <SelectItem
                      key={item.icon_id}
                      value={item.icon_id?.toString()}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={item.icon_url}
                          alt={item.icon_name}
                          className="w-5 h-5 object-contain"
                        />
                        <span className="text-sm text-[#232323] font-medium">
                          {item.icon_name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-2/3">
              <label className="block text-sm font-semibold text-[#232323] mb-1">
                Product Effects Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("products_effect_name")}
                placeholder="Enter here"
                className="w-full"
              />
              {errors.products_effect_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.products_effect_name.message}
                </p>
              )}
            </div>

            <div className="w-auto">
              <Button
                type="button"
                // disabled={isAddDisabled}
                onClick={handleAdd}
                className="bg-blue-500"
              >
                Add
              </Button>
            </div>
          </div>

          {pairs.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pairs.slice(0, 3).map((pair, index) => {
                const matchedIcon = ProductIcons?.find(
                  (icon: ProductEffectIcon) => icon.icon_id === pair.icon_id
                );

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-1 px-4 border rounded-md bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={matchedIcon?.icon_url}
                        alt={matchedIcon?.icon_name}
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {pair.icon_text}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setPairs((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {pairs.length > 3 && (
                <div className="flex items-center justify-center p-1 px-4 border rounded-md bg-slate-50 text-sm font-medium text-gray-600">
                  +{pairs.length - 3} more
                </div>
              )}
            </div>
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
          {thumbnailFile || existingImage ? (
            <div className="relative w-72 h-72 mx-auto">
              <img
                src={
                  thumbnailFile
                    ? URL.createObjectURL(thumbnailFile)
                    : existingImage
                }
                alt="Preview"
                className="object-contain w-full h-full rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  setValue("thumbnail", [], { shouldDirty: true });
                  setExistingImage("");
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center text-gray-500 cursor-pointer w-full h-80">
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
