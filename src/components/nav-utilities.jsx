import { Folder, MoreHorizontal, Share, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom";

export function NavUtilities({
  projects
}) {
  const { isMobile } = useSidebar()

  const navigate = useNavigate();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Utilites</SidebarGroupLabel>
      <SidebarMenu>

        {projects.map((item) => (
          <SidebarMenuItem key={item.name} onClick = {() => navigate(item.url)} className="cursor-pointer">
            <SidebarMenuButton asChild>
              <a>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}

      </SidebarMenu>
    </SidebarGroup>
  );
}
