import { ASSETS } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AuthContext";
import { setAuthToken, signin } from "@/lib/apis";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function SignIn() {
  const navigate = useNavigate();
  const { setAuth } = useAppContext();
  const { handleSubmit, register } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: signin,
    onSuccess: (data) => {
      const { firstname, lastname, email, role, token } = data.data;
      setAuth({ token, firstname, lastname, email, role });

      navigate("/", { replace: true });
      toast.success("Request Success", {
        description: "Signed Successfully",
      });
      setAuthToken(token);
    },
    onError: (error: AxiosError<any>) => {
      toast.error("Error", {
        description: error?.response?.data?.message,
      });
    },
  });

  const submit = (data: any) => {
    mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-1/3 border-none shadow-md rounded-2xl">
        <CardHeader className="text-center grid place-items-center">
          <CardTitle className="flex items-center justify-center w-40" >
            <img src={ASSETS.LOGO} alt="logo" />
          </CardTitle>
          <CardDescription className="text-xl font-semibold">
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit)} className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                disabled={isPending}
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                {...register("email")}
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                disabled={isPending}
                id="password"
                type="password"
                placeholder="********"
                required
                {...register("password")}
              />
            </div>

            <span
              onClick={() => {
                navigate("/forgot-password");
              }}
              className="ml-auto cursor-pointer text-sm underline-offset-4 hover:underline text-primary-blue float-end"
            >
              Forgot your password?
            </span>

            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignIn;
