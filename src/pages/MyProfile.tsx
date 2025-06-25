import { useForm } from "react-hook-form";
import * as z from "zod";

import { Icons } from "@/assets/icons";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/contexts/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/lib/apis";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UpdatePassword from "@/components/profile/UpdatePassword";

const formSchema = z.object({
  firstName: z.string({ required_error: "First name is required" }),
  lastName: z.string({ required_error: "Last name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .regex(/^[6-9]\d{9}$/, "Enter a valid Indian phone number"),
  // currentPassword: z.string().nonempty( "Current Password is required"),

  // password: z.string().min(6, "Password must be at least 6 characters"),
  // confirmPassword: z.string(),
});
// .refine((data) => data.password === data.confirmPassword, {
//   path: ["confirmPassword"],
//   message: "Passwords do not match",
// });

type FormValues = z.infer<typeof formSchema>;

export default function MyProfile() {
  const { auth } = useAppContext();
  const [Isopen, setIsopen] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  // const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  // const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getProfile"],
    queryFn: () => getProfile(auth?.token as string),
    retry: 3,
    refetchOnWindowFocus: false,
    select: (data) => data.data.data,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Request Success", {
        description: "Profile updated successfully",
      });
    },
    onError: (error: AxiosError<any>) => {
      console.log(error);
      toast.error("Request Failed", {
        description: error?.response?.data?.message,
      });
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone_no,
        // password: data.password
      });
    }
  }, [data, reset]);

  const onSubmit = (data: FormValues) => {
    mutate({
      email: data.email,
      firstname: data.firstName,
      lastname: data.lastName,
      phoneNumber: data.phone,
      token: auth?.token as string,
    });
  };

  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-auto  md:pb-20 bg-slate-100">
      <div
        className="flex items-center gap-x-2 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="text-[#4B5563]" />
        <div>
          <h1 className="text-[22px] font-bold">Profile Information</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-4 px-6 max-w-3xl   space-y-6"
      >
        <div className="relative">
          <Avatar className="h-36 w-36 shadow-sm">
            <AvatarImage src="" />
            <AvatarFallback className="bg-orange-400 text-white text-5xl">
              {auth?.firstname[0]}
            </AvatarFallback>
          </Avatar>
          {/* <div className="bg-white p-2 absolute top-24 left-24 rounded-full shadow">
         <Icons.Camera className="w-6 h-6"/>
        </div> */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-primary-black font-semibold">
              First Name
            </Label>
            <Input
              disabled={isLoading || isError || isPending}
              placeholder="John"
              className={` ${
                errors.firstName ? "border-red-500" : "border-border"
              }`}
              {...register("firstName", {
                required: {
                  value: true,
                  message: "Firstname is required",
                },
              })}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Label className="text-primary-black font-semibold">
              Last Name
            </Label>
            <Input
              disabled={isLoading || isError || isPending}
              placeholder="Doe"
              className={` ${
                errors.lastName ? "border-red-500" : "border-border"
              }`}
              {...register("lastName", {
                required: {
                  value: true,
                  message: "Lastname is required",
                },
              })}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
          <div>
            <Label className="text-primary-black font-semibold">Email</Label>
            <Input
              disabled={isLoading || isError || isPending}
              placeholder="example@gmail.com"
              className={` ${
                errors.email ? "border-red-500" : "border-border"
              }`}
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label className="text-primary-black font-semibold">Phone</Label>
            <div
              className={`flex items-center gap-2 border rounded-md h-10 px-3 shadow-sm ${
                errors.phone ? "border-red-500" : "border-border"
              }`}
            >
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Icons.India className="w-5 h-5" />
                <span>+91</span>
              </div>

              <div className="h-5 w-px bg-border" />

              <Input
                disabled={isLoading || isError || isPending}
                type="tel"
                placeholder="Enter phone number"
                className="border-none p-0 focus:ring-0 bg-transparent  !h-10 focus-visible:ring-0 focus:outline-none "
                {...register("phone", {
                  required: {
                    value: true,
                    message: "Phone number is required",
                  },
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* <div className="relative">
        <Label className="text-primary-black font-semibold">Password</Label>
        <Input
          disabled={isLoading || isError}
          type={showPassword ? "text" : "password"}
          placeholder="******"
          className={`pr-10 ${
            errors.password ? "border-red-500" : "border-border"
          }`}
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[35px] text-muted-foreground"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div> */}

        <div className="flex items-center justify-between">
          <Dialog open={Isopen} onOpenChange={setIsopen}>
            <DialogTrigger>
              <Button
                type="button"
                variant="outline"
                className=" border-none underline"
              >
                Change Password
              </Button>
            </DialogTrigger>
              <DialogContent className="[&>button]:hidden  !p-0 !max-w-xl">
              <DialogHeader className="bg-[#F5F5F5] p-3 px-6 rounded-lg items-center w-full flex flex-row  justify-between">
                <DialogTitle className=""> Update Password</DialogTitle>
                <DialogClose>
                <div
                  className="cursor-pointer"
                 
                >
                  <X className="w-6 h-6" />
                </div>

                </DialogClose>
              </DialogHeader>
              <UpdatePassword onClose={setIsopen}/>
            </DialogContent>
          </Dialog>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              disabled={isLoading || isError || isPending}
              type="button"
              variant="outline"
              onClick={() => {}}
            >
              Back
            </Button>
            <Button type="submit" disabled={isLoading || isError || isPending}>
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
