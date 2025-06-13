import { ASSETS } from "@/assets/assets"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function SignIn() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-1/3 border-none shadow-md rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
              <img src={ASSETS.LOGO_WITH_NAME} alt="logo" />
          </CardTitle>
          <CardDescription className="text-xl font-semibold">
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" placeholder="********" required />
            </div>

            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline text-primary-blue float-end"
            >
              Forgot your password?
            </a>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn