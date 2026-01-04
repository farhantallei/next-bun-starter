import { Alert02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { createContext, use, useEffect, useId, useState } from "react"

import { useInView } from "react-intersection-observer"
import { getPaginatedData } from "@/features/examples/api"
import useDebounceValue from "@/hooks/use-debounce-value"

import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompleteStatus,
} from "./ui/autocomplete"
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
      <Autocomplete openOnInputClick>
        <AutocompleteInput
          aria-label="Search items"
          onChange={(e) => void setSearch(e.target.value)}
          placeholder="Search items…"
          value={search}
        />
        <DataSelectContent />
      </Autocomplete>
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
      getPaginatedData({ page: props.pageParam, limit: 10, search }),
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
    <AutocompletePopup>
      {status === "success" && data.pages.length <= 0 ? (
        <AutocompleteEmpty>No items found.</AutocompleteEmpty>
      ) : null}
      <AutocompleteList>
        {status === "success" && data.pages.length > 0
          ? data.pages.map((page) =>
              page.data.map((data) => (
                <AutocompleteItem key={data.id} value={data.id}>
                  {data.title}
                </AutocompleteItem>
              )),
            )
          : null}
        {hasNextPage ? (
          <AutocompleteStatus
            render={<div ref={!isFetchingNextPage ? loadingRef : null} />}
          >
            <DataSelectSearching />
          </AutocompleteStatus>
        ) : null}
      </AutocompleteList>
      {isLoading ? (
        <AutocompleteStatus>
          <DataSelectSearching />
        </AutocompleteStatus>
      ) : null}
      {isError ? (
        <AutocompleteStatus>
          <DataSelectError />
        </AutocompleteStatus>
      ) : null}
    </AutocompletePopup>
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
