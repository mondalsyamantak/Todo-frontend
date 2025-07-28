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
import { Calendar, ChevronsDown, ChevronsDownUp, ChevronsUp, Pencil } from "lucide-react";
import { useUser } from "@/contextApis/UserContext";
import Loading from "@/otherComponents/Loading";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge";

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
    const today = new Date();

    const {user, setUser} = useUser();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const url = import.meta.env.VITE_BACKEND_URL;


    //calendar variables: state lifted from calendar29
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("Today")
    const [date, setDate] = useState(
      parseDate(value) || undefined
    )
    const [month, setMonth] = useState(date)

    const [priority, setPriority] = useState("Low")
    
    //to get the tasks from the database
    useEffect(() => {
        const fetchAllTasks = async () => {

            //console.log(url)
            try {
                //this endpoint should return user data if authenticated
                //console.log("frontend ", location.pathname)
                const res = await fetch(`${url}/api/tasks/all-tasks/`, {
                    method: 'POST',
                    credentials: 'include', // sends cookies
                    body: JSON.stringify({ location: location.pathname, userId: user._id}),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                }).catch((err) => {
                  toast.error(err.message)
                  console.log(err)
                })

                if (res.ok) {
                    const data = await res.json().then((data) => data.data);
                    setData(data); //data contains list of tasks
                    //console.log("Finalised data: ", data)
                    setLoading(false);
                } else {
                    const data = await res.json()
                    toast.error(data.message || "Something went wrong")
                    console.log(data)
                }


            } catch (err) {
                console.log('Error verifying auth:', err);
                // navigate('/login');
            }
        };

        fetchAllTasks();
    //}, [navigate]);
    }, [navigate]);

    const handleUndo = async(title, description, date, priority) => {

      const res = await fetch(`${url}/api/tasks/create`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          title, description, dueDate: date, priority, userId: user._id
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
      //console.log("reached")
      e.preventDefault();
      const formData = new FormData(e.target);
      const title = formData.get("title");
      const description = formData.get("description");

      const res = await fetch(`${url}/api/tasks/create`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            title, description, dueDate: date, priority, userId: user._id, location: location.pathname
          }),
          headers: {
            "Content-Type": "application/json",
          }

      })
      const tasksData = await res.json()
      if (res.ok) {
        
        // console.log(tasksData.data)
        // navigate("/")
        setData(tasksData.data)
        toast.success("Task created successfully")
      }
      else {
        toast.error(tasksData.message || "Unknown error")
      }
      
      
    }

    const handleEdit = async(task, e) => {
      //console.log("reached")
      e.preventDefault();
      const formData = new FormData(e.target);
      const title = formData.get("title");
      const description = formData.get("description");

      

      const res = await fetch(`${url}/api/tasks/edit-task`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            id: task._id, location: location.pathname,
            title, description, dueDate: date, priority, userId: user._id
          }),
          headers: {
            "Content-Type": "application/json",
          }

      })
      
      const tasksData = await res.json()
      if (res.ok) {
        //console.log(tasksData)
        setData(tasksData.data)
        toast.success("Task updated successfully")
      }
      else {
        toast.error(tasksData.message || "Unknown error")
      } 
      
      
    }

    const handleChecked = async(task, e) => {
      try {
        //this endpoint should return user data if authenticated
        const res = await fetch(`${url}/api/tasks/delete`, {
            method: 'POST',
            credentials: 'include', // sends cookies
            body: JSON.stringify({ id: task._id, userId: user._id, location: location.pathname}),
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
                onClick: () => handleUndo(task.title, task.description, task.dueDate, task.priority),
              },
            })
            setLoading(false);
        } else {
            // Unauthorized or server error
            const err = await res.json();
            console.log("error: ", err)
            toast.error("Something went wrong")
            navigate('/');
        }
    } catch (err) {
        console.error('Error verifying auth:', err);
        navigate('/login');
    }
    }


    if (loading) return (
      <div className="flex justify-center items-start h-screen w-full">
        <div className="flex flex-col items-center w-full m-4">
          <Skeleton className=" w-full h-25 rounded-2xl " />
          <Skeleton className="m-3 w-full h-25 rounded-2xl " />
        </div> 
             
      </div>
    )


   

    return(
       <div>
          {
            data.map((task) => (
              <Collapsible >
                <Label key={task._id} className="mt-3 mx-3 hover:bg-accent/50 flex flex-row flex-wrap items-center justify-center gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                  <Checkbox
                    id="toggle-2"
                  // defaultChecked
                  // checked = {data.includes(task._id)}
                    onCheckedChange = {(e) => handleChecked(task, e)}
                    className="cursor-pointer data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <div className="grid font-sans">
                    <p className="text-sm leading-none font-medium ">
                      {task.title} 
                    </p>  
                  </div>
                  <Badge className="ml-2 text-[0.6rem]" style={{backgroundColor: 
                    (task.priority === "High") ? "#ff0000" :
                    (task.priority === "Medium") ? "#ffa500" :
                    (task.priority === "Low") ? "#008000" : "#808080"
                  }}>{task.priority}</Badge>
                  <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-auto ml-auto w-30">
                    {/* { (opened)? <ChevronsUp/> : <ChevronsDown/>} */}
                    <ChevronsDownUp className=""/>
                    <span className="sr-only">Toggle</span>
                  </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col gap-2 w-full mt-2">
                  <div className="rounded-md mx-0 border-0 flex flex-col px-0 py-0 font-mono text-sm">
                  <p className="m-2 text-sm">
                    {/* <l className="font-bold">Description: </l> */}
                    {task.description || "No description provided."}
                  </p>
                  <p className="m-2 text-sm flex items-end">
                    {/* <l className="font-bold">Due date: </l> */}
                    <Calendar className="mr-4"/>
                    {formatDate(new Date(task.dueDate)) || "No date provided."} 
                  </p>
                  <Dialog>
                    <DialogTrigger className="ml-auto">
                      <Button variant="outline" id="editing" className="cursor-pointer"><Pencil/></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={(e) => handleEdit(task, e)} className="p-0 m-0">
                      
                        <DialogHeader>
                          <DialogTitle className="text-center">Edit Task</DialogTitle>
                            <DialogDescription className="text-center">
                              Make changes in the task details
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 my-4">

                          <div className="grid gap-1">
                            <Label htmlFor="title-1">Title</Label>
                            <Input id="title-1" name="title" placeholder="Edit title" defaultValue={task.title} autoComplete="off"/>
                          </div>

                          <div className="grid gap-1">
                            <Label htmlFor="description-1">Description</Label>
                            <Textarea id="description-1" name="description" placeholder="Add a short description" defaultValue={task.description} autoComplete="off"/>
                          </div>

                          <div className="grid gap-1">
                            <Label htmlFor="priority-1">Priority</Label>
                              <Select onValueChange={setPriority} defaultValue={task.priority}>
                                <SelectTrigger id="priority-1" className="w-full">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="High">High</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>  
                              </Select>                          
                          </div>

                          <div className="grid gap-1 mb-4">
                            <Calendar29
                              open={open}
                              setOpen={setOpen}
                              value={value}
                              setValue={setValue}
                              date={date}
                              setDate={setDate}
                              defaultVal = {new Date(task.dueDate)}
                            />
                          </div>
            
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" className="cursor-pointer">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button type="submit" className="cursor-pointer">Edit task</Button>
                          </DialogClose>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  
                  </Dialog>
                  </div>
                  
                  
                </CollapsibleContent>
                </Label>
              </Collapsible>
            ))
          }
          <Dialog>
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
              <Input id="title-1" name="title" placeholder="Add a title" autoComplete="off" />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="description-1">Description</Label>
              <Textarea id="description-1" name="description" placeholder="Add a short description" autoComplete="off"/>
            </div>

            
            <div className="grid gap-1">
              <Label htmlFor="priority-1">Priority</Label>
              <Select onValueChange={setPriority} defaultValue="Low">
                <SelectTrigger id="priority-1" className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>  
              </Select>                          
            </div>

            <div className="grid gap-1 mb-4">
              <Calendar29
                open={open}
                setOpen={setOpen}
                value={value}
                setValue={setValue}
                date={date}
                setDate={setDate}
                defaultVal = {new Date()}
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
          <Button className="w-full max-w-150 gap-3 mt-0 cursor-pointer" type="button">Add More Tasks</Button>
          </div>  
        </DialogTrigger>
    </Dialog>
    
    </div>
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