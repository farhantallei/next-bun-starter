"use client"

import {
  CodeIcon,
  ComputerIcon,
  CreditCardIcon,
  DownloadIcon,
  EyeIcon,
  File01Icon,
  FileIcon,
  FloppyDiskIcon,
  FolderIcon,
  FolderOpenIcon,
  HelpCircleIcon,
  KeyboardIcon,
  LanguageCircleIcon,
  LayoutIcon,
  LogoutIcon,
  MailIcon,
  MoonIcon,
  MoreHorizontalCircle01Icon,
  MoreVerticalCircle01Icon,
  NotificationIcon,
  PaintBoardIcon,
  PlusSignIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  SunIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import * as React from "react"
import { Example, ExampleWrapper } from "@/components/example"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "@/components/ui/combobox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from "@/components/ui/menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <CardExample />
      <FormExample />
    </ExampleWrapper>
  )
}

function CardExample() {
  return (
    <Example className="items-center justify-center" title="Card">
      <Card className="relative w-full max-w-sm overflow-hidden pt-0">
        <div className="absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color" />
        <Image
          alt="Photo by mymind on Unsplash"
          className="relative z-20 aspect-video w-full object-cover grayscale"
          height={400}
          src="/header.webp"
          title="Photo by mymind on Unsplash"
          width={600}
        />
        <CardHeader>
          <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
          <CardDescription>
            Switch to the improved way to explore your data, with natural
            language. Monitoring will no longer be available on the Pro plan in
            November, 2025
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger render={<Button />}>
              <HugeiconsIcon
                data-icon="inline-start"
                icon={PlusSignIcon}
                strokeWidth={2}
              />
              Show Dialog
            </AlertDialogTrigger>
            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to allow the USB accessory to connect to this
                  device?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose render={<Button variant="ghost" />}>
                  Don&apos;t allow
                </AlertDialogClose>
                <Button>Allow</Button>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>
          <Badge className="ml-auto" variant="secondary">
            Warning
          </Badge>
        </CardFooter>
      </Card>
    </Example>
  )
}

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

const roleItems = [
  { label: "Developer", value: "developer" },
  { label: "Designer", value: "designer" },
  { label: "Manager", value: "manager" },
  { label: "Other", value: "other" },
]

