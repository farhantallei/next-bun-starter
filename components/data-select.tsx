import { Alert02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { createContext, use, useEffect, useId, useState } from "react"
import { useInView } from "react-intersection-observer"

import { getPaginatedData } from "@/features/examples/api"
import useDebounceValue from "@/hooks/use-debounce-value"

import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxStatus,
} from "./ui/combobox"
import { Spinner } from "./ui/spinner"

type DataSelectContextValue = {
  search: string
  setSearch: (value: string) => void
}

const DataSelectContext = createContext<DataSelectContextValue>(
  {} as DataSelectContextValue,
)

export default function DataSelect() {
  const [search, setSearch] = useState("")

  return (
    <DataSelectContext.Provider value={{ search, setSearch }}>
      <Combobox<{ id: string; title: string }>
        itemToStringLabel={(item) => item.title}
        itemToStringValue={(item) => item.id}
        onOpenChange={(open) => {
          if (!open) setSearch("")
        }}
        onValueChange={() => void setSearch("")}
        openOnInputClick
      >
        <ComboboxInput
          aria-label="Search items"
          onChange={(e) => void setSearch(e.target.value)}
          placeholder="Search items…"
          showClear
        />
        <DataSelectContent />
      </Combobox>
    </DataSelectContext.Provider>
  )
}

function DataSelectContent() {
  const { search } = use(DataSelectContext)

  const debouncedSearch = useDebounceValue(search, 300)
  const [loadingRef, inView] = useInView()

  const queryKey = useId()

  const {
    data,
    status,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [
      queryKey,
      {
        keyword: debouncedSearch,
        // ...options,
      },
    ],
    queryFn: (props) =>
      getPaginatedData({ page: props.pageParam, limit: 30, search }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.page + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want this to run when inView changes
  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  return (
    <ComboboxPopup>
      {status === "success" &&
      (data.pages.length <= 0 || data.pages[0].data.length <= 0) ? (
        <ComboboxEmpty>No items found.</ComboboxEmpty>
      ) : null}
      <ComboboxList>
        {status === "success" && data.pages.length > 0
          ? data.pages.map((page) =>
              page.data.map((data) => (
                <ComboboxItem key={data.id} value={data}>
                  {data.title}
                </ComboboxItem>
              )),
            )
          : null}
        {hasNextPage ? (
          <ComboboxStatus
            render={<div ref={!isFetchingNextPage ? loadingRef : null} />}
          >
            <DataSelectSearching />
          </ComboboxStatus>
        ) : null}
      </ComboboxList>
      {isLoading ? (
        <ComboboxStatus>
          <DataSelectSearching />
        </ComboboxStatus>
      ) : null}
      {isError ? (
        <ComboboxStatus>
          <DataSelectError />
        </ComboboxStatus>
      ) : null}
    </ComboboxPopup>
  )
}

function DataSelectSearching() {
  return (
    <span className="flex items-center justify-between gap-2 text-muted-foreground">
      Searching...
      <Spinner className="size-4" />
    </span>
  )
}

function DataSelectError() {
  return (
    <span className="flex items-center justify-between gap-2 text-destructive">
      Failed to get data.
      <HugeiconsIcon className="size-4" icon={Alert02Icon} strokeWidth={2} />
    </span>
  )
}
