import { registerPrefab, render } from "../../src"
import { button } from "./button"

registerPrefab('button', { prefab: button })

const root = document.getElementById('app1')!
const source = `
---
refs:
  a: '123'
---
<button :label="a" @click="console.log('click')">wwwwww</button>
`.trim()

render(root, source)