import { ASSETS } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useResetPassword,
  useVerifyForgotPasswordToken,
} from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

const passwordRequirements =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]).{6,}$/;

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .regex(passwordRequirements, {
        message:
          "Password must include upper and lower case letters, a number, and a special character.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;
export default function ResetPassword() {
  const navigate = useNavigate();
  const params = useParams();
  const { token } = params || {};
  const { data, isError, error } = useVerifyForgotPasswordToken(token ?? "");
  const { mutate, isPending } = useResetPassword();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  if (data?.data?.status === false || isError) {
    navigate("/login");
    if (isAxiosError(error)) {
      toast.warning(error?.response?.data?.message);
    }
  }
  const onSubmit = (values: FormValues) => {
    if (data?.status) {
      mutate(
        { password: values.password, token: token ?? "" },
        {
          onSuccess: (data:any) => {
            toast.success(data?.message);
            navigate("/password-updated");
          },
        }
      );
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F7F7F7] ">
      <div className="  md:w-[500px] p-6 space-y-6 shadow-2xl bg-white rounded-xl">
        <div className=" flex items-center justify-center gap-x-1.5">
  <div className="flex items-center justify-center">
              <img src={ASSETS.LOGO_WITH_NAME} alt="logo" />
          </div>        
        </div>
        <div className="grid place-items-center">
          <p className="text-xl font-bold">ResetPassword</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                const [showPassword, setShowPassword] = useState(false);

                return (
                  <FormItem>
                    <FormLabel className="text-textPrimary font-semibold">
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="h-11 pr-10"
                          placeholder="••••••"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => {
                const [showPassword, setShowPassword] = useState(false);

                return (
                  <FormItem>
                    <FormLabel className="text-textPrimary font-semibold">
                      Confirm Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="h-11"
                          placeholder="••••••"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button type="submit" className="w-full">
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <p className="fixed bottom-2.5 text-sm text-title">
        Copyrights © All Rights Reserved ® 2025 Naturalla Stores
      </p>
    </section>
  );
}
