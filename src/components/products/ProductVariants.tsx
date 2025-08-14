import { Package, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

type Variant = {
  name: string;
  size: string;
  unitPrice: string;
  strikePrice: string;
  thumbnail: File | null;
  enabled: boolean;
};

type Errors = {
  [key: number]: Partial<Record<keyof Variant, string>>;
};

export default function ProductVariants() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  const addVariant = () => {
    if (variants.length >= 4) return;
    setVariants([
      ...variants,
      {
        name: "",
        size: "",
        unitPrice: "",
        strikePrice: "",
        thumbnail: null,
        enabled: true,
      },
    ]);
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const validateVariants = () => {
    let newErrors: Errors = {};
    variants.forEach((variant, index) => {
      const variantErrors: Partial<Record<keyof Variant, string>> = {};

      if (!variant.name.trim()) variantErrors.name = "Name is required";
      if (!variant.size.trim()) variantErrors.size = "Size is required";
      if (!variant.unitPrice.trim())
        variantErrors.unitPrice = "Unit price is required";
      else if (Number(variant.unitPrice) <= 0)
        variantErrors.unitPrice = "Unit price must be positive";

      if (!variant.strikePrice.trim())
        variantErrors.strikePrice = "Strike-through price is required";
      else if (Number(variant.strikePrice) <= 0)
        variantErrors.strikePrice = "Must be positive";

      if (!variant.thumbnail)
        variantErrors.thumbnail = "Thumbnail image is required";

      if (Object.keys(variantErrors).length > 0) {
        newErrors[index] = variantErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateVariants()) {
      console.log("✅ Variants valid", variants);
    }
  };

  return (
    <div className="max-w-5xl mt-4 p-6 min-h-screen">
      <div className="flex items-center gap-x-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Package />
          <span className="text-2xl font-semibold text-primary-black">
            Product Variants
          </span>
        </h2>
        <span className="text-gray-500 text-sm">
          (Up to 4 variants can be added)
        </span>
      </div>

      {variants.length === 0 && (
        <div>

        <div className="flex flex-col items-center justify-center py-12 border rounded-lg p-4 bg-white mt-4">
          <p className="text-gray-500 mb-4">
            You haven’t added any product variants yet. Start by clicking ‘Add
            Variant’.
          </p>
          <Button
            onClick={addVariant}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            + Add Variants
          </Button>
        </div>
           <div className="flex justify-between mt-6">
            <Button variant={'outline'} className=" border-[#CBD5E1] px-14 text-primary-black bg-transparent ">Back</Button>
            <Button
              onClick={handleSave}
              className=" bg-primary-blue px-14 text-white "
            >
              Skip
            </Button>
          </div>
        </div>
      )}

      {variants.length > 0 && (
        <div className="mt-4 space-y-4">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Variant {index + 1}</h3>
                <Button
                  size={"icon"}
                  variant={"link"}
                  onClick={() => removeVariant(index)}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Name */}
                <div>
                  <Label className="block text-sm font-medium text-primary-black mb-1">
                    Name
                  </Label>
                  <Input
                    type="text"
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(index, "name", e.target.value)
                    }
                    className="border rounded p-2 w-full"
                  />
                  {errors[index]?.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[index]?.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="block text-sm font-medium text-primary-black mb-1">
                    Size
                  </Label>
                  <Input
                    type="text"
                    value={variant.size}
                    onChange={(e) =>
                      updateVariant(index, "size", e.target.value)
                    }
                    className="border rounded p-2 w-full"
                  />
                  {errors[index]?.size && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[index]?.size}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="block text-sm font-medium text-primary-black mb-1">
                    Unit Price *
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                      ₹
                    </span>
                    <Input
                      type="number"
                      value={variant.unitPrice}
                      onChange={(e) =>
                        updateVariant(index, "unitPrice", e.target.value)
                      }
                      className="border rounded pl-7 w-full"
                    />
                  </div>
                  {errors[index]?.unitPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[index]?.unitPrice}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="block text-sm font-medium text-primary-black mb-1">
                    Strike-through Price *
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                      ₹
                    </span>
                    <Input
                      type="number"
                      value={variant.strikePrice}
                      onChange={(e) =>
                        updateVariant(index, "strikePrice", e.target.value)
                      }
                      className="border rounded pl-7 w-full"
                    />
                  </div>
                  {errors[index]?.strikePrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[index]?.strikePrice}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Thumbnail *</Label>
                  {!variant.thumbnail ? (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "thumbnail",
                          e.target.files?.[0] || null
                        )
                      }
                    />
                  ) : (
                    <div className="relative w-36 h-24 mt-1">
                      <img
                        src={URL.createObjectURL(variant.thumbnail)}
                        alt="Thumbnail preview"
                        className="w-full h-full object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={() => updateVariant(index, "thumbnail", null)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {errors[index]?.thumbnail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[index]?.thumbnail}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Checkbox
                  className="rounded"
                  checked={variant.enabled}
                  onCheckedChange={(checked) =>
                    updateVariant(index, "enabled", Boolean(checked))
                  }
                  id={`enabled-${index}`}
                />
                <Label
                  htmlFor={`enabled-${index}`}
                  className="cursor-pointer text-primary-black"
                >
                  Enable this Variant
                </Label>
              </div>
            </div>
          ))}

          {variants.length < 4 && (
            <Button
              onClick={addVariant}
              className="bg-primary-blue text-white hover:bg-blue-700"
            >
              + Add Variants
            </Button>
          )}

          <div className="flex justify-between mt-6">
            <Button variant={'outline'} className="px-14 bg-transparent border border-[#CBD5E1] text-primary-black ">Back</Button>
            <Button
              onClick={handleSave}
              className="px-14 bg-primary-blue text-white"
            >
              Save & Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
