import ChatInput from "@/components/chat-input"
import NewChatPage from "./chat/page"
import LoginRedirectButton from "@/components/login-redirect-button"
import ThemeToggle from "@/components/theme-toggle"
import { ChatProvider } from "@/context/chat-context"

export default function Page() {
  return (
    <ChatProvider>
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md md:px-12">
        <p className="text-sm font-medium text-muted-foreground">
          Login to create more chats
        </p>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LoginRedirectButton />
        </div>
      </header>

      <main className="relative mx-auto flex h-full w-full max-w-3xl flex-1 flex-col">
        <div className="flex-1 px-4 py-8">
          <NewChatPage />
        </div>
        <ChatInput />
      </main>
    </div></ChatProvider>
  )
}
