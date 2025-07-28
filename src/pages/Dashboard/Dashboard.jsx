import axios from "axios"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { useUser } from "@/contextApis/UserContext";
import { Toaster, toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

function Dashboard() {
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const {user, setUser} = useUser()
    const navigate = useNavigate();

    // //to show toast message (written by chatgpt)
    useEffect(() => {
      if(location.state?.message) {
        toast.success(location.state.message)
        setTimeout(() => {
          navigate(location.pathname, { replace: true, state: {} });
        }, 1500); //else the message was being replaced without even being toasted
      }
    });

    useEffect(() => {

        const checkAuth = async () => {
            try {
                //this endpoint should return user data if authenticated
                const res = await fetch("http://localhost:8000/api/users/auth", {
                    method: 'GET',
                    credentials: 'include', // sends cookies
                });

                if (res.ok) {
                    const data = await res.json();
                    //console.log(data.data)
                    setUser(data.data) 
                    //console.log("Dashboard.jsx user: ", user)
                    
                    // Optional: set user info if needed
                    setLoading(false);
                } else {
                    // Unauthorized or server error
                    navigate('/login');
                }
            } catch (err) {
                console.error('Error verifying auth:', err);
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);

    // useEffect(() => {
    //   console.log("Dash user: ", user)
    // }, [user])

    if (loading) return (
      <div className="flex justify-center items-start h-screen w-screen">
      <Skeleton className=" w-[50%] h-[90%] rounded-2xl m-4 mr-0" />
      <div className="flex flex-col items-center w-full m-4 ">
        <Skeleton className=" w-full h-15 rounded-2xl" />
        <Skeleton className="m-3 w-full h-80 rounded-2xl" />

      </div>      
    </div>
    )

    

    
    
    
    //userdata is contained in {userdata} 
    return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="block">

      <Toaster richColors/>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">
                {["/", "/today"].some((field) => field?.trim() === location.pathname)? "Home" : "Other"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{
                  (location.pathname === "/")? "All tasks" : 
                    (location.pathname === "/today")? "Today's tasks" : 
                      (location.pathname === "/tomorrow")? "Tomorrow's tasks" :
                        (location.pathname === "/this-month")? "This month's tasks" : 
                          (location.pathname === "/account")? "Account" : "Unknown"
                }</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto"><ModeToggle/></div>
         
          
        </header>

        <Outlet/>
      </SidebarInset>
      
    </SidebarProvider>
  );
}
  
export default Dashboard


{/* <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div> */}
        //this content was below <header> inside SidebarInset