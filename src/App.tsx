import React, { useState, useEffect, useRef, useCallback } from 'react';

type Rectangle = {
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  z: number, 
};

type MouseDownCoordinates = {
  x: number,
  y: number,
}

function isWithinRectangle(rect: Rectangle, x: Number, y: Number): boolean {
  return (rect.x <= x && x <= rect.x + rect.w) && (rect.y <= y && y <= rect.y + rect.h);
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [rects, setRects] = useState<Rectangle[]>([]);
  const [rectsCount, setRectCount] = useState<number>(0);
  const [dragTargetId, setDragTargetId] = useState<string | null>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [mouseDownPos, setMouseDownPos] = useState<MouseDownCoordinates | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Retrieve canvas context
      canvasCtxRef.current = canvasRef.current.getContext("2d");
      
      // Set canvas dimensions
      canvasRef.current.width = 800;
      canvasRef.current.height = 600;
    }
  }, []);

  const draw = useCallback(() => {
    if (canvasCtxRef.current && canvasRef.current) {
      // Clear the canvas
      canvasCtxRef.current.fillStyle = "white";
      canvasCtxRef.current.fillRect(0,0, canvasRef.current.width, canvasRef.current.height);
      
     for (let i = 0; i < rects.length; ++i) {
        const r = rects[i];
        console.log("drawing", r.id);
        canvasCtxRef.current.fillStyle = "red";
        const {x, y, w, h} = r;
        canvasCtxRef.current.fillRect(x, y, w, h);
      }
    } 
  }, [rects]);

  useEffect(() => {
    draw();
  }, [draw, rects]);

  const addRect = () => {
    console.log(`Adding rectangle to:`, rects);
    setRects(rects.concat({ id: `${rectsCount}`, x: 0, y: 0, w: 100, h: 100, z: rectsCount }))
    setRectCount((count) => count + 1);
  };

  const checkClick = (x: number, y: number) => {
    // Check if coordinate lies within any of the rendered rectangles
    for (let i = 0; i < rects.length; ++i) {
      const r = rects[i];
      if (isWithinRectangle(r, x, y)) {
        setDragTargetId(r.id);
        console.log(`drag target: ${dragTargetId}`);
        setMouseDownPos({x, y});
        return true;
      }
    }

    return false;
  };


  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('mouse down');
    if (canvasRef.current) {
      const x: number = event.nativeEvent.offsetX - canvasRef.current.clientLeft;
      const y: number = event.nativeEvent.offsetY - canvasRef.current.clientTop;
      setMouseDown(checkClick(x, y));
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('mouse move');
    // Mouse button not being held
    if (!mouseDown) {
      return;
    }

    if (canvasRef.current && mouseDownPos) {
      const mouseX = event.nativeEvent.offsetX - canvasRef.current.clientLeft;
      const mouseY = event.nativeEvent.offsetY - canvasRef.current.clientTop;
      setMouseDownPos({x: mouseX, y: mouseY});
      if (dragTargetId) {
        // Update drag target
        setRects((rects) => {
          const updatedRects = rects.map((r) => r.id === dragTargetId ? { ...r, x: mouseDownPos.x - (r.w / 2), y: mouseDownPos.y - (r.h / 2) } : r);
          return updatedRects;
        });
  
        draw();
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('mouse up');
    setDragTargetId(null);
    setMouseDown(false);
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('mouse out');
    handleMouseUp(event);
  };

  return (
    <div className="App">
      <canvas 
        id="canvas" ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        style={{
          border: "1px gray solid"
        }}
      />
      <button onClick={addRect}>Add Rect</button>
      <button onClick={draw}>Draw</button>
    </div>
  );
}

export default App;
