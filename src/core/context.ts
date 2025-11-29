import type { Reactive } from '@vue/reactivity'
import { reactive } from '@vue/reactivity'

export type Context<T = Record<string | symbol, any>> = Reactive<T>

export const mergeContext = (
  target: Context,
  newContext: Context,
) => reactive({
  ...target,
  ...newContext,
})

export const getContext = (active: Context) => active
export const setContext = (
  active: Context,
  target: Context,
) => {
  active = reactive(target)
}
export const addContext = (
  active: Context,
  context: Context,
) => setContext(
  active,
  mergeContext(active, context)
)
export const clearContext = (
  active: Context
) => {
  active = reactive({})
}

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
    }
  }
}

export type ContextContainer = ReturnType<typeof createContextContainer>
