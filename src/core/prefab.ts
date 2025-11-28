export type PrefabGenerator = () => void
export type AsyncPrefabGenerator = () => Promise<void>

export type Prefab<T extends object> = (attrs: T) => [Node, PrefabGenerator]
export type AsyncPrefab<T extends object> = (attrs: T) => [Node, AsyncPrefabGenerator]