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
    getContext: () => getContext(activeContext),
    setContext: (context: Context) => setContext(activeContext, context),
    addContext: (context: Context) => addContext(activeContext, context),
    clearContext: () => clearContext(activeContext)
  }
}

export type ContextContainer = ReturnType<typeof createContextContainer>
