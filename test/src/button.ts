import { definePrefab } from "../../src"

export const button = definePrefab<{
  label: string
}>(({ label }) => {
  const b = document.createElement('button')
  return [b, (children) => {
    b.textContent = label


  }]
})

export const ctn = definePrefab<{}>((a, c) => {
  const div = document.createElement('div')

  return [
    div,
    (children) => {

      div.append(...children())
    },
    {
      provides: {
        b: 1
      }
    }
  ]
})
