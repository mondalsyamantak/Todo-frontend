import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
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

import { Label } from "@radix-ui/react-dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar29 } from "@/otherComponents/CustomCalendar";

// import { useUser } from "@/UserContext";
import { parseDate } from "chrono-node";
import { Toaster, toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsDown, ChevronsUp, Pencil } from "lucide-react";

function formatDate(date) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function AllTasks() {
    const location = useLocation();
    const [opened, setOpened] = useState()

    // const {user, setUser} = useUser();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const url = import.meta.env.VITE_BACKEND_URL;


    //calendar variables: state lifted from calendar29
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("In 2 days")
    const [date, setDate] = useState(
      parseDate(value) || undefined
    )
    const [month, setMonth] = useState(date)

    //to force reload:
    const [keyValue, setKeyValue] = useState(0)
    
    //to show "login successful" toast
    useEffect(() => {
      if(location.state) {
        toast.message(location.state?.message)
      } else {
        console.log(location)
      }
    }, [])
    //to get the tasks from the database
    useEffect(() => {

        

        const fetchAllTasks = async () => {

            //console.log(url)
            try {
                //this endpoint should return user data if authenticated
                const res = await fetch(`${url}/api/tasks/all-tasks`, {
                    method: 'POST',
                    credentials: 'include', // sends cookies
                    body: JSON.stringify({ demand: "all"}),
                });

                if (res.ok) {
                    const data = await res.json().then((data) => data.data);
                    setData(data); //data contains list of tasks
                    //console.log("Finalised data: ", data)
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

        fetchAllTasks();
    //}, [navigate]);
    }, [navigate]);

    const handleUndo = async(title, description, date) => {

      const res = await fetch(`${url}/api/tasks/create`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          title, description, dueDate: date
        }),
        headers: {
          "Content-Type": "application/json",
        }

      })
      const tasksData = await res.json()
      if (res.ok) {
      
        // console.log(tasksData.data)
        navigate("#")
        setData(tasksData.data)
        toast.success("Undo successful")
      } else {
        toast.error("Something went wrong")
      }

    }

    const handleSubmit = async(e) => {
      console.log("reached")
      e.preventDefault();
      const formData = new FormData(e.target);
      const title = formData.get("title");
      const description = formData.get("description");

      const res = await fetch(`${url}/api/tasks/create`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            title, description, dueDate: date
          }),
          headers: {
            "Content-Type": "application/json",
          }

      })
      const tasksData = await res.json()
      if (res.ok) {
        
        // console.log(tasksData.data)
        navigate("#")
        setData(tasksData.data)
        toast.success("Task created successfully")
      }
      else {
        toast.error(tasksData.message || "Unknown error")
      }
      
      
    }

    const handleChecked = async(task, e) => {
      console.log("something checked: ", e, task)
      try {
        //this endpoint should return user data if authenticated
        const res = await fetch(`${url}/api/tasks/delete`, {
            method: 'POST',
            credentials: 'include', // sends cookies
            body: JSON.stringify({ id: task._id}),
            headers: {  
              'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            const data = await res.json().then((data) => data.data);
            setData(data);
            //console.log("Finalised data: ", data)
            toast.success('Task completed', {
              action: {
                label: 'Undo',
                onClick: () => handleUndo(task.title, task.description, task.dueDate)
              },
            })
            setLoading(false);
        } else {
            // Unauthorized or server error
            toast.error("Something went wrong")
            navigate('/');
        }
    } catch (err) {
        console.error('Error verifying auth:', err);
        navigate('/login');
    }
    }


    if (loading) return <div className="flex justify-center items-center">Loading...</div>;


   

    return(
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
                <BreadcrumbLink href="#">
                  Todo List
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>All Tasks</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {
            // data.map((task, index) => (
            //     <div key={index} className="p-4 border-b">
            //         <h2 className="text-lg font-semibold">{task.title}</h2>
            //         {/* <p className="text-sm text-gray-600">{task.description}</p>
            //         <p className="text-xs text-gray-400">Due: {task.dueDate}</p> */}
            //     </div>
            // ))

            data.map((task) => (
              <Collapsible open={opened} onOpenChange = {setOpened}>
              <CollapsibleTrigger asChild>
                <Label key={task._id} className="m-3 hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                  <Checkbox
                    id="toggle-2"
                  // defaultChecked
                  // checked = {data.includes(task._id)}
                    onCheckedChange = {(e) => handleChecked(task, e)}
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                      {task.title}
                    </p>  
                  </div>
                
                  <Button variant="ghost" size="icon" className="size-auto ml-auto">
                    { (opened)? <ChevronsUp/> : <ChevronsDown/>}
                    <span className="sr-only">Toggle</span>
                  </Button>
               
                
                </Label>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-2">
                  <div className="rounded-md mx-3 border flex flex-col bg-amber-100 px-4 py-2 font-mono text-sm">
                  <p className="m-2 text-sm">
                    <l className="font-bold">Description: </l>
                    {task.description || "No description provided."}
                  </p>
                  <p className="m-2 text-sm">
                    <l className="font-bold">Due date: </l>
                    {formatDate(new Date(task.dueDate)) || "No date provided."} 
                  </p>
                  <Button variant="outline" className="ml-auto cursor-pointer"><Pencil/></Button>
                  </div>
                  
                </CollapsibleContent>
              </Collapsible>
            ))
        }
        <Dialog>
      {/* <form onSubmit={handleSubmit}>   */}
        <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="p-0 m-0">
          <DialogHeader>
            <DialogTitle className="text-center">New Task</DialogTitle>
            <DialogDescription>
              Add a task with a valid title, description, and due date.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 my-4">

            <div className="grid gap-1">
              <Label htmlFor="title-1">Title</Label>
              <Input id="title-1" name="title" placeholder="Add a title" />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="description-1">Description</Label>
              <Textarea id="description-1" name="description" placeholder="Add a short description"/>
            </div>

            <div className="grid gap-1 mb-4">
              <Calendar29
                open={open}
                setOpen={setOpen}
                value={value}
                setValue={setValue}
                date={date}
                setDate={setDate}
              />
            </div>
            
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" className="cursor-pointer">Add task</Button>
            </DialogClose>
          </DialogFooter>
        </form>
        </DialogContent>
        <DialogTrigger asChild>
          <div className="flex w-full justify-center p-3">
          <Button className="w-full max-w-200 gap-3 mt-0 cursor-pointer" type="button">Add More Tasks</Button>
          </div>  
        </DialogTrigger>
      {/* </form> */}
    </Dialog>
        
      </SidebarInset>
    )
}

export default AllTasks

{<Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
  <Checkbox
    id="toggle-2"
    defaultChecked
    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
  />
  <div className="grid gap-1.5 font-normal">
    <p className="text-sm leading-none font-medium">
      Enable notifications
    </p>
    <p className="text-muted-foreground text-sm">
      You can enable or disable notifications at any time.
    </p>
  </div>
</Label>}