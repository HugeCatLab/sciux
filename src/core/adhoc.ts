import type { Context } from "./context";

export const createAdhoc = (o: Context) => {
  return (src: string, ctx?: Context) =>
    new Function(`return (function($__ctx){with($__ctx){return (${src});}});`)()(ctx ?? o)
}