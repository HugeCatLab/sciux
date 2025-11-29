import { definePrefab } from "../../src"

export const button = definePrefab<{
  label: string
}>(({ label }) => {
  const b = document.createElement('button')
  return [b, (children) => {
    b.textContent = label
    console.log(children())
  }]
})