function FormExample() {
  const [view, setView] = React.useState({
    sidebar: true,
    statusBar: false,
  })
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  return (
    <Example title="Form">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Please fill in your details below</CardDescription>
          <CardAction>
            <Menu>
              <MenuTrigger render={<Button size="icon" variant="ghost" />}>
                <HugeiconsIcon
                  icon={MoreVerticalCircle01Icon}
                  strokeWidth={2}
                />
                <span className="sr-only">More options</span>
              </MenuTrigger>
              <MenuPopup align="end" className="w-56">
                <MenuGroup>
                  <MenuGroupLabel>File</MenuGroupLabel>
                  <MenuItem>
                    <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
                    New File
                    <MenuShortcut>⌘N</MenuShortcut>
                  </MenuItem>
                  <MenuItem>
                    <HugeiconsIcon icon={FolderIcon} strokeWidth={2} />
                    New Folder
                    <MenuShortcut>⇧⌘N</MenuShortcut>
                  </MenuItem>
                  <MenuSub>
                    <MenuSubTrigger>
                      <HugeiconsIcon icon={FolderOpenIcon} strokeWidth={2} />
                      Open Recent
                    </MenuSubTrigger>
                    <MenuPortal>
                      <MenuSubPopup>
                        <MenuGroup>
                          <MenuGroupLabel>Recent Projects</MenuGroupLabel>
                          <MenuItem>
                            <HugeiconsIcon icon={CodeIcon} strokeWidth={2} />
                            Project Alpha
                          </MenuItem>
                          <MenuItem>
                            <HugeiconsIcon icon={CodeIcon} strokeWidth={2} />
                            Project Beta
                          </MenuItem>
                          <MenuSub>
                            <MenuSubTrigger>
                              <HugeiconsIcon
                                icon={MoreHorizontalCircle01Icon}
                                strokeWidth={2}
                              />
                              More Projects
                            </MenuSubTrigger>
                            <MenuPortal>
                              <MenuSubPopup>
                                <MenuItem>
                                  <HugeiconsIcon
                                    icon={CodeIcon}
                                    strokeWidth={2}
                                  />
                                  Project Gamma
                                </MenuItem>
                                <MenuItem>
                                  <HugeiconsIcon
                                    icon={CodeIcon}
                                    strokeWidth={2}
                                  />
                                  Project Delta
                                </MenuItem>
                              </MenuSubPopup>
                            </MenuPortal>
                          </MenuSub>
                        </MenuGroup>
                        <MenuSeparator />
                        <MenuGroup>
                          <MenuItem>
                            <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
                            Browse...
                          </MenuItem>
                        </MenuGroup>
                      </MenuSubPopup>
                    </MenuPortal>
                  </MenuSub>
                  <MenuSeparator />
                  <MenuItem>
                    <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} />
                    Save
                    <MenuShortcut>⌘S</MenuShortcut>
                  </MenuItem>
                  <MenuItem>
                    <HugeiconsIcon icon={DownloadIcon} strokeWidth={2} />
                    Export
                    <MenuShortcut>⇧⌘E</MenuShortcut>
                  </MenuItem>
                </MenuGroup>
                <MenuSeparator />
                <MenuGroup>
                  <MenuGroupLabel>View</MenuGroupLabel>
                  <MenuCheckboxItem
                    checked={view.sidebar}
                    onCheckedChange={(checked) =>
                      setView({
                        ...view,
                        sidebar: checked === true,
                      })
                    }
                  >
                    Show Sidebar
                  </MenuCheckboxItem>
                  <MenuCheckboxItem
                    checked={view.statusBar}
                    onCheckedChange={(checked) =>
                      setView({
                        ...view,
                        statusBar: checked === true,
                      })
                    }
                  >
                    Show Status Bar
                  </MenuCheckboxItem>
                  <MenuSub>
                    <MenuSubTrigger>
                      <HugeiconsIcon icon={PaintBoardIcon} strokeWidth={2} />
                      Theme
                    </MenuSubTrigger>
                    <MenuPortal>
                      <MenuSubPopup>
                        <MenuGroup>
                          <MenuGroupLabel>Appearance</MenuGroupLabel>
                          <MenuRadioGroup
                            onValueChange={setTheme}
                            value={theme}
                          >
                            <MenuRadioItem value="light">Light</MenuRadioItem>
                            <MenuRadioItem value="dark">Dark</MenuRadioItem>
                            <MenuRadioItem value="system">System</MenuRadioItem>
                          </MenuRadioGroup>
                        </MenuGroup>
                      </MenuSubPopup>
                    </MenuPortal>
                  </MenuSub>
                </MenuGroup>
                <MenuSeparator />
                <MenuGroup>
                  <MenuGroupLabel>Account</MenuGroupLabel>
                  <MenuItem>
                    <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
                    Profile
                    <MenuShortcut>⇧⌘P</MenuShortcut>
                  </MenuItem>
                  <MenuItem>
                    <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
                    Billing
                  </MenuItem>
                  <MenuSub>
                    <MenuSubTrigger>
                      <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
                      Settings
                    </MenuSubTrigger>
                    <MenuPortal>
                      <MenuSubPopup>
                        <MenuGroup>
                          <MenuGroupLabel>Preferences</MenuGroupLabel>
                          <MenuItem>
                            <HugeiconsIcon
                              icon={KeyboardIcon}
                              strokeWidth={2}
                            />
                            Keyboard Shortcuts
                          </MenuItem>
                          <MenuItem>
                            <HugeiconsIcon
                              icon={LanguageCircleIcon}
                              strokeWidth={2}
                            />
                            Language
                          </MenuItem>
                          <MenuSub>
                            <MenuSubTrigger>
                              <HugeiconsIcon
                                icon={NotificationIcon}
                                strokeWidth={2}
                              />
                              Notifications
                            </MenuSubTrigger>
                            <MenuPortal>
                              <MenuSubPopup>
                                <MenuGroup>
                                  <MenuGroupLabel>
                                    Notification Types
                                  </MenuGroupLabel>
                                  <MenuCheckboxItem
                                    checked={notifications.push}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        push: checked === true,
                                      })
                                    }
                                  >
                                    Push Notifications
                                  </MenuCheckboxItem>
                                  <MenuCheckboxItem
                                    checked={notifications.email}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        email: checked === true,
                                      })
                                    }
                                  >
                                    Email Notifications
                                  </MenuCheckboxItem>
                                </MenuGroup>
                              </MenuSubPopup>
                            </MenuPortal>
                          </MenuSub>
                        </MenuGroup>
                        <MenuSeparator />
                        <MenuGroup>
                          <MenuItem>
                            <HugeiconsIcon icon={ShieldIcon} strokeWidth={2} />
                            Privacy & Security
                          </MenuItem>
                        </MenuGroup>
                      </MenuSubPopup>
                    </MenuPortal>
                  </MenuSub>
                </MenuGroup>
                <MenuSeparator />
                <MenuGroup>
                  <MenuItem>
                    <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
                    Help & Support
                  </MenuItem>
                  <MenuItem>
                    <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
                    Documentation
                  </MenuItem>
                </MenuGroup>
                <MenuSeparator />
                <MenuGroup>
                  <MenuItem variant="destructive">
                    <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
                    Sign Out
                    <MenuShortcut>⇧⌘Q</MenuShortcut>
                  </MenuItem>
                </MenuGroup>
              </MenuPopup>
            </Menu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Form>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="small-form-name">Name</FieldLabel>
                <Input
                  id="small-form-name"
                  placeholder="Enter your name"
                  required
                />
                <FieldError />
              </Field>
              <Field>
                <FieldLabel htmlFor="small-form-role">Role</FieldLabel>
                <Select defaultValue={null} items={roleItems}>
                  <SelectTrigger id="small-form-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roleItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="small-form-framework">Framework</FieldLabel>
              <Combobox items={frameworks}>
                <ComboboxInput
                  id="small-form-framework"
                  placeholder="Select a framework"
                  required
                />
                <ComboboxPopup>
                  <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxPopup>
              </Combobox>
              <FieldError />
            </Field>
            <Field>
              <FieldLabel htmlFor="small-form-comments">Comments</FieldLabel>
              <Textarea
                id="small-form-comments"
                placeholder="Add any additional comments"
              />
              <FieldError />
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </Example>
  )
}
