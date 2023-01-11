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
  cameraLocked: boolean,
  color?: string,
  image?: HTMLImageElement,
};

export type ViewportCoordinates = {
  x: number;
  y: number;
};

export type MouseDownCoordinates = {
  x: number;
  y: number;
};
