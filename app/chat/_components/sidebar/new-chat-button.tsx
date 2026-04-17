"use client"

import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

function NewChatButton() {

    const router = useRouter()
  return (
    <Button onClick={() => {router.push("/chat")}} className='mx-4 flex items-center justify-center gap-2'>
        <PlusCircle className='mr-2 h-4 w-4' />
        New Chat
    </Button>
  )
}

export default NewChatButton
