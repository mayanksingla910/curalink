"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil, MoreHorizontal, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useChat } from "@/context/chat-context"

export function NavChats() {
  const { isMobile } = useSidebar()
  const { chats, addChat, removeChat } = useChat()

  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [renameLoading, setRenameLoading] = useState(false)

  // Load initial chats from API into context on mount
  useEffect(() => {
    if (!addChat) return
    axios
      .get("/api/chat")
      .then((res) => {
        if (Array.isArray(res.data.chats)) {
          // API returns newest first, addChat prepends — so reverse to maintain order
          ;[...res.data.chats]
            .reverse()
            .forEach((chat: { id: string; title: string }) => {
              addChat(chat)
            })
        }
      })
      .catch((err) => {
        console.error("Error fetching chats:", err)
      })
  }, [addChat]) // ← add addChat here, always same size array

  const openRename = (id: string, currentTitle: string) => {
    setRenameId(id)
    setRenameValue(currentTitle)
  }

  const handleRename = async () => {
    if (!renameId || !renameValue.trim()) return
    setRenameLoading(true)
    try {
      const res = await axios.patch(`/api/chat/${renameId}`, {
        title: renameValue.trim(),
      })
      if (res.data.chat) {
        removeChat(renameId)
        addChat({ id: renameId, title: res.data.chat.title })
        toast.success("Chat renamed")
      }
    } catch {
      toast.error("Error renaming chat")
    } finally {
      setRenameLoading(false)
      setRenameId(null)
      setRenameValue("")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/chat/${id}`)
      if (res.data.success) {
        removeChat(id)
        toast.success("Chat deleted")
      }
    } catch {
      toast.error("Error deleting chat")
    }
  }

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarMenu>
          {!chats.length && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No chats yet. Start by creating a new chat.
              </p>
            </div>
          )}
          {chats.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <Link href={"/chat/" + item.id}>
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="mr-2 aria-expanded:bg-muted"
                  >
                    <MoreHorizontal strokeWidth={2} />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 py-2"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem
                    onClick={() => openRename(item.id, item.title)}
                  >
                    <Pencil strokeWidth={2} className="text-muted-foreground" />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 strokeWidth={2} />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      {/* Rename dialog */}
      <Dialog
        open={!!renameId}
        onOpenChange={(open) => {
          if (!open) setRenameId(null)
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            placeholder="Enter new name..."
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameId(null)}
              disabled={renameLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!renameValue.trim() || renameLoading}
            >
              {renameLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
