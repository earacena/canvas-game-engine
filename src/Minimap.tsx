import React, {
  MutableRefObject,
  Dispatch,
  SetStateAction,
} from 'react';
import type { MouseDownCoordinates, ViewportCoordinates } from './common.types';

type MinimapProps = {
  canvasViewportRef: MutableRefObject<HTMLCanvasElement | null>;
  canvasMinimapRef: MutableRefObject<HTMLCanvasElement | null>;
  drawMinimap: () => void;
  drawViewport: () => void;
  setViewportPosition: Dispatch<SetStateAction<ViewportCoordinates>>;
  mouseDown: boolean,
  setMouseDown: Dispatch<SetStateAction<boolean>>;
  setMouseDownPos: Dispatch<SetStateAction<MouseDownCoordinates | null>>;
  mouseDownPos: MouseDownCoordinates | null;
};

function Minimap({
  canvasViewportRef,
  canvasMinimapRef,
  drawMinimap,
  drawViewport,
  setViewportPosition,
  setMouseDown,
  setMouseDownPos,
  mouseDown,
  mouseDownPos,
}: MinimapProps) {
  const handleMinimapMouseDown = () => {
    if (canvasMinimapRef.current) {
      // const x: number = event.nativeEvent.offsetX - canvasMinimapRef.current.clientLeft;
      // const y: number = event.nativeEvent.offsetY - canvasMinimapRef.current.clientTop;
      setMouseDown(true);
    }
  };

  const handleMinimapMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>,
  ) => {
    // Mouse button not being held
    if (!mouseDown) {
      return;
    }

    if (canvasViewportRef.current && canvasMinimapRef.current && mouseDownPos) {
      const mouseX = event.nativeEvent.offsetX - canvasMinimapRef.current.clientLeft;
      const mouseY = event.nativeEvent.offsetY - canvasMinimapRef.current.clientTop;
      setMouseDownPos({ x: mouseX, y: mouseY });

      setViewportPosition({
        x: mouseDownPos.x * 5,
        y: mouseDownPos.y * 5,
      });

      drawMinimap();
    }
  };

  const handleMinimapMouseUp = () => {
    setMouseDown(false);
    drawViewport();
  };

  const handleMinimapMouseOut = () => {
    handleMinimapMouseUp();
  };
  return (
    <canvas
      className="border border-slate-400"
      id="canvas-minimap"
      ref={canvasMinimapRef}
      onMouseDown={handleMinimapMouseDown}
      onMouseMove={handleMinimapMouseMove}
      onMouseUp={handleMinimapMouseUp}
      onMouseOut={handleMinimapMouseOut}
      onBlur={() => undefined}
    />
  );
}

export default Minimap;
