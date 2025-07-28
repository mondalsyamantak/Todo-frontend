import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contextApis/UserContext"
import { Check, CheckCheck, Delete, DeleteIcon, Mail, Pencil, Trash2, UserRoundCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Toaster, toast } from "sonner"

function Account() {
  const {user, setUser} = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const datafetch = async () => {
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
    }


    datafetch();
  })

  const handleSubmit = async(e) => {
    //console.log("reached")
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    

    const res = await fetch(`${url}/api/users/edit-user`, {
        method: "POST",
        credentials: "include", //includes cookies for verifyJWT to woirk
        body: JSON.stringify({
          username,
          fullName,
          email
        }),
        headers: {
          "Content-Type": "application/json",
        }

    })
    const userData = await res.json()
    if (res.ok) {
      
      // console.log(tasksData.data)
      navigate("/account")
      setUser(userData.data)

      toast.success("User updated successfully")
      console.log("success!!!")
    }
    else {
      toast.error(userData.message || "Unknown error")
    }
    
    
  }

  const handleDelete = async(e) => {
    e.preventDefault()
    const res = await fetch(`${url}/api/users/delete-user`, {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-type': 'application/json'
      },
    })
    .catch((err) => {
      console.log("Error occured while trying to delete user: ", err)
      toast.error("Error occured, please try again")
    })

    if (res.ok) {
      navigate("/login", {
        state: {
          message: "Account deleted successfully"
        }
      })
    }
  }

  if (loading) return (
    <div className="w-full flex flex-col items-center p-3">
      <div className="border rounded-2xl grow h-full items-center flex w-full flex-col p-3 ">
        <Skeleton className="border-green-500 border-2 h-20 w-20 m-3 rounded-full">
          
        </Skeleton>
        <Skeleton className="h-6 w-32 m-2" />
        <Skeleton className="h-4 w-48 m-2" />
        <Skeleton className="h-4 w-full m-2" />
        <Skeleton className="h-4 w-full m-2" />
        
      </div>
      <Skeleton className=" w-full h-85 rounded-2xl m-3 border-2" />
    </div>
  );

    
    return (
      <>
      <Toaster richColors/>
      <div className="w-full flex flex-col items-center p-3">
      <div className="border rounded-2xl grow h-full items-center flex w-full flex-col p-3 ">
        <Avatar className="border-green-500 border-2 h-20 w-20 m-3">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex-col flex items-center">
          <h1 className="font-bold">
           {user.fullName}
          </h1>
          <h2 className="">
            Productivity enthusiast
          </h2>
        </div>

        <div className="mt-6 w-full p-3 flex flex-col ">
          <div className="w-full flex items-center m-1"> 
            <UserRoundCheck/> 
            <p className="mx-3">Username: {user.username}</p>
          </div>
          <div className="w-full flex items-center m-1"> 
            <Mail/> 
            <p className="mx-3">Email: {user.email}</p>
          </div>
          <div className="w-full flex items-center m-1"> 
            <CheckCheck/> 
            <p className="mx-3">Tasks remaining to complete: {user.todoList.length}</p>
          </div>
          <Dialog>
        <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="p-0 m-0">
          <DialogHeader>
            <DialogTitle className="text-center">Edit Profile</DialogTitle>
            <DialogDescription>
              Edit your profile
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 my-4">

            <div className="grid gap-1">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" placeholder="Edit username" autoComplete="off" defaultValue={user.username} />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="fullName-1">Full Name</Label>
              <Input id="fullName-1" name="fullName" placeholder="Edit your display name" autoComplete="off" defaultValue={user.fullName}/>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="email-1">Email</Label>
              <Input id="email-1" name="email" placeholder="Edit your email" autoComplete="off" defaultValue={user.email}/>
            </div>
            
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" className="cursor-pointer">Submit</Button>
            </DialogClose>
          </DialogFooter>
        </form>
        </DialogContent>
        <DialogTrigger asChild>
        <Button className="ml-auto mt-5" type="button"><Pencil/>Edit</Button>  
        </DialogTrigger>
    </Dialog>
          
        </div>
        </div>
        <div className="border rounded-2xl grow h-full items-center flex w-full flex-col m-3 p-5">
        <h1 className="font-bold mb-5">About Me</h1>
        <div className="flex flex-col">
        <p>
        If you need to change the code in sidebar.tsx, you are encouraged to do so. The code is yours. Use sidebar.tsx as a starting point and build your own.

In the next sections, we'll go over each component and how to use them.
SidebarProvider

The SidebarProvider component is used to provide the sidebar context to the Sidebar component. You should always wrap your application in a SidebarProvider component.
Props

        </p>
        <Button className="ml-auto mt-5"><Pencil/></Button>
      </div>
        </div>
        <AlertDialog >
              <AlertDialogTrigger asChild className="w-full">
              {/* <div className="border rounded-2xl grow h-full items-center flex w-full flex-col m-3 p-5">
                <Button> Delete </Button>
              </div> */}
              <Button className="text-red-500 m-3" variant="outline"> <Trash2/> Delete account</Button>
                
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-500">Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone, are you absolutely sure you want to permanently delete this account?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="cursor-pointer">Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        
      </div>
      </>
    )
  }
  
  export default Account