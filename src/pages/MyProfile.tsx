import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Icons } from "@/assets/icons";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/lib/apis";
import { toast } from "sonner";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@radix-ui/react-switch";
import { useNavigate } from "react-router-dom";
import { ASSETS } from "@/assets/assets";


const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid Indian phone number"),
      currentPassword: z.string().nonempty( "Current Password is required"),

    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;

export default function MyProfile() {
  const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate()
  const queryClinet = useQueryClient()
  // const { mutate, isPending } = useMutation({
  //   mutationKey: ["createuser"],
  //   mutationFn: (data: FormValues) => {
  //     return createUser({
  //       first_name: data.firstName,
  //       last_name: data.lastName,
  //       email: data.email,
  //       phone_no: Number(data.phone),
  //       role: data.role,
  //     });
  //   },
  //   onSuccess(data) {
  //     toast.success(data?.data?.message);
  //     queryClinet.invalidateQueries({queryKey:['getusers']})

  //   },
  //   onError: (error) => {
  //     if (axios.isAxiosError(error)) {
  //       toast.error(error?.response?.data?.message);
  //     }
  //   },
  // });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('data: ', data);
    // mutate(data);
  };

  return (
        <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-auto  md:pb-20 bg-slate-100">
 <div className="flex items-center gap-x-2 cursor-pointer" onClick={()=>navigate('/dashboard')}>
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
        <img src={ASSETS.USER} alt="user" className=" w-36 rounded-full" />
        <div className="bg-white p-2 absolute top-24 left-24 rounded-full">
         <Icons.Camera className="w-6 h-6"/>

        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-primary-black font-semibold">First Name</Label>
          <Input
            placeholder="John"
            className={` ${errors.phone ? "border-red-500" : "border-border"}`}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label className="text-primary-black font-semibold">Last Name</Label>
          <Input
            placeholder="Doe"
            className={` ${errors.phone ? "border-red-500" : "border-border"}`}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <Label className="text-primary-black font-semibold">Email</Label>
          <Input
            placeholder="example@gmail.com"
            className={` ${errors.phone ? "border-red-500" : "border-border"}`}
            {...register("email")}
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
              type="tel"
              placeholder="Enter phone number"
              className="border-none p-0 focus:ring-0 bg-transparent  !h-10 focus-visible:ring-0 focus:outline-none "
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>
      </div>

       <div className="relative">
        <Label className="text-primary-black font-semibold">Current Password</Label>
        <Input
          type={showCurrentPassword ? "text" : "password"}
          placeholder="******"
          className={`pr-10 ${
            errors.password ? "border-red-500" : "border-border"
          }`}
          {...register("currentPassword")}
        />
        <button
          type="button"
          onClick={() => setShowCurrentPassword(!showPassword)}
          className="absolute right-3 top-[35px] text-muted-foreground"
        >
          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors?.currentPassword?.message}</p>
        )}
      </div>

      <div className="relative">
        <Label className="text-primary-black font-semibold">Password</Label>
        <Input
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
      </div>

      <div className="relative">
        <Label className="text-primary-black font-semibold">
          Confirm Password
        </Label>
        <Input
          type={showConfirm ? "text" : "password"}
          placeholder="******"
          className={`pr-10 ${
            errors.confirmPassword ? "border-red-500" : "border-border"
          }`}
          {...register("confirmPassword")}
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-[35px] text-muted-foreground"
        >
          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            
          }}
        >
          Cancel
        </Button>
        <Button type="submit"
        //  disabled={isPending}
         >
          {!true ? <Loader2 className="animate-spin" /> : "Save Changes"}
        </Button>
      </div>
    </form>
    </div>
  );
}
