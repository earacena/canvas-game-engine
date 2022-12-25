export type Block = {
  id: string,
  name: string,
  type: string,
  x: number,
  y: number,
  w: number,
  h: number,
  z: number,
  controllable: boolean,
  color?: string,
  image?: HTMLImageElement,
};
