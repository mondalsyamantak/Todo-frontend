import * as React from "react"
import {
  BookOpen,
  Bot,
  ClipboardList,
  Command,
  Frame,
  Hourglass,
  LifeBuoy,
  Map,
  Music,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Timer
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
//import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useUser } from "@/contextApis/UserContext"

export function AppSidebar({
  ...props
}) {

  const {user, setUser} = useUser()
  //console.log("User: ",user)

  const data = {
    user: {
      name: user.username,
      email: user.email,
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "All Tasks",
        url: "/",
        icon: ClipboardList,
      }, //playground
      {
        title: "Today",
        url: "/today",
        icon: ClipboardList,
      }, //models
      {
        title: "Tomorrow",
        url: "/tomorrow",
        icon: ClipboardList,
      }, //docs
      {
        title: "This month",
        url: "/this-month",
        icon: ClipboardList,
      }, //settings
    ],
    projects: [
      {
        name: "Pomodoro Timer",
        url: "#",
        icon: Hourglass,
      }, //design engineering
      {
        name: "Stopwatch",
        url: "#",
        icon: Timer,
      }, //sales & marketing
      {
        name: "Study Music",
        url: "#",
        icon: Music,
      }, //travel
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div
                  className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Deep Focus</span>
                  <span className="truncate text-xs">Get better everyday</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
