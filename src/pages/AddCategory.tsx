import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCategories, getCategoriesProductsIcon } from "@/lib/apis";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/AuthContext";
import { ProductEffectIcon } from "@/types/type";

const schema = z.object({
  category_name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  tax: z.number().min(0, "Tax is required"),
  thumbnail: z
    .any()
    .refine((file) => file?.length > 0, "Thumbnail is required"),
  products_icon: z.union([
    z.number().min(1, "Product effect is required"),
    z.null(),
  ]),
  products_effect_name: z.string(),
});

type FormValues = z.infer<typeof schema>;

export default function AddCategory() {
  const { auth } = useAppContext();
  const queryClient = useQueryClient();
  const { data: ProductIcons } = useQuery({
    queryKey: ["getproductsicon"],
    queryFn: () => getCategoriesProductsIcon(auth?.token ?? ""),
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data?.data,
  });

  const [pairs, setPairs] = useState<
    { icon_id: number; effect_name: string }[]
  >([]);
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["addcategory"],
    mutationFn: (data: FormValues) => addCategories(auth?.token ?? "", data),
    onSuccess: () => {
      toast.success("category added successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllcategories"] });
      navigate("/categories");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tax: 0,
      products_icon: null,
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
      const alreadyAdded = pairs.some(
        (pair) => pair.icon_id === icon && pair.effect_name === effects
      );
      if (alreadyAdded) {
        toast.warning("This icon-effect pair is already added");
        return;
      }
      setPairs((prev) => [...prev, { icon_id: icon, effect_name: effects }]);
      reset({
        products_effect_name: "",
      });
      setValue("products_icon", null);
    }
  };

  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [ subCategoriesError, setSubCategoriesError ] = useState(false);

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

    if (subCategories.length === 0) {
      setSubCategoriesError(true)
      toast.warning("You must add at least one subcategory");
      return;
    }

    if (pairs.length === 0) {
      toast.warning("You must add at least one icon effect pair");
      return;
    }

    

    const finalData = {
      ...data,
      thumbnail: data.thumbnail[0],
      icon_data: pairs,

      subCategories,
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
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold">Add Category</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl bg-white p-4  w-full rounded-lg"
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
          {subCategoriesError && (
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
            Category Slug <span className="text-red-500">*</span>
          </label>
          <Input {...register("slug")} placeholder="Category Slug" />
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
                value={icon !== null ? icon.toString() : undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {ProductIcons?.map((item: ProductEffectIcon) => (
                    <SelectItem
                      key={item.icon_id}
                      value={item.icon_id.toString()}
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
              {errors.products_icon && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.products_icon.message}
                </p>
              )}
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
                          {pair.effect_name}
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
                <div className="flex items-center justify-center border rounded-md bg-slate-50 text-sm font-medium text-gray-600">
                  +{pairs.length - 3} more
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#232323] mb-1">
            Thumbnail <span className="text-red-500">*</span>
          </label>
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
          {errors.thumbnail && (
            <p className="text-red-500 text-sm mt-1">
              {errors.thumbnail.message as string}
            </p>
          )}
        </div>

        <div className="pt-2 gap-x-3 flex justify-end">
          {thumbnailFile && (
            <Button
              variant={"destructive"}
              type="button"
              onClick={() => setValue("thumbnail", [])}
            >
              {" "}
              Remove
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {" "}
            {isPending ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
