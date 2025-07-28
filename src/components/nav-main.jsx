"use client"

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom";

export function NavMain({
  items
}) {

  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Todo List</SidebarGroupLabel>
      <SidebarMenu>


        {items.map((item) => (
          <SidebarMenuItem key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem onClick = {() => navigate(item.url)} className="cursor-pointer">
              <SidebarMenuButton asChild tooltip={item.title}>
                <a>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenuItem>
        ))}


      </SidebarMenu>
    </SidebarGroup>
  );
}
