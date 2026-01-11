"use client"

import type { Editor } from "@tiptap/react"
import { EditorContent as TiptapEditorContent } from "@tiptap/react"

import { cn } from "@/lib/utils"

interface EditorContentProps {
  editor: Editor | null
  className?: string
}

function EditorContent({ editor, className }: EditorContentProps) {
  return (
    <TiptapEditorContent
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none px-3 py-2 focus-within:outline-none [&_.tiptap]:min-h-24 [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
        "[&_.tiptap_ul[data-type=taskList]]:list-none [&_.tiptap_ul[data-type=taskList]]:pl-0",
        "[&_.tiptap_ul[data-type=taskList]_li]:flex [&_.tiptap_ul[data-type=taskList]_li]:items-start [&_.tiptap_ul[data-type=taskList]_li]:gap-2",
        "[&_.tiptap_ul[data-type=taskList]_li_label]:mt-0.5",
        "[&_.tiptap_ul[data-type=taskList]_li_div]:flex-1",
        "[&_.tiptap_img]:max-w-full [&_.tiptap_img]:rounded-lg",
        className,
      )}
      editor={editor}
    />
  )
}

export { EditorContent }
