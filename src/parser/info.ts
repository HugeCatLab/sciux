import { load } from "js-yaml"
import { DocumentInfo } from "../core"

export const COMPONENT_INFO_REG = /^---\n[\s\S]*?\n---$/gm
export const parseInfo = (content: string): DocumentInfo => {
  const match = content.match(COMPONENT_INFO_REG)
  if (match) {
    const header = match[0].trim().slice(3, -3)
    return load(header) as DocumentInfo
  }
  return { refs: {} } satisfies DocumentInfo
}