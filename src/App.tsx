import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import ObjectList from './ObjectList';
import type { Block } from './common.types';
import BackgroundObject from './BackgroundObject';

type MouseDownCoordinates = {
  x: number;
  y: number;
};

type ViewportCoordinates = {
  x: number;
  y: number;
};

function isWithinBlock(rect: Block, x: Number, y: Number): boolean {
  return (
    rect.x <= x && x <= rect.x + rect.w && rect.y <= y && y <= rect.y + rect.h
  );
}

function App() {
  // Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasMinimapRef = useRef<HTMLCanvasElement | null>(null);
  const canvasMinimapCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasViewportRef = useRef<HTMLCanvasElement | null>(null);
  const canvasViewportCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [viewportPosition, setViewportPosition] = useState<ViewportCoordinates>(
    { x: 0, y: 0 },
  );

  // Objects
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockCount, setBlockCount] = useState<number>(0);
  const [background, setBackground] = useState<HTMLImageElement | null>(null);

  // Mouse/Keyboard interaction
  const [dragTargetId, setDragTargetId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [mouseDownPos, setMouseDownPos] = useState<MouseDownCoordinates | null>(
    null,
  );
  const [mouseDownClientPos, setMouseDownClientPos] = useState<MouseDownCoordinates | null>(
    null,
  );

  const [keys, setKeys] = useState<Map<string, boolean>>(new Map());

  const handleKeyDown = (event: KeyboardEvent) => {
    setKeys(new Map(keys.set(event.key.toLowerCase(), true)));
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    setKeys(new Map(keys.set(event.key.toLowerCase(), false)));
  };

  useEffect(() => {
    if (canvasRef.current) {
      // Retrieve main canvas context
      canvasCtxRef.current = canvasRef.current.getContext('2d');

      // Set main canvas dimensions
      canvasRef.current.width = 2000;
      canvasRef.current.height = 2000;
    }

    if (canvasViewportRef.current) {
      // Retrieve camera context
      canvasViewportCtxRef.current = canvasViewportRef.current.getContext('2d');

      // Set viewport (camera) dimensions
      canvasViewportRef.current.width = 800;
      canvasViewportRef.current.height = 600;
    }

    if (canvasMinimapRef.current && canvasRef.current) {
      // Retrieve main canvas minimap context
      canvasMinimapCtxRef.current = canvasMinimapRef.current.getContext('2d');

      // Set minimap dimensions based on main canvas dimensions
      canvasMinimapRef.current.width = Math.floor(canvasRef.current.width / 5);
      canvasMinimapRef.current.height = Math.floor(
        canvasRef.current.height / 5,
      );
    }
  }, []);

  const drawMain = useCallback(() => {
    if (canvasCtxRef.current && canvasRef.current && canvasViewportRef.current) {
      // Clear the canvas
      canvasCtxRef.current.fillStyle = 'white';
      canvasCtxRef.current.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );

      // Draw background
      if (background !== null && background.complete) {
        for (let i = 0; i < canvasRef.current.width; i += background.width) {
          for (
            let j = 0;
            j < canvasRef.current.height;
            j += background.height
          ) {
            canvasCtxRef.current.drawImage(
              background,
              i,
              j,
              background.width,
              background.height,
            );
          }
        }
      }

      // Draw blocks
      for (let i = 0; i < blocks.length; i += 1) {
        const b = blocks[i];
        // console.log('drawing', b.id);
        const {
          x, y, w, h, image,
        } = b;
        if (image) {
          // // Check if correct size, resize otherwise
          // if (b.image.height !== h || b.image.width !== w) {
          //
          // }

          // Draw image/texture instead of solid color
          // Check if image has loaded, otherwise wait for it to load
          if (image.complete) {
            canvasCtxRef.current.drawImage(image, x, y, w, h);
          } else {
            image.onload = () => {
              if (canvasCtxRef.current) {
                canvasCtxRef.current.drawImage(image, x, y, w, h);
              }
            };
          }
        } else {
          canvasCtxRef.current.fillStyle = b.color ?? 'red';
          canvasCtxRef.current.fillRect(x, y, w, h);
        }

        // If currently dragged shape or selected, give a border
        if (b.id === dragTargetId && mouseDownClientPos) {
          canvasCtxRef.current.strokeRect(x, y, w, h);

          // Display current coordinates
          canvasCtxRef.current.fillStyle = 'black';
          canvasCtxRef.current.font = '12px monospace';
          if (
            mouseDownClientPos.x < canvasViewportRef.current.width / 2
            && mouseDownClientPos.y < canvasViewportRef.current.height / 2
          ) {
            canvasCtxRef.current.fillText(`(${x}, ${y})`, x + w, y + h);
          } else if (
            mouseDownClientPos.x < canvasViewportRef.current.width / 2
            && mouseDownClientPos.y >= canvasViewportRef.current.height / 2
          ) {
            canvasCtxRef.current.fillText(`(${x}, ${y})`, x + w, y);
          } else if (
            mouseDownClientPos.x >= canvasViewportRef.current.width / 2
            && mouseDownClientPos.y < canvasViewportRef.current.height / 2
          ) {
            canvasCtxRef.current.fillText(`(${x}, ${y})`, x - 80, y + h);
          } else if (
            mouseDownClientPos.x >= canvasViewportRef.current.width / 2
            && mouseDownClientPos.y >= canvasViewportRef.current.height / 2
          ) {
            canvasCtxRef.current.fillText(`(${x}, ${y})`, x - 80, y);
          }
        }

        // If object is selected, draw a black border
        if (b.id === selectedTargetId) {
          canvasCtxRef.current.fillStyle = 'black';
          canvasCtxRef.current.strokeRect(x, y, w, h);
        }
      }
    }
  }, [blocks, dragTargetId, selectedTargetId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);
  }, []);

  const drawMinimap = () => {
    if (
      canvasMinimapCtxRef.current
      && canvasMinimapRef.current
      && canvasRef.current
      && canvasViewportRef.current
    ) {
      // Clear the canvas
      canvasMinimapCtxRef.current.fillStyle = 'white';
      canvasMinimapCtxRef.current.fillRect(
        0,
        0,
        canvasMinimapRef.current.width,
        canvasMinimapRef.current.height,
      );

      // Transfer scaled down copy of main canvas to minimap
      canvasMinimapCtxRef.current.drawImage(
        canvasRef.current,
        0,
        0,
        canvasMinimapRef.current.width,
        canvasMinimapRef.current.height,
      );

      // Draw viewport border
      canvasMinimapCtxRef.current.fillStyle = 'red';
      canvasMinimapCtxRef.current.strokeRect(
        viewportPosition.x / 5,
        viewportPosition.y / 5,
        canvasViewportRef.current.width / 5,
        canvasViewportRef.current.height / 5,
      );
    }
  };

  const drawViewport = () => {
    if (
      canvasViewportCtxRef.current
      && canvasViewportRef.current
      && canvasRef.current
    ) {
      // Clear viewport
      canvasViewportCtxRef.current.fillStyle = 'white';
      canvasViewportCtxRef.current.fillRect(
        0,
        0,
        canvasViewportRef.current.width,
        canvasViewportRef.current.height,
      );

      // Transfer slice of main canvas to viewport
      canvasViewportCtxRef.current.drawImage(
        canvasRef.current,
        viewportPosition.x,
        viewportPosition.y,
        canvasViewportRef.current.width,
        canvasViewportRef.current.height,
        0,
        0,
        canvasViewportRef.current.width,
        canvasViewportRef.current.height,
      );
    }
  };

  // Tick that checks if key was pressed, 60 fps
  const tick = () => {
    if (keys.get('w')) {
      setBlocks(
        (updatedBlocks) => updatedBlocks.map((b) => (b.controllable ? { ...b, y: b.y - 10 } : b)),
      );
    }

    if (keys.get('s')) {
      setBlocks(
        (updatedBlocks) => updatedBlocks.map((b) => (b.controllable ? { ...b, y: b.y + 10 } : b)),
      );
    }

    if (keys.get('a')) {
      setBlocks(
        (updatedBlocks) => updatedBlocks.map((b) => (b.controllable ? { ...b, x: b.x - 10 } : b)),
      );
    }

    if (keys.get('d')) {
      setBlocks(
        (updatedBlocks) => updatedBlocks.map((b) => (b.controllable ? { ...b, x: b.x + 10 } : b)),
      );
    }

    setTimeout(tick, 50);
  };

  // Initial draw
  useEffect(() => {
    drawMain();
    drawMinimap();
    drawViewport();
    tick();
  }, []);

  useEffect(() => {
    // console.log('draw');
    drawMain();
    drawMinimap();
    drawViewport();
  }, [drawMain, blocks, background, viewportPosition]);

  const checkClick = (x: number, y: number) => {
    // Check if coordinate lies within any of the rendered Blocks
    for (let i = 0; i < blocks.length; i += 1) {
      const b = blocks[i];
      if (isWithinBlock(b, x, y)) {
        setDragTargetId(b.id);
        setSelectedTargetId(b.id);
        // console.log(`drag target: ${dragTargetId}`);
        setMouseDownPos({ x, y });
        setMouseDownClientPos({ x, y });
        return true;
      }
    }

    setSelectedTargetId(null);
    return false;
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // console.log("mouse down");
    if (canvasViewportRef.current) {
      const x: number = event.nativeEvent.offsetX - canvasViewportRef.current.clientLeft;
      const y: number = event.nativeEvent.offsetY - canvasViewportRef.current.clientTop;
      setMouseDown(checkClick(viewportPosition.x + x, viewportPosition.y + y));
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // console.log("mouse move");
    // Mouse button not being held
    if (!mouseDown || !mouseDownClientPos) {
      return;
    }

    if (canvasViewportRef.current && mouseDownPos) {
      const mouseX = event.nativeEvent.offsetX - canvasViewportRef.current.clientLeft;
      const mouseY = event.nativeEvent.offsetY - canvasViewportRef.current.clientTop;

      setMouseDownPos({
        x: mouseX + viewportPosition.x,
        y: mouseY + viewportPosition.y,
      });

      setMouseDownClientPos({
        x: mouseX,
        y: mouseY,
      });

      if (dragTargetId) {
        // Update drag target
        setBlocks((b) => {
          const updatedBlocks = b.map((r) => (r.id === dragTargetId
            ? {
              ...r,
              x: Math.floor(mouseDownPos.x - r.w / 2),
              y: Math.floor(mouseDownPos.y - r.h / 2),
            }
            : r));
          return updatedBlocks;
        });

        drawMain();
      }
    }
  };

  const handleMouseUp = () => {
    // console.log("mouse up");
    setDragTargetId(null);
    setMouseDown(false);
  };

  const handleMouseOut = () => {
    // console.log("mouse out");
    handleMouseUp();
  };

  // const isWithinViewport = (x: number, y: number) => {
  //   if (canvasViewportRef.current) {
  //     return (
  //       (viewportPosition.x <= x)
  //        && (x <= ((viewportPosition.x + canvasViewportRef.current.width) / 5))
  //        && ((viewportPosition.y / 5) <= y)
  //        && (y <= ((viewportPosition.y + canvasViewportRef.current.height) / 5))
  //     );
  //   }
  //   return false;
  // };

  // const checkMinimapClick = (x: number, y: number) => {
  //   // Check if coordinate lies within viewport
  //   if (isWithinViewport(x, y)) {
  //     setMouseDownPos({ x, y });
  //     return true;
  //   }

  //   return false;
  // };

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

      console.log(viewportPosition);

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
    <div className="flex flex-row items-center justify-center">
      <button
        type="button"
        className="hover:bg-white hover:text-blue-900 bg-blue-900 text-white p-2 rounded-md"
        onClick={drawMain}
      >
        Draw
      </button>
      <div className="flex flex-col items-center">
        <canvas
          className="border border-slate-400 hidden"
          id="canvas-main"
          ref={canvasRef}
          onBlur={() => undefined}
        />
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
      </div>
      <div className="flex flex-col">
        <BackgroundObject
          background={background}
          setBackground={setBackground}
        />
        <ObjectList
          blocks={blocks}
          blockCount={blockCount}
          setBlockCount={setBlockCount}
          setBlocks={setBlocks}
          selectedTargetId={selectedTargetId}
          setSelectedTargetId={setSelectedTargetId}
        />
      </div>
    </div>
  );
}

export default App;
