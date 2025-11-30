import { ContextContainer, createContextContainer, Document, NodeElement, Element, getPrefab, CommonProperty, ComputedProperty, effect, ReactiveEffectRunner, createAdhoc, TextElement, ValueElement, ref, PrefabMountHook, PrefabOptions } from "../core"
import { convert } from "../parser"

export const createRenderer = () => {
  const context = createContextContainer()
  const mountHooks: PrefabMountHook[] = []

  const applyOptions = (options: PrefabOptions) => {
    if (options.mount) {
      mountHooks.push(options.mount)
    }
  }
  
  const computeProps = (
    props: Record<string, CommonProperty | ComputedProperty>,
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

  const delegateEvents = (
    events: Record<string, string>,
    target: Node,
  ) => {
    const adhoc = createAdhoc(context.getContext())
    for (const [event, value] of Object.entries(events)) {
      const handler = adhoc(`() => { ${value} }`)
      target.addEventListener(event, handler)
    }
  }

  const renderNodeElement = (
    node: NodeElement,
  ) => {
    const item = getPrefab(node.name)
    if (item) {
      const { prefab } = item
      let fragment: HTMLElement = document.createElement('div')
      let clearEffect: ReactiveEffectRunner | null = null
      const update = () => {
        const children = node.children.map(child => renderElement(child)).filter((e) => typeof e !== 'undefined')
        const props = computeProps(node.props)
        const [ele, generator, options = {}] = prefab(props)
        if (clearEffect) clearEffect()
        clearEffect = effect(() => generator(() => children))
        fragment.replaceWith(ele)
        fragment = <HTMLElement>ele
        applyOptions(options)
        delegateEvents(node.events, fragment)
      }
      effect(update)
      return fragment
    }
  }

  const renderTextElement = (
    element: TextElement,
  ) => {
    return document.createTextNode(element.text)
  }

  const renderValueElement = (
    element: ValueElement,
  ) => {
    const text = document.createTextNode('')
    effect(() => {
      const adhoc = createAdhoc(context.getContext())
      const value = adhoc(element.value)
      text.textContent = value
    })
    return text
  }

  const renderElement = (
    element: Element,
  ) => {
    if (element.type === 'node') return renderNodeElement(element)
    else if (element.type === 'text') return renderTextElement(element)
    else if (element.type === 'value') return renderValueElement(element)
  }

  const renderDocument = (
    document: Document,
  ) => {
    return document.roots.map(root => renderElement(root)).filter((e) => typeof e !== 'undefined')
  }

  const applyRefs = (
    refs: Record<string, string>,
  ) => {
    const adhoc = createAdhoc(context.getContext())
    const newContext = Object.fromEntries(
      Object.entries(refs).map(([key, value]) => [key, ref(adhoc(value))])
    )
    context.addContext(newContext)
  }

  const render = (
    target: HTMLElement,
    content: string,
    autoMount: boolean = true,
  ) => {
    const document = convert(content)
    applyRefs(document.refs)
    const roots = renderDocument(document)
    target.childNodes.forEach(child => child.remove())
    target.append(...roots)
    const mount = () => {
      mountHooks.forEach(hook => hook())
      mountHooks.length = 0
    }
    if (autoMount) mount() 
    return mount
  }

  return {
    render,
    computeProps,
    delegateEvents,
    renderNodeElement,
    renderTextElement,
    renderValueElement,
    renderElement,
    renderDocument,
    applyRefs,
  }
}