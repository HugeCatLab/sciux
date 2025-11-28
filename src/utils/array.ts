export type MaybeArray<T extends unknown> = T | T[]

export const toArray = (array: MaybeArray<unknown>) => Array.isArray(array) ? array : [array]
