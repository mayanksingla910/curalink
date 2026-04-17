import { AppSidebar } from "@/app/chat/_components/sidebar/app-sidebar"
import ChatInput from "@/components/chat-input"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ChatProvider } from "./context/chat-context"

function ChatShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
        </header>
        <main className="mx-auto h-full w-full max-w-3xl px-4">
          {children}
        </main>
          <ChatInput />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ChatProvider>
      <ChatShell>{children}</ChatShell>
    </ChatProvider>
  )
}
