import React, { MutableRefObject, MouseEvent } from 'react';

type ViewportProps = {
  canvasViewportRef: MutableRefObject<HTMLCanvasElement | null>,
  handleMouseDown: (event: MouseEvent<HTMLCanvasElement>) => void,
  handleMouseMove: (event: MouseEvent<HTMLCanvasElement>) => void,
  handleMouseUp: () => void,
  handleMouseOut: () => void,
};

function Viewport({
  canvasViewportRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleMouseOut,
}: ViewportProps) {
  return (
    <canvas
      className="border border-slate-400"
      id="canvas-viewport"
      ref={canvasViewportRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      onBlur={() => undefined}
    />
  );
}

export default Viewport;
