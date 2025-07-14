import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/lib/apis";
import { useAppContext } from "@/contexts/AuthContext";
import axios from "axios";

const formSchema = z
  .object({
    currentPassword: z.string().nonempty("Current password is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;
interface Props {
  onClose: (val: boolean) => void;
}
export default function UpdatePassword({ onClose }: Props) {
  const { auth } = useAppContext();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate ,isPending} = useMutation({
    mutationKey: ["updatepassword"],
    mutationFn: (args: {
      token: string;
      user_password: string;
      new_password: string;
    }) => updatePassword(args.token, args.user_password, args.new_password),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    mutate(
      {
        token: auth?.token ?? "",
        user_password: data.currentPassword,
        new_password: data.password,
      },
      {
        onSuccess: () => {
          onClose(false);
          toast.success("Password changed successfully!");
          reset();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(error?.response?.data?.message);
          }
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 max-w-2xl space-y-6 rounded-md shadow"
    >
      <div className="relative">
        <Label className="text-sm font-medium text-gray-700">
          Current Password
        </Label>
        <Input
          type={showCurrentPassword ? "text" : "password"}
          placeholder="Enter current password"
          {...register("currentPassword")}
          className={errors.currentPassword ? "border-red-500" : ""}
        />
           <button
          type="button"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          className="absolute right-3 top-9 text-muted-foreground"
        >
          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.currentPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="relative">
        <Label className="text-sm font-medium text-gray-700">
          New Password
        </Label>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter new password"
          {...register("password")}
          className={errors.password ? "border-red-500" : ""}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="relative">
        <Label className="text-sm font-medium text-gray-700">
          Confirm Password
        </Label>
        <Input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm new password"
          {...register("confirmPassword")}
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-9 text-muted-foreground"
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
        <Button type="submit" disabled={isPending}> {isPending ? <Loader2 className="animate-spin"/> : "Change Password"}</Button>
      </div>
    </form>
  );
}
