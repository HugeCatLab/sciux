import { ContextContainer, createContextContainer, Document, NodeElement, Element, getPrefab, CommonProperty, ComputedProperty, effect, ReactiveEffectRunner, createAdhoc, TextElement, ValueElement, ref } from "../core"
import { convert } from "../parser"

export const computeProps = (
  props: Record<string, CommonProperty | ComputedProperty>,
  context: ContextContainer
) => {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(props)) {
    if (value.type === 'computed') {
      const adhoc = createAdhoc(context.getContext())
      result[key] = adhoc(value.value)
    } else {
      result[key] = value.value
    }
  }
  return result
}

export const delegateEvents = (
  events: Record<string, string>,
  context: ContextContainer,
  target: Node,
) => {
  const adhoc = createAdhoc(context.getContext())
  for (const [event, value] of Object.entries(events)) {
    const handler = adhoc(`() => { ${value} }`)
    target.addEventListener(event, handler)
  }
}

export const renderNodeElement = (
  node: NodeElement,
  context: ContextContainer,
) => {
  const item = getPrefab(node.name)
  if (item) {
    const { prefab } = item
    let fragment: HTMLElement = document.createElement('div')
    let clearEffect: ReactiveEffectRunner | null = null
    const update = () => {
      const children = node.children.map(child => renderElement(child, context)).filter((e) => typeof e !== 'undefined')
      const props = computeProps(node.props, context)
      const [ele, generator] = prefab(props)
      if (clearEffect) clearEffect()
      clearEffect = effect(() => generator(() => children))
      fragment.replaceWith(ele)
      fragment = <HTMLElement>ele
      delegateEvents(node.events, context, fragment)
    }
    effect(update)
    return fragment
  }
}

export const renderTextElement = (
  element: TextElement,
) => {
  return document.createTextNode(element.text)
}

export const renderValueElement = (
  element: ValueElement,
  context: ContextContainer,
) => {
  const text = document.createTextNode('')
  effect(() => {
    const adhoc = createAdhoc(context.getContext())
    const value = adhoc(element.value)
    text.textContent = value
  })
  return text
}

export const renderElement = (
  element: Element,
  context: ContextContainer,
) => {
  if (element.type === 'node') return renderNodeElement(element, context)
  else if (element.type === 'text') return renderTextElement(element)
  else if (element.type === 'value') return renderValueElement(element, context)
}

export const renderDocument = (
  document: Document,
  context: ContextContainer
) => {
  return document.roots.map(root => renderElement(root, context)).filter((e) => typeof e !== 'undefined')
}

export const applyRefs = (
  refs: Record<string, string>,
  context: ContextContainer,
) => {
  const adhoc = createAdhoc(context.getContext())
  const newContext = Object.fromEntries(
    Object.entries(refs).map(([key, value]) => [key, ref(adhoc(value))])
  )
  context.addContext(newContext)
}

export const render = (
  target: HTMLElement,
  content: string,
  inputContext?: ContextContainer
) => {
  const context = inputContext ?? createContextContainer()
  const document = convert(content)
  applyRefs(document.refs, context)
  const roots = renderDocument(document, context)
  target.childNodes.forEach(child => child.remove())
  target.append(...roots)
}