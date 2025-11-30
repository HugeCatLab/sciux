import type { Reactive } from '@vue/reactivity'
import { reactive } from '@vue/reactivity'

export type Context<T = Record<string | symbol, any>> = Reactive<T>

export const createContextContainer = () => {
  let activeContext: Context = reactive({})
  return {
    getContext: () => activeContext,
    setContext: (context: Context) => {
      // Clear existing properties
      for (const key in activeContext) {
        delete activeContext[key]
      }
      // Add new properties
      Object.assign(activeContext, context)
    },
    addContext: (context: Context) => {
      // Add/override properties
      Object.assign(activeContext, context)
    },
    clearContext: () => {
      // Clear all properties
      for (const key in activeContext) {
        delete activeContext[key]
      }
    },
  }
}

export type ContextContainer = ReturnType<typeof createContextContainer>
