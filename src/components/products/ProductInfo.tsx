import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { CloudUpload, LoaderCircle, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProductInfo,
  getCategories,
  getCategoryBasedIcons,
  getProductInfo,
} from "@/lib/apis";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductIcon, ProductInfoFormType } from "@/types";
import { useAppContext } from "@/contexts/AuthContext";
import { ProductEffectIcon } from "@/types/type";

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
  const { auth } = useAppContext();
  const productId = sessionStorage.getItem("product-id") as string;
  const navigate = useNavigate();
  const location = useLocation();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategoryId, setSeletectedCategoryId] = useState<number>();
  const [tagInput, setTagInput] = useState("");
 const queryClient = useQueryClient()
  const { data: productIcons } = useQuery({
    queryKey: ["getCategoriesbasedicons", selectedCategoryId],
    queryFn: () => getCategoryBasedIcons(auth?.token ?? "", selectedCategoryId!.toString()),
    enabled: !!auth?.token && !!selectedCategoryId && !isNaN(selectedCategoryId),
    retry: 3,
    select: (data) => data?.data?.data,
  });

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getCategories"],
    queryFn: () => getCategories(auth?.token ?? ""),
    retry: 3,
    refetchOnWindowFocus: false,
    select: (data) => data?.data?.data,
  });

  const { data: productInfoDefaults } = useQuery({
    queryKey: ["getProductInfo"],
    queryFn: () => getProductInfo(auth?.token ?? "", productId),
    retry: 3,
    refetchOnWindowFocus: true,
    select: (data): ProductInfoFormType => {
      const {
        category_id,
        hsn_code,
        category_title,
        gallery_images,
        min_order_quantity,
        product_name,
        slug,
        subcategory_id,
        subcategory_name,
        tags,
        thumbnail_image,
        icon_data,
        units,
      } = data?.data?.data;

      return {
        category_id: category_id ?? null,
        productName: product_name ?? "",
        category:
          category_title && category_id !== null && category_id !== undefined
            ? `${category_title}::${category_id}`
            : "",
        subCategory:
          subcategory_name && subcategory_id !== null && subcategory_id !== undefined
            ? `${subcategory_name}::${subcategory_id}`
            : "",
        unit: units ?? "",
        minOrderQty: min_order_quantity ?? 1,
        tags: tags ?? [],
        hsn_code: hsn_code ?? "",
        icon_data: icon_data ?? [],
        slug: slug ?? "",
        galleryImages: gallery_images ?? [],
        thumbnail: thumbnail_image?.[0] ?? null,
      };
    },
    enabled: Boolean(productId) && Boolean(categories),
  });

  const [pairs, setPairs] = useState<ProductIcon[] | null>(
    productInfoDefaults?.icon_data || []
  );

  const { mutate, isPending } = useMutation({
    mutationKey: ["product-info"],
    mutationFn: addProductInfo,
    onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey:["getAllProducts"]})
      sessionStorage.setItem("product-id", data.data.product_id);
      toast.success("Request Success", {
        description: "Product Info saved successfully",
      });

      if (location.pathname === "/products/add/product-info") {
        navigate("/products/add/product-price");
      }
    },
    onError: (error: AxiosError<any>) => {
      console.log(error);
      toast.error("Request Failed", {
        description: error?.response?.data?.message,
      });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductInfoFormType>({
    defaultValues: {
      productName: "",
      category: "",
      subCategory: "",
      unit: "",
      minOrderQty: 1,
      product_effects: [],
      hsn_code: "",
      slug: "",
      galleryImages: [],
      thumbnail: null,
    },
  });

  useEffect(() => {
    if (productIcons?.length) {
      reset((prev) => ({
        ...prev,
        product_effects: productIcons,
      }));
    }
  }, [productIcons, reset]);

  const addTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        setTagInput("");
        setError("tags", { message: "" });
      }
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((k) => k !== tag));
  };

  const onSubmit = (data: any) => {

    let galleryImagesError = false;

    for(let i = 0; i < data.galleryImages.length; i++){
      if(data.galleryImages[i] instanceof FileList && data.galleryImages[i][0]?.size > 5 * 1024 * 1024){
        setError(`galleryImages.${i}`, { message: "Image size is more than 5 MB" });
        galleryImagesError = true
      }
    }

    if(galleryImagesError){
      return;
    }

    if(data.thumbnail instanceof FileList && data.thumbnail[0].size > 5 * 1024 * 1024){
      return setError("thumbnail", { message: "Thumbnail size must be less than 5 MB" })
    }

    data.tags = tags;
    const productId = sessionStorage.getItem("product-id");
    if (productId === null) {
      mutate({ token: auth?.token ?? "", data:{ ...data,pairs} });
    } else {
      mutate({ token: auth?.token ?? "", data: { ...data, productId, pairs } });
    }
  };

  useEffect(() => {
    if (productInfoDefaults && productId) {
      reset(productInfoDefaults);
      setTags(productInfoDefaults.tags);
      setSeletectedCategoryId(productInfoDefaults.category_id);
      setPairs(productInfoDefaults?.icon_data);
    }
  }, [productInfoDefaults, reset, productId]);

  useEffect(() => {
    if (productInfoDefaults?.category && productInfoDefaults?.subCategory) {
      // 1. Set category first (to make subcategories available)
      setValue("category", productInfoDefaults.category);

      // 2. Wait for next tick (after category is updated) to set subCategory
      setTimeout(() => {
        setValue("subCategory", productInfoDefaults.subCategory);
      }, 0);
    }
  }, [productInfoDefaults, setValue]);


  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white rounded-xl mt-5 shadow-md w-[75%]"
    >
      <div>
        <div>
          <Label>Product Name *</Label>
          <Input
            disabled={isPending}
            placeholder="Enter Product Name"
            {...register("productName", {
              required: {
                value: true,
                message: "Product Name is required",
              },
            })}
          />
          {errors?.productName && (
            <p className="text-sm text-red-500 mt-1">
              {errors?.productName?.message}
            </p>
          )}
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
                message: "Category is required",
              },
            }}
            render={({ field }) => (
              <Select
                disabled={isLoading || isError || isPending}
                value={field.value}
                onValueChange={(val) => {
                  const [_, idStr] = val.split("::");
                  const parsedId = Number(idStr?.trim());

                  if (!isNaN(parsedId)) {
                    setSeletectedCategoryId(parsedId);
                  } else {
                    toast.error("Invalid category selected");
                  }

                  field.onChange(val);
                }}
              >
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category: any, index: number) => (
                    <SelectItem
                      key={`${category.category_title}-${index}`}
                      className="capitalize"
                      value={`${
                        category.category_title
                      }::${category.category_id.toString()}`}
                    >
                      {category.category_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors?.category && (
            <p className="text-sm text-red-500">{errors?.category?.message}</p>
          )}
        </div>

        <div>
          <Label>Sub-category *</Label>
          <Controller
            name="subCategory"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Sub-category is required",
              },
            }}
            render={({ field }) => (
              <Select
                disabled={
                  isLoading ||
                  isError ||
                  isPending ||
                  !Boolean(watch("category"))
                }
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val)
                }}
              >
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Select Sub-category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    ?.filter((item: any) => item.category_id.toString() === watch("category")?.split("::")[1])[0]
                    ?.subcategories?.map((subcategory: any) => (
                      <SelectItem
                        key={subcategory.subcategory_name}
                        className="capitalize"
                        value={`${subcategory.subcategory_name}::${subcategory.subcategory_id.toString()}`}
                      >
                        {subcategory.subcategory_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors?.subCategory && (
            <p className="text-sm text-red-500">
              {errors?.subCategory?.message}
            </p>
          )}
        </div>

        <div>
          <Label>Size *</Label>
          <Input
            disabled={isPending}
            placeholder="Size"
            {...register("unit", {
              required: {
                value: true,
                message: "Unit is required",
              },
            })}
          />
          {errors?.unit && (
            <p className="text-sm text-red-500 mt-1">{errors?.unit?.message}</p>
          )}
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
                message: "Minimum order quantity is required",
              },
            })}
          />
          {errors?.minOrderQty && (
            <p className="text-sm text-red-500 mt-1">
              {errors?.minOrderQty?.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Tags * (Type the Tag and Press "Enter")</Label>
        <Input
          disabled={isPending}
          value={tagInput}
          onKeyDown={addTags}
          placeholder="Write & enter"
          {...register("tags", {
            onChange: (e) => setTagInput(e.target.value),
            validate: () => {
              if (tags.length === 0) {
                return "Atleast one tag is required";
              }
            },
          })}
        />
        {errors?.tags && tags.length === 0 && (
          <p className="text-sm text-red-500">{errors?.tags?.message}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {tags?.map((tag) => (
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
      <div className="">
        <label className="block text-sm font-semibold text-[#232323] mb-1">
          Product Effects Icon <span className="text-red-500">*</span>
        </label>
        <Select
          onValueChange={(value) => {
            const selectedIcon = watch("product_effects")?.find(
              (item: ProductEffectIcon) => item.prod_icon_id === Number(value)
            );

            if (!selectedIcon) return;

            const alreadyExists = pairs?.some(
              (p) => p.prod_icon_id === selectedIcon.prod_icon_id
            );

            if (!alreadyExists) {
              setPairs((prev) => [...(prev || []), selectedIcon]);
            } else {
              toast.warning("Icon already selected");
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {watch("product_effects") && watch("product_effects").length > 0 ? (
              watch("product_effects").map((item: ProductEffectIcon) => (
                <SelectItem key={item.prod_icon_id} value={item.prod_icon_id.toString()}>
                  <div className="flex items-center gap-2">
                    <img
                      src={item.icon_url}
                      alt={item.icon_name}
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-sm text-[#232323] font-medium">
                      {item.icon_text}
                    </span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="text-sm text-muted-foreground px-4 py-2">
                Please select a category to load icons
              </div>
            )}
          </SelectContent>
        </Select>

        {pairs && pairs?.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pairs?.map((pair, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-1 px-4 border rounded-md bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={pair?.icon_url}
                      alt={pair?.icon_name}
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
                      setPairs((prev) =>
                        (prev ?? [])?.filter(
                          (item) => item.icon_id !== pair?.icon_id
                        )
                      )
                    }
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>

      <div>
        <Label>Slug *</Label>
        <Input
          disabled={isPending}
          placeholder="Product Slug"
          {...register("slug", {
            required: {
              value: true,
              message: "Slug is required",
            },
          })}
        />

        {errors?.slug && (
          <p className="text-sm text-red-500">{errors?.slug?.message}</p>
        )}
      </div>

      <div>
        <Label>HSN Code *</Label>
        <Input
          disabled={isPending}
          placeholder="Enter HSN Code"
          {...register("hsn_code", {
            required: {
              value: true,
              message: "HSN code is required",
            },
            pattern: {
              value: /^[0-9]+$/,
              message: "HSN code must be numeric",
            },
          })}
        />

        {errors?.hsn_code && (
          <p className="text-sm text-red-500">{errors?.hsn_code?.message}</p>
        )}
      </div>

      <div>
        <Label>Upload Product Image *</Label>
        <p className="text-sm text-muted-foreground mb-2">
          You need to Upload at least 4 images (1000×1000 px) for best display
          quality, Pay attention to the quality of the pictures you add <span className="font-semibold">(maximum size is 5 MB)</span>, comply
          with the background color standards. Pictures must be in certain
          dimensions. Notice that the product shows all the details.
        </p>

        <div className="grid grid-cols-3 xl:grid-cols-5 gap-4">
          {[0, 1, 2, 3, 4].map((_, i) => (
            <div key={i}>
              {(watch(`galleryImages.${i}`) instanceof FileList &&
                watch(`galleryImages.${i}`)[0]) ||
              watch(`galleryImages.${i}`)?.media_url ? (
                <div className="relative w-fit my-4">
                  <Button
                    onClick={() => setValue(`galleryImages.${i}`, null)}
                    type="button"
                    variant="destructive"
                    className="absolute z-[10] p-0 h-5 w-5 rounded-full -top-2 -right-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="rounded-lg w-[150px] h-[150px] overflow-hidden border">
                    {watch(`galleryImages.${i}`) instanceof FileList &&
                      watch(`galleryImages.${i}`)[0] && (
                        <>
                          <img
                            className="h-full w-full object-cover"
                            src={URL.createObjectURL(
                              watch(`galleryImages.${i}`)[0]
                            )}
                            alt="thumbnail"
                          />
                        </>
                      )}
                    {watch(`galleryImages.${i}`)?.media_url && (
                      <img
                        className="h-full w-full object-cover"
                        src={watch(`galleryImages.${i}`)?.media_url}
                        alt="thumbnail"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <Label
                  htmlFor={`galleryImages.${i}`}
                  className="flex flex-col gap-2 items-center justify-center border-dashed border-[2px] border-slate-400 rounded-lg p-6 my-4 w-[150px] h-[150px] cursor-pointer"
                >
                  <CloudUpload className="h-5 w-5" />
                  <p className="text-xs text-center text-slate-400">
                    Drop your images here or{" "}
                    <span className="text-xs text-center text-primary-blue">
                      Select click to browse
                    </span>
                  </p>
                  <Input
                    disabled={isPending}
                    id={`galleryImages.${i}`}
                    className="hidden"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    {...register(`galleryImages.${i}`, {
                      validate: {
                        fileSize: (value) => {
                          const file = value && value[0];
                          const maxSize = 1024 * 1024; // 5MB in bytes
                          if (file?.size > maxSize) return 'Image size is more than 1 MB';
                        },
                      }
                    })}
                  />
                </Label>
              )}
              {errors.galleryImages && (errors?.galleryImages as any)[i] &&
                <p className="text-sm text-red-500">
                  {(errors?.galleryImages as any)[i].message}
                </p>
              }
              
            </div>
          ))}
           
        </div>
      </div>

      <div>
        <Label htmlFor="thumbnail">Thumbnail *</Label>

        {watch("thumbnail") !== null ? (
          <div className="relative w-fit my-4">
            <Button
              onClick={() => setValue("thumbnail", null)}
              type="button"
              variant="destructive"
              className="absolute z-[10] p-0 h-5 w-5 rounded-full -top-2 -right-2"
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="rounded-lg w-[250px] h-[250px] overflow-hidden border">
              {watch("thumbnail") instanceof FileList ? (
                <img
                  className="h-full w-full object-cover"
                  src={URL.createObjectURL(watch("thumbnail" as any)[0])}
                  alt="thumbnail"
                />
              ) : (
                <img
                  className="h-full w-full object-cover"
                  src={watch("thumbnail" as any)?.media_url}
                  alt="thumbnail"
                />
              )}
              {/* <img className="h-full w-full object-cover" src={watch("thumbnail")?. URL.createObjectURL(watch("thumbnail" as any)[0])} alt="thumbnail" /> */}
            </div>
          </div>
        ) : (
          <Label
            htmlFor="thumbnail"
            className="flex flex-col gap-2 items-center justify-center border-dashed border-[2px] border-slate-400 rounded-lg p-6 my-4 w-[250px] h-[250px] cursor-pointer"
          >
            <CloudUpload />
            <p className="text-sm text-center text-slate-400">
              Drop your images here
            </p>
            <div className="flex gap-2 items-center w-[35%]">
              <span className="bg-[#E7E7E7] h-[1px] w-full"></span>
              <p className="text-xs text-[#6D6D6D]">OR</p>
              <span className="bg-[#E7E7E7] h-[1px] w-full"></span>
            </div>
            <p className="text-sm text-center text-primary-blue">
              Select click to browse
            </p>
            <Input
              disabled={isPending}
              id="thumbnail"
              className="hidden"
              type="file"
              accept=".png, .jpg, .jpeg"
              {...register("thumbnail", {
                required: {
                  value: true,
                  message: "Thumbnail is required",
                },
                validate: {
                  fileSize: (value) => {
                  const file = value && value[0];
                  if (!file) return 'Please select a file.';
                    const maxSize = 1024 * 1024; // 5MB in bytes
                    return file.size <= maxSize || 'Thumbnail size must be less than 1MB.';
                  },
                }
              })}
            />
          </Label>
        )}
        {errors?.thumbnail && (
          <p className="text-sm text-red-500">
            {errors?.thumbnail?.message as string}
          </p>
        )}
      </div>

      <div className="flex justify-end items-center gap-5 mt-4">
        {/* <Button type="button" variant="secondary">Clear All</Button> */}
        <Button disabled={isPending} type="submit">
          {isPending ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            "Save & Next"
          )}
        </Button>
      </div>
    </form>
  );
}
