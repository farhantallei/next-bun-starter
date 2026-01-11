"use client"

import {
  Alert02Icon,
  ArrowDown01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type QueryKey, useQuery } from "@tanstack/react-query"
import { type ReactNode, useId, useMemo, useState } from "react"

import { Button } from "./button"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
} from "./combobox"
import { Spinner } from "./spinner"

interface AsyncComboboxProps<T> {
  queryKey: QueryKey
  queryFn: () => Promise<T[]>
  itemToStringLabel: (item: T) => string
  itemToStringValue: (item: T) => string
  filterFn?: (item: T, search: string) => boolean
  renderItem?: (item: T) => ReactNode
  placeholder?: string
  ariaLabel?: string
  emptyMessage?: string
  searchingMessage?: string
  errorMessage?: string
  value?: T | null
  onValueChange?: (value: T | null) => void
  disabled?: boolean
  required?: boolean
  showClear?: boolean
  useTrigger?: boolean
  triggerPlaceholder?: string
}

export function AsyncCombobox<T>({
  queryKey,
  queryFn,
  itemToStringLabel,
  itemToStringValue,
  filterFn,
  renderItem,
  placeholder = "Search...",
  ariaLabel = "Search items",
  emptyMessage = "No items found.",
  searchingMessage = "Searching...",
  errorMessage = "Failed to get data.",
  value,
  onValueChange,
  disabled = false,
  required = false,
  showClear = true,
  useTrigger = false,
  triggerPlaceholder = "Select an item",
}: AsyncComboboxProps<T>) {
  const id = useId()

  const [search, setSearch] = useState("")

  const { data, isLoading, isError } = useQuery<T[]>({
    queryKey: [id, ...queryKey],
    queryFn,
  })

  const filteredItems = useMemo(() => {
    if (!data) return []
    if (!search) return data

    const lowerSearch = search.toLowerCase()
    return data.filter((item) => {
      if (filterFn) return filterFn(item, search)
      return itemToStringLabel(item).toLowerCase().includes(lowerSearch)
    })
  }, [data, search, filterFn, itemToStringLabel])

  const isEmpty = !isLoading && !isError && filteredItems.length === 0

  return (
    <Combobox<T>
      disabled={disabled}
      itemToStringLabel={itemToStringLabel}
      itemToStringValue={itemToStringValue}
      onOpenChange={(open) => {
        if (!open) setSearch("")
      }}
      onValueChange={(newValue) => {
        setSearch("")
        onValueChange?.(newValue)
      }}
      openOnInputClick={!useTrigger}
      required={required}
      value={value}
    >
      {useTrigger ? (
        <ComboboxTrigger
          render={
            <Button
              className="w-full justify-between font-normal"
              variant="outline"
            />
          }
        >
          <ComboboxValue>
            {(value: T | undefined) =>
              value ? (
                itemToStringLabel(value)
              ) : (
                <span className="text-muted-foreground/72">
                  {triggerPlaceholder}
                </span>
              )
            }
          </ComboboxValue>
          <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
        </ComboboxTrigger>
      ) : (
        <ComboboxInput
          aria-label={ariaLabel}
          onChange={(e) => void setSearch(e.target.value)}
          placeholder={placeholder}
          showClear={showClear}
        />
      )}
      <ComboboxPopup>
        {useTrigger ? (
          <div className="border-b p-2">
            <ComboboxInput
              className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
              onChange={(e) => void setSearch(e.target.value)}
              placeholder={placeholder}
              showTrigger={false}
              startAddon={<HugeiconsIcon icon={Search01Icon} strokeWidth={2} />}
            />
          </div>
        ) : null}
        {isEmpty ? <ComboboxEmpty>{emptyMessage}</ComboboxEmpty> : null}
        <ComboboxList>
          {useTrigger && showClear ? (
            <ComboboxItem value={null}>{triggerPlaceholder}</ComboboxItem>
          ) : null}
          {filteredItems.map((item) => (
            <ComboboxItem key={itemToStringValue(item)} value={item}>
              {renderItem ? renderItem(item) : itemToStringLabel(item)}
            </ComboboxItem>
          ))}
        </ComboboxList>
        {isLoading ? (
          <ComboboxStatus>
            <AsyncComboboxSearching message={searchingMessage} />
          </ComboboxStatus>
        ) : null}
        {isError ? (
          <ComboboxStatus>
            <AsyncComboboxError message={errorMessage} />
          </ComboboxStatus>
        ) : null}
      </ComboboxPopup>
    </Combobox>
  )
}

function AsyncComboboxSearching({ message }: { message: string }) {
  return (
    <span className="flex items-center justify-between gap-2 text-muted-foreground">
      {message}
      <Spinner className="size-4" />
    </span>
  )
}

function AsyncComboboxError({ message }: { message: string }) {
  return (
    <span className="flex items-center justify-between gap-2 text-destructive">
      {message}
      <HugeiconsIcon className="size-4" icon={Alert02Icon} strokeWidth={2} />
    </span>
  )
}
