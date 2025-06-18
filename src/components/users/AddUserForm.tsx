import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Icons } from "@/assets/icons";
import { Switch } from "../ui/switch";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  onClose: (val: boolean) => void;
}
const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid Indian phone number"),
    role: z.string().min(1, "Role is required"),
    isActive: z.boolean().default(true).optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;

export default function AddUserForm({ onClose }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    onClose(false)
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-4 px-6 space-y-6"
    >
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

      <div>
        <Label className="text-primary-black font-semibold">Role</Label>
        <Select onValueChange={(value) => setValue("role", value)}>
          <SelectTrigger
            className={` ${errors.phone ? "border-red-500" : "border-border"}`}
          >
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">User</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-red-500 text-sm">{errors.role.message}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={watch("isActive")}
          onCheckedChange={(val) => setValue("isActive", val)}
        />
        <Label htmlFor="status">
          {watch("isActive") ? "Active" : "Inactive"} Status
        </Label>
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
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Create User</Button>
      </div>
    </form>
  );
}
