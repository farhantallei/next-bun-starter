"use client"

import {
  AlignBoxBottomCenterIcon,
  AlignBoxBottomLeftIcon,
  AlignBoxBottomRightIcon,
  AlignBoxMiddleCenterIcon,
  ArrowTurnBackwardIcon,
  ArrowTurnForwardIcon,
  CheckListIcon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  Heading04Icon,
  Heading05Icon,
  Heading06Icon,
  ImageUploadIcon,
  LeftToRightBlockQuoteIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  MinusSignIcon,
  PaintBrushIcon,
  RemoveSquareIcon,
  SourceCodeIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Color } from "@tiptap/extension-color"
import Image from "@tiptap/extension-image"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { type ChangeEvent, useEffect, useRef, useState } from "react"

import { EditorContent } from "@/components/editor/editor-content"
import { Button } from "@/components/ui/button"
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/ui/toolbar"
import { uploadRedactorFile } from "@/features/editor/api"
import { cn } from "@/lib/utils"

const COLORS = [
  { name: "Default", value: "" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Gray", value: "#6b7280" },
]

const HEADINGS = [
  { label: "Heading 1", level: 1, icon: Heading01Icon },
  { label: "Heading 2", level: 2, icon: Heading02Icon },
  { label: "Heading 3", level: 3, icon: Heading03Icon },
  { label: "Heading 4", level: 4, icon: Heading04Icon },
  { label: "Heading 5", level: 5, icon: Heading05Icon },
  { label: "Heading 6", level: 6, icon: Heading06Icon },
] as const

interface RichEditorProps {
  name?: string
  defaultValue?: string
  placeholder?: string
  className?: string
}

function RichEditor({
  name,
  defaultValue = "",
  placeholder = "Write something...",
  className,
}: RichEditorProps) {
  const [content, setContent] = useState(defaultValue)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
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

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    setIsUploading(true)
    try {
      const response = await uploadRedactorFile(file)
      const url = response.image.image.url
      editor.chain().focus().setImage({ src: url }).run()
    } catch (error) {
      console.error("Failed to upload image:", error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const getCurrentHeading = () => {
    if (!editor) return 0
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) {
        return i
      }
    }
    return 0
  }

  const getCurrentColor = () => {
    if (!editor) return ""
    const color = editor.getAttributes("textStyle").color
    return color || ""
  }

  if (!editor) {
    return null
  }

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-focus-within:before:shadow-[0_1px_--theme(--color-black/6%)] has-focus-within:border-ring has-focus-within:ring-[3px] dark:bg-input/32 dark:not-has-focus-within:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
      data-slot="rich-editor"
    >
      <Toolbar className="flex-wrap rounded-b-none border-0 border-b">
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
          <Select
            onValueChange={(value) => {
              const level = Number(value)
              if (level === 0) {
                editor.chain().focus().setParagraph().run()
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
                  .run()
              }
            }}
            value={String(getCurrentHeading())}
          >
            <SelectTrigger className="h-7 min-h-7 w-32 min-w-0 gap-1 rounded-md px-2 text-xs sm:h-6 sm:min-h-6">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {HEADINGS.map((heading) => (
                <SelectItem key={heading.level} value={String(heading.level)}>
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon
                      className="size-4"
                      icon={heading.icon}
                      strokeWidth={2}
                    />
                    {heading.label}
                  </span>
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
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
                data-pressed={editor.isActive("underline") || undefined}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={TextUnderlineIcon} strokeWidth={2} />
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
          <Popover>
            <PopoverTrigger
              render={
                <Button size="icon-xs" variant="ghost">
                  <HugeiconsIcon
                    icon={PaintBrushIcon}
                    strokeWidth={2}
                    style={{ color: getCurrentColor() || undefined }}
                  />
                </Button>
              }
            />
            <PopoverPopup className="w-auto p-2" sideOffset={8}>
              <div className="grid grid-cols-3 gap-1">
                {COLORS.map((color) => (
                  <button
                    className={cn(
                      "flex size-8 items-center justify-center rounded-md border transition-colors hover:bg-accent",
                      getCurrentColor() === color.value && "ring-2 ring-ring",
                    )}
                    key={color.name}
                    onClick={() => {
                      if (color.value) {
                        editor.chain().focus().setColor(color.value).run()
                      } else {
                        editor.chain().focus().unsetColor().run()
                      }
                    }}
                    style={{ backgroundColor: color.value || undefined }}
                    title={color.name}
                    type="button"
                  >
                    {!color.value && (
                      <span className="text-muted-foreground text-xs">A</span>
                    )}
                    {getCurrentColor() === color.value && color.value && (
                      <HugeiconsIcon
                        className="size-4 text-white drop-shadow-sm"
                        icon={Tick02Icon}
                        strokeWidth={2}
                      />
                    )}
                  </button>
                ))}
              </div>
            </PopoverPopup>
          </Popover>
          <ToolbarButton
            render={
              <Button
                onClick={() => editor.chain().focus().unsetAllMarks().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={RemoveSquareIcon} strokeWidth={2} />
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
          <ToolbarButton
            render={
              <Button
                data-pressed={editor.isActive("taskList") || undefined}
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={CheckListIcon} strokeWidth={2} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ToolbarButton
            render={
              <Button
                data-pressed={editor.isActive("blockquote") || undefined}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={LeftToRightBlockQuoteIcon} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            render={
              <Button
                data-pressed={editor.isActive("codeBlock") || undefined}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={SourceCodeIcon} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            render={
              <Button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ToolbarButton
            render={
              <Button
                data-pressed={
                  editor.isActive({ textAlign: "left" }) || undefined
                }
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={AlignBoxBottomLeftIcon} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            render={
              <Button
                data-pressed={
                  editor.isActive({ textAlign: "center" }) || undefined
                }
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={AlignBoxBottomCenterIcon} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            render={
              <Button
                data-pressed={
                  editor.isActive({ textAlign: "right" }) || undefined
                }
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={AlignBoxBottomRightIcon} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            render={
              <Button
                data-pressed={
                  editor.isActive({ textAlign: "justify" }) || undefined
                }
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={AlignBoxMiddleCenterIcon} strokeWidth={2} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ToolbarButton
            render={
              <Button
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={ImageUploadIcon} strokeWidth={2} />
          </ToolbarButton>
          <input
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            ref={fileInputRef}
            type="file"
          />
        </ToolbarGroup>
      </Toolbar>

      <EditorContent editor={editor} />

      {name && <input name={name} type="hidden" value={content} />}
    </div>
  )
}

export { RichEditor, type RichEditorProps }
