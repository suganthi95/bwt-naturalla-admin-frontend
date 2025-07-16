import { CloudUpload, Edit, LoaderCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBanner, updateBanner } from "@/lib/apis";
import { useAppContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
  type: "add" | "edit";
  defaultData?: any;
}

function BannerForm({ type, defaultData }: Props) {
  const { auth } = useAppContext();
  const [open, setOpen] = useState(false);
  const [publish, setPublish] = useState(false);
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      type: "",
      ctaLink: "",
      bannerImage: null,
      bannerImageId: null,
      id: null,
    },
  });

  useEffect(() => {
    if (type === "edit") {
      reset(defaultData);
      setPublish(defaultData.publish);
    }
  }, [type, defaultData]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["addBanner"],
    mutationFn: addBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllBanners"] });
      toast.success("Request Success", {
        description: "Banner Image added successfully",
      });
      setOpen(false);
      reset();
    },
    onError: (error: AxiosError<any>) => {
      toast.error("Request Failed", { description: error?.response?.data });
    },
  });

  const { mutate: updateBannerMutate, isPending: isPendingUpdateBanner } =
    useMutation({
      mutationKey: ["updateBanner"],
      mutationFn: updateBanner,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllBanners"] });
        toast.success("Request Success", {
          description: "Banner Image updated successfully",
        });
        setOpen(false);
        reset();
      },
      onError: (error: AxiosError<any>) => {
        toast.error("Request Failed", { description: error?.response?.data });
      },
    });

  const onSubmit = handleSubmit((data) => {
    if (type === "add") {
      mutate({
        token: auth?.token as string,
        title: data.title,
        type: data.type,
        bannerImage: data.bannerImage as any,
        publish: publish,
        ctaLink: data.ctaLink,
      });
    } else {
      updateBannerMutate({
        token: auth?.token as string,
        title: data.title,
        type: data.type,
        bannerImage: data.bannerImage as any,
        publish: publish,
        ctaLink: data.ctaLink,
        id: data.id as any,
        bannerImageId: data.bannerImageId as any,
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "add" ? (
          <Button>Add Banner</Button>
        ) : (
          <Button
            size="icon"
            className="h-8 w-8 rounded-full text-[#34C759] bg-[#34C759]/10 hover:bg-[#34C7591A]/20"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "add" ? "Add New Banner" : "Edit Banner"}
          </DialogTitle>
          <form>
            <div className="grid grid-cols-2 gap-5">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter Title"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("type", value)
                  }
                  defaultValue={watch("type")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select CTA Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webapp">Web App</SelectItem>
                    <SelectItem value="mobileapp">Mobile App</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-1">
              <Label htmlFor="cta">CTA Link</Label>
              <Input
                id="cta"
                placeholder="Enter CTA Link"
                {...register("ctaLink", {
                  required: "CTA Link is required",
                })}
              />
              {errors.ctaLink && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.ctaLink.message}
                </p>
              )}
            </div>

            <div className="mt-1">
              {/* <Label htmlFor="bannerImage">Banner Image</Label> */}
              <Label
                htmlFor="bannerImage"
                className="text-sm font-semibold text-gray-700"
              >
                Banner Image{" "}
                <span className="block text-xs text-muted-foreground mt-1">
                  Recommended size: 1920 × 600 px (JPG, PNG, or WebP). Max size:
                  500 KB.
                </span>
              </Label>

              {watch("bannerImage") !== null ? (
                <div className="relative my-4">
                  <Button
                    onClick={() => setValue("bannerImage", null)}
                    type="button"
                    variant="destructive"
                    className="absolute z-[10] p-0 h-5 w-5 rounded-full -top-2 -right-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="rounded-lg w-full h-[200px] overflow-hidden border">
                    {typeof watch("bannerImage") === "string" && (
                      <img
                        className="h-full w-full object-cover"
                        src={watch("bannerImage") as any}
                        alt="bannerImage"
                      />
                    )}
                    {(watch("bannerImage") as any) instanceof FileList && (
                      <img
                        className="h-full w-full object-cover"
                        src={URL.createObjectURL(
                          watch("bannerImage" as any)[0]
                        )}
                        alt="bannerImage"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <Label
                  htmlFor="bannerImage"
                  className="flex flex-col gap-2 items-center justify-center border-dashed border-[2px] border-slate-400 rounded-lg p-6 my-4 h-[200px] cursor-pointer"
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
                    id="bannerImage"
                    className="hidden"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    {...register("bannerImage", {
                      required: {
                        value: true,
                        message: "Banner Image is required",
                      },
                      validate: (file: any) => {
                        // console.log(file[0].size)

                        if (file[0]?.size > 1024 * 1024 * 1) {
                          return "Banner Image must be less than 5 MB";
                        }
                      },
                    })}
                  />
                </Label>
              )}

              {errors.bannerImage && (
                <p className="text-sm text-red-500 mt-1">
                  {errors?.bannerImage?.message as string}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={publish}
                onCheckedChange={setPublish}
                id="published"
              />{" "}
              <Label
                className="cursor-pointer text-slate-500"
                htmlFor="published"
              >
                Publish
              </Label>
            </div>
          </form>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={isPending || isPendingUpdateBanner}
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={isPending || isPendingUpdateBanner}
              onClick={onSubmit}
            >
              {isPending || isPendingUpdateBanner ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                "Save Banner"
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BannerForm;
