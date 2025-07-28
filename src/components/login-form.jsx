import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { use, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Toaster, toast } from "sonner"
import { RefreshCcw } from "lucide-react"

export function LoginForm({
  className,
  ...props
}) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loadingLogin, setLoadingLogin] = useState(false)

  const navigate = useNavigate();

  const url = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit =  async (e) => {
    e.preventDefault()
    setLoadingLogin(true)
    // authentication logic here

    //form object:
    const formData = new FormData(e.target)

    try {
      const res = await fetch(`${url}/api/users/login`, {
        method: "POST",
        credentials: "include",
        // body: formData //why do i need to stringify? because requests are always sent as strings
        headers: {
          "Content-Type": "application/json"
        },
        
        body: JSON.stringify({
          email,
          password
        })
      }).catch((error)=> {
        setLoadingLogin(false)
        toast.error("Network error")
      })

      const data = await res.json()
      if (res.ok) {
        // console.log("Login successful:", data)
        // toast.success("Login successful")
        // Redirect to dashboard or perform other actions
        navigate("/", {
          state: {
            message: "Login successful"
          }
        })
      } else {
        // console.log("reached2")
        console.log("Login failed:", data)
        toast.error(data.message || "Login failed")
        setLoadingLogin(false)
      }
      

    } catch (error) {
      console.log("Error during login:", error)
      toast.error(error.message)
    }



  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Toaster richColors/>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your <l className = "text-red-600">DeepFocus</l> account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)}  />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" name="password" onChange={(e) => setPassword(e.target.value)}  />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                {loadingLogin ? (
                  <RefreshCcw className="animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://i.pinimg.com/736x/c1/be/17/c1be17338f5e3224ff3869ca86219d80.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[1.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
