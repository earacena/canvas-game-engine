import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import ObjectList from './ObjectList';
import type { Block } from './common.types';

type MouseDownCoordinates = {
  x: number;
  y: number;
};

function isWithinBlock(rect: Block, x: Number, y: Number): boolean {
  return (
    rect.x <= x && x <= rect.x + rect.w && rect.y <= y && y <= rect.y + rect.h
  );
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockCount, setBlockCount] = useState<number>(0);
  const [dragTargetId, setDragTargetId] = useState<string | null>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [mouseDownPos, setMouseDownPos] = useState<MouseDownCoordinates | null>(
    null,
  );

  useEffect(() => {
    if (canvasRef.current) {
      // Retrieve canvas context
      canvasCtxRef.current = canvasRef.current.getContext('2d');

      // Set canvas dimensions
      canvasRef.current.width = 800;
      canvasRef.current.height = 600;
    }
  }, []);

  const draw = useCallback(() => {
    if (canvasCtxRef.current && canvasRef.current) {
      // Clear the canvas
      canvasCtxRef.current.fillStyle = 'white';
      canvasCtxRef.current.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );

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
          canvasCtxRef.current.drawImage(image, x, y, w, h);
        } else {
          canvasCtxRef.current.fillStyle = b.color ?? 'red';
          canvasCtxRef.current.fillRect(x, y, w, h);
        }

        // If currently dragged shape, give a border
        if (b.id === dragTargetId) {
          canvasCtxRef.current.strokeRect(x, y, w, h);
        }
      }
    }
  }, [blocks, dragTargetId]);

  useEffect(() => {
    draw();
  }, [draw, blocks]);

  const checkClick = (x: number, y: number) => {
    // Check if coordinate lies within any of the rendered Blocks
    for (let i = 0; i < blocks.length; i += 1) {
      const b = blocks[i];
      if (isWithinBlock(b, x, y)) {
        setDragTargetId(b.id);
        // console.log(`drag target: ${dragTargetId}`);
        setMouseDownPos({ x, y });
        return true;
      }
    }

    return false;
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // console.log("mouse down");
    if (canvasRef.current) {
      const x: number = event.nativeEvent.offsetX - canvasRef.current.clientLeft;
      const y: number = event.nativeEvent.offsetY - canvasRef.current.clientTop;
      setMouseDown(checkClick(x, y));
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // console.log("mouse move");
    // Mouse button not being held
    if (!mouseDown) {
      return;
    }

    if (canvasRef.current && mouseDownPos) {
      const mouseX = event.nativeEvent.offsetX - canvasRef.current.clientLeft;
      const mouseY = event.nativeEvent.offsetY - canvasRef.current.clientTop;
      setMouseDownPos({ x: mouseX, y: mouseY });
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

        draw();
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // console.log("mouse up");
    setDragTargetId(null);
    setMouseDown(false);
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // console.log("mouse out");
    handleMouseUp(event);
  };

  return (
    <div className="flex flex-row items-center justify-center">
      <button className="hover:bg-white hover:text-blue-900 bg-blue-900 text-white p-2 rounded-md" onClick={draw}>Draw</button>
      <div>
        <canvas
          className="border border-slate-400"
          id="canvas"
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseOut}
        />
      </div>
      <ObjectList blocks={blocks} blockCount={blockCount} setBlockCount={setBlockCount} setBlocks={setBlocks} />
    </div>
  );
}

export default App;
