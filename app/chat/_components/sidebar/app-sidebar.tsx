"use client"

import * as React from "react"
import Link from "next/link"
import { Command, PlusCircle, Send, Settings } from "lucide-react"
import { NavChats } from "@/app/chat/_components/sidebar/nav-chats"
import { NavSecondary } from "@/app/chat/_components/sidebar/nav-secondary"
import { NavUser } from "@/app/chat/_components/sidebar/nav-user"
import { authClient } from "@/lib/auth-client"
import { useChat } from "@/context/chat-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

const secondaryNavItems = [
  { title: "Settings", url: "/settings", icon: <Settings /> },
  { title: "Feedback", url: "/feedback", icon: <Send /> },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession()
  const { resetChat } = useChat()
  const router = useRouter()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const handleScroll = () => setIsScrolled(el.scrollTop > 0)
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader
        className={`transition-shadow duration-200 pb-0 ${
          isScrolled
            ? "border-b shadow-[0_4px_0_0_hsl(var(--sidebar-border))]"
            : "border-b border-transparent"
        }`}
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command strokeWidth={2} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Cura Link</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Personal Workspace
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarGroup className="mt-6">
            <SidebarGroupContent>
              <SidebarMenuButton
                onClick={() => {
                  resetChat()
                  router.push("/chat")
                }}
              >
                <PlusCircle className="h-4 w-4" />
                New Chat
              </SidebarMenuButton>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent ref={contentRef}>
        <NavChats />
      </SidebarContent>

      <SidebarFooter className="pt-0 border-t bg-sidebar  shadow-[2px_0_0_0_hsl(var(--sidebar-border))]">
        <NavSecondary items={secondaryNavItems} className="mt-auto" />
        {isPending ? (
          <div className="h-12 w-full animate-pulse rounded-md bg-muted/50" />
        ) : (
          session && <NavUser user={session.user} />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}