import { registerPrefab, createContextContainer, createRenderer } from "../../src"
import { button, ctn } from "./button"

registerPrefab('button', { prefab: button })
registerPrefab('ctn', { prefab: ctn })

const root = document.getElementById('app1')!
const source = `
---
refs:
  a: '123'
---
<button :label="a" @click="console.log('click')">wwwwww</button>
<ctn>Hello World</ctn>
`.trim()

const renderer = createRenderer()

renderer.render(root, source)