"use client"

import {
  ArrowTurnBackwardIcon,
  ArrowTurnForwardIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  SourceCodeIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect, useState } from "react"

import { EditorContent } from "@/components/editor/editor-content"
import { Button } from "@/components/ui/button"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/ui/toolbar"
import { cn } from "@/lib/utils"

interface SimpleEditorProps {
  name?: string
  defaultValue?: string
  placeholder?: string
  className?: string
}

function SimpleEditor({
  name,
  defaultValue = "",
  placeholder = "Write something...",
  className,
}: SimpleEditorProps) {
  const [content, setContent] = useState(defaultValue)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && defaultValue !== editor.getHTML()) {
      editor.commands.setContent(defaultValue)
    }
  }, [defaultValue, editor])

  if (!editor) {
    return null
  }

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-focus-within:before:shadow-[0_1px_--theme(--color-black/6%)] has-focus-within:border-ring has-focus-within:ring-[3px] dark:bg-input/32 dark:not-has-focus-within:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
      data-slot="simple-editor"
    >
      <Toolbar className="rounded-b-none border-0 border-b">
        <ToolbarGroup>
          <ToolbarButton
            render={
              <Button
                disabled={!editor.can().undo()}
                onClick={() => editor.chain().focus().undo().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={ArrowTurnBackwardIcon} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            render={
              <Button
                disabled={!editor.can().redo()}
                onClick={() => editor.chain().focus().redo().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={ArrowTurnForwardIcon} strokeWidth={2} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ToolbarButton
            render={
              <Button
                data-pressed={editor.isActive("bold") || undefined}
                onClick={() => editor.chain().focus().toggleBold().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            render={
              <Button
                data-pressed={editor.isActive("italic") || undefined}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            render={
              <Button
                data-pressed={editor.isActive("strike") || undefined}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={TextStrikethroughIcon} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            render={
              <Button
                data-pressed={editor.isActive("code") || undefined}
                onClick={() => editor.chain().focus().toggleCode().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={SourceCodeIcon} strokeWidth={2} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ToolbarButton
            render={
              <Button
                data-pressed={editor.isActive("bulletList") || undefined}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={LeftToRightListBulletIcon} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            render={
              <Button
                data-pressed={editor.isActive("orderedList") || undefined}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={LeftToRightListNumberIcon} strokeWidth={2} />
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>

      <EditorContent editor={editor} />

      {name && <input name={name} type="hidden" value={content} />}
    </div>
  )
}

export { SimpleEditor, type SimpleEditorProps }
