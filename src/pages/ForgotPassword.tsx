import { ASSETS } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type FormValues = z.infer<typeof formSchema>;
export default function ForgotPassword() {
  const navigate = useNavigate();
  const { mutate, isPending } = useForgotPassword();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values.email, {
      onSuccess: (data: any) => {
        toast.success(data?.data?.message);
        navigate("/open-mail", { state: { email: values.email } });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(error?.response?.data?.message);
        }
      },
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F7F7F7] ">
      <div className="  md:w-[500px] p-6 space-y-6 shadow-2xl bg-white rounded-xl">
        <div className=" flex items-center justify-center gap-x-1.5">
          <CardTitle className="flex items-center justify-center">
            <img src={ASSETS.LOGO_WITH_NAME} alt="logo" />
          </CardTitle>{" "}
          {/* <h1 className="text-2xl  text-primary roundica">naturalla</h1> */}
        </div>
        <div className="grid place-items-center">
          <p className="text-xl font-bold"> Forgot Password!</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-textPrimary font-semibold ">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input className="h-11" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isPending ? <Loader2 className="animate-spin" /> : "Continue"}
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
