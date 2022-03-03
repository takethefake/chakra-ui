import { __DEV__ } from "@chakra-ui/utils"
import { ColorMode } from "./color-mode.utils"

const hasSupport = () => typeof Storage !== "undefined"
export const defaultStoragePrefix = "chakra"
export const storageSuffix = "ui-color-mode"
export const storageKey = [defaultStoragePrefix, storageSuffix].join("-")

type MaybeColorMode = ColorMode | undefined

export interface StorageManager {
  get(init?: ColorMode): MaybeColorMode
  set(value: ColorMode): void
  type: "cookie" | "localStorage"
}

/**
 * Simple object to handle read-write to localStorage
 */
export const localStorageManager = (
  localStoragePrefix = defaultStoragePrefix,
): StorageManager => ({
  get(init?) {
    if (!hasSupport()) return init
    try {
      const value = localStorage.getItem(
        [localStoragePrefix, storageSuffix].join("-"),
      ) as MaybeColorMode
      return value ?? init
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
      return init
    }
  },
  set(value) {
    if (!hasSupport()) return
    try {
      localStorage.setItem([localStoragePrefix, storageSuffix].join("-"), value)
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
    }
  },
  type: "localStorage",
})

/**
 * Simple object to handle read-write to cookies
 */
export const cookieStorageManager = (cookies = ""): StorageManager => ({
  get(init?) {
    const match = cookies.match(new RegExp(`(^| )${storageKey}=([^;]+)`))

    if (match) {
      return match[2] as ColorMode
    }

    return init
  },
  set(value) {
    document.cookie = `${storageKey}=${value}; max-age=31536000; path=/`
  },
  type: "cookie",
})
