export type ChildrenGetter = () => Node[]
export type PrefabGenerator = (children: ChildrenGetter) => void
export type AsyncPrefabGenerator = (children: ChildrenGetter) => Promise<void>

export type Prefab<T extends object> = (attrs: T) => [Node, PrefabGenerator, PrefabOptions?]
export type AsyncPrefab<T extends object> = (attrs: T) => [Node, AsyncPrefabGenerator, PrefabOptions?]

export type PrefabRegistryItem = {
  prefab: Prefab<any>
}
export type PrefabRegistry = Map<string, PrefabRegistryItem>

export const definePrefab = <T extends object>(prefab: Prefab<T>) => prefab

const prefabs: PrefabRegistry = new Map()
export const registerPrefab = (name: string, prefab: PrefabRegistryItem) => {
  prefabs.set(name, prefab)
}
export const getPrefab = (name: string) => {
  return prefabs.get(name)
}
export const hasPrefab = (name: string) => {
  return prefabs.has(name)
}
export const removePrefab = (name: string) => {
  return prefabs.delete(name)
}
export const clearPrefabs = () => {
  prefabs.clear()
}

export type PrefabMountHook = () => void
export type PrefabOptions = {
  mount?: PrefabMountHook
}
