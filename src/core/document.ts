import { Element } from "./element"

export type DocumentInfo = {
  refs: Record<string, string>
}

export type Document = {
  roots: Element[]
} & DocumentInfo