import { LoginForm } from "@/components/login-form"
import { useEffect, useRef, useState } from "react"
import { Toaster, toast } from "sonner"
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const hasShown = useRef(false);
  const location = useLocation();


  const navigate = useNavigate()
  useEffect(() => {
    if(location.state?.message) { 
      toast.success(location.state.message)
      setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 1500); //else the message was being replaced without even being toasted
    }
  });

  return (


    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 dark">
      <Toaster richColors/>
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm 
          // formData={formData}
          // setFormData={setFormData}
          // onSubmit={userAuthentication}
        />
      </div>
    </div>
  )
}