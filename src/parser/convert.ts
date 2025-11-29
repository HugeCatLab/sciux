import { ChildNode, NodeType, parse } from "./tree"
import { Element, TextElement, ValueElement, NodeElement, CommonProperty, ComputedProperty, Document } from "../core"
import { parseInfo, removeInfo } from "./info"

export const convertNode = (
  node: ChildNode
): Element | null => {
  switch (node.type) {
    case NodeType.TEXT:
      return {
        type: 'text',
        text: node.content,
      } satisfies TextElement
    case NodeType.VALUE:
      return {
        type: 'value',
        value: node.value
      } satisfies ValueElement
    case NodeType.ELEMENT:
      const props: Record<string, CommonProperty | ComputedProperty> = {}
      const events: Record<string, string> = {}
      const statements: Record<string, string> = {}
      for (const { name, value } of node.attributes) {
        if (name.startsWith(':')) {
          props[name.slice(1)] = {
            type: 'computed',
            value,
          }
        } else if (name.startsWith('@')) {
          events[name.slice(1)] = value
        } else if (name.startsWith('#')) {
          statements[name.slice(1)] = value
        } else {
          props[name] = {
            type: 'common',
            value,
          }
        }
      }
      return {
        type: 'node',
        name: node.tag,
        children: node.children.map(convertNode).filter((e) => e !== null),
        props,
        events,
        statements,
      } satisfies NodeElement
  }
  return null
}

export const convert = (
  content: string
): Document => {
  const contentWithoutInfo = removeInfo(content)
  const { children } = parse(contentWithoutInfo)
  const info = parseInfo(content)
  const roots = children.map(convertNode).filter((e) => e !== null)
  return {
    ...info,
    roots,
  } satisfies Document
}