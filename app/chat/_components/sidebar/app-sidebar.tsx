"use client"

import * as React from "react"

import { NavChats } from "@/app/chat/_components/sidebar/nav-chats"
import { NavSecondary } from "@/app/chat/_components/sidebar/nav-secondary"
import { NavUser } from "@/app/chat/_components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Command, Send, Settings } from "lucide-react"
import Link from "next/link"
import NewChatButton from "./new-chat-button"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <Settings strokeWidth={2} />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <Send strokeWidth={2} />,
    },
  ],
  chats: [
    {
      name: "Design Engineering",
      url: "/design-engineering",
    },
    {
      name: "Sales & Marketing",
      url: "/sales-marketing",
    },
    {
      name: "Travel",
      url: "/travel",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command strokeWidth={2} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Cura Link</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="mt-4">
        <NewChatButton />
        <NavChats Chats={data.chats} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
