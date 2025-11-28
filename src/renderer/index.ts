import { ContextContainer, createContextContainer, Document } from "../core"

export const renderDocument = (
  document: Document,
  context?: ContextContainer
) => {}

export const render = (
  target: HTMLElement,
  document: string,
  inputContext?: ContextContainer
) => {
  const context = inputContext ?? createContextContainer()
}