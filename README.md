# Sciux
<p>Domain Specific Language for AI-generated document</p>

## Getting Started

```ts
const source = `
<element></element>
`.trim()
const { render } = createRenderer()
const root = document.getElementById('root')
render(source, root)
```

## Syntax

### Element

```md
<!-- Open -->
<element></element>

<!-- Self-closed -->
<element/>
```

### Attribute

```md
<!-- String Value -->
<element attr="Hello World" />

<!-- Expression -->
<element :attr="1 + 1" />
```

### Event

```md
<element @click="console.log('click')" />
```

### Value Insert

```md
<element>Hello World</element>

<element>{{ 1 + 1 }}</element>
```

### Reflect Variable

```md
---
refs:
  v: '0'
---
<element @click="v++">Value: {{ v }}</element>
```
