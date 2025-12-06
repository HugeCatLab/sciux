import type { Reactive } from '@vue/reactivity'
import { reactive } from '@vue/reactivity'

export type Context<T = Record<string | symbol, any>> = Reactive<T>

export const mergeContext = (target: Context, source: Context) => {
  return reactive(Object.assign(target, source))
}

export const createContextContainer = () => {
  let activeContext: Context = reactive({})
  const getContext = () => activeContext
  const setContext = (context: Context) => {
    // Clear existing properties
    for (const key in activeContext) {
      delete activeContext[key]
    }
    // Add new properties
    Object.assign(activeContext, context)
  }
  const addContext = (context: Context) => {
    // Add/override properties
    Object.assign(activeContext, context)
  }
  const clearContext = () => {
    // Clear all properties
    for (const key in activeContext) {
      delete activeContext[key]
    }
  }
  const withContext = <T>(
    _context: Context,
    callback: () => T
  ) => {
    let previousContext = activeContext

    activeContext = _context
    const result = callback()
    activeContext = previousContext

    return result
  }
  return {
    setContext,
    addContext,
    getContext,
    clearContext,
    withContext
  }
}

export type ContextContainer = ReturnType<typeof createContextContainer>
