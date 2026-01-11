"use client"

import {
  Alert02Icon,
  ArrowDown01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query"
import { type ReactNode, useEffect, useId, useState } from "react"
import { useInView } from "react-intersection-observer"

import useDebounceValue from "@/hooks/use-debounce-value"

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

interface InfiniteComboboxProps<T, TResponse> {
  queryKey: QueryKey
  queryFn: (params: { page: number; search: string }) => Promise<TResponse>
  getItems: (response: TResponse) => T[]
  getNextPageParam: (lastPage: TResponse) => number | undefined
  itemToStringLabel: (item: T) => string
  itemToStringValue: (item: T) => string
  renderItem?: (item: T) => ReactNode
  placeholder?: string
  ariaLabel?: string
  initialPageParam?: number
  debounceMs?: number
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

export function InfiniteCombobox<T, TResponse>({
  queryKey,
  queryFn,
  getItems,
  getNextPageParam,
  itemToStringLabel,
  itemToStringValue,
  renderItem,
  placeholder = "Search...",
  ariaLabel = "Search items",
  initialPageParam = 1,
  debounceMs = 300,
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
}: InfiniteComboboxProps<T, TResponse>) {
  const id = useId()

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounceValue(search, debounceMs)
  const [loadingRef, inView] = useInView()

  const {
    data,
    status,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<
    TResponse,
    Error,
    InfiniteData<TResponse>,
    QueryKey,
    number
  >({
    queryKey: [id, ...queryKey, { keyword: debouncedSearch }],
    queryFn: ({ pageParam }) => queryFn({ page: pageParam, search }),
    getNextPageParam,
    initialPageParam,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want this to run when inView changes
  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  const isEmpty =
    status === "success" &&
    (data.pages.length <= 0 || getItems(data.pages[0]).length <= 0)

  const hasData = status === "success" && data.pages.length > 0

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
          {hasData
            ? data.pages.flatMap((page) =>
                getItems(page).map((item) => (
                  <ComboboxItem key={itemToStringValue(item)} value={item}>
                    {renderItem ? renderItem(item) : itemToStringLabel(item)}
                  </ComboboxItem>
                )),
              )
            : null}
          {hasNextPage ? (
            <ComboboxStatus
              render={<div ref={!isFetchingNextPage ? loadingRef : null} />}
            >
              <InfiniteComboboxSearching message={searchingMessage} />
            </ComboboxStatus>
          ) : null}
        </ComboboxList>
        {isLoading ? (
          <ComboboxStatus>
            <InfiniteComboboxSearching message={searchingMessage} />
          </ComboboxStatus>
        ) : null}
        {isError ? (
          <ComboboxStatus>
            <InfiniteComboboxError message={errorMessage} />
          </ComboboxStatus>
        ) : null}
      </ComboboxPopup>
    </Combobox>
  )
}

function InfiniteComboboxSearching({ message }: { message: string }) {
  return (
    <span className="flex items-center justify-between gap-2 text-muted-foreground">
      {message}
      <Spinner className="size-4" />
    </span>
  )
}

function InfiniteComboboxError({ message }: { message: string }) {
  return (
    <span className="flex items-center justify-between gap-2 text-destructive">
      {message}
      <HugeiconsIcon className="size-4" icon={Alert02Icon} strokeWidth={2} />
    </span>
  )
}
