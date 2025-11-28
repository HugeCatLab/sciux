export type RawValue = string | number | boolean | null | undefined | object | RawValue[]
export type CommonProperty = {
  type: 'common'
  value: RawValue
}
export type ComputedProperty = {
  type: 'computed'
  value: string
}

export interface NodeElement {
  type: 'node'
  name: string
  props: Record<string, CommonProperty | ComputedProperty>
  events: Record<string, string>
  statements: Record<string, string>
  children: Element[]
}
export interface ValueElement {
  type: 'value'
  value: string
}
export interface TextElement {
  type: 'text'
  text: string
}
export type Element = NodeElement | ValueElement | TextElement

export type Updater = () => void
export interface MountedNodeElement extends NodeElement {
  update: Updater
  domNode?: Node
}
export interface MountedValueElement extends ValueElement {
  domNode?: Text
}
export interface MountedTextElement extends TextElement {
  domNode?: Text
}
export type MountedElement = MountedNodeElement | MountedTextElement | MountedValueElement
