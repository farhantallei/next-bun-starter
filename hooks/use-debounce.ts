import { useEffect } from "react"

import useTimeout from "./use-timeout"

export default function useDebounce(
  callback: () => void,
  deps: React.DependencyList,
  ms: number = 1000,
) {
  const { clear, reset } = useTimeout(callback, ms)
  useEffect(reset, [...deps, reset])
  // biome-ignore lint/correctness/useExhaustiveDependencies: keep deps stay empty
  useEffect(clear, [])
}
