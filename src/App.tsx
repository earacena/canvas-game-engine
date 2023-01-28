import React, {
  useState, useEffect, useRef,
} from 'react';
import ObjectList from './ObjectList';
import type {
  Block,
  Entity,
  ViewportCoordinates,
  MouseDownCoordinates,
} from './common.types';
import BackgroundObject from './BackgroundObject';
import Minimap from './Minimap';
import Viewport from './Viewport';
import ObjectForm from './ObjectForm';
import EntityForm from './EntityForm';

function isWithinBlock(rect: Block, x: number, y: number): boolean {
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

  // Objects/Entities
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockCount, setBlockCount] = useState<number>(0);
  const [background, setBackground] = useState<HTMLImageElement | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [entityCount, setEntityCount] = useState<number>(0);

  // Mouse/Keyboard interaction
  const [dragTargetId, setDragTargetId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [mouseDownPos, setMouseDownPos] = useState<MouseDownCoordinates | null>(null);
  const [mouseDownClientPos, setMouseDownClientPos] = useState<MouseDownCoordinates | null>(null);
  const [keys, setKeys] = useState<Map<string, boolean>>(new Map());

  // Controllable block movement speed in pixels
  const movementSpeed: number = 5;

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

  const drawMain = () => {
    if (
      canvasCtxRef.current
      && canvasRef.current
      && canvasViewportRef.current
    ) {
      // Clear the canvas
      if (background === null) {
        canvasCtxRef.current.fillStyle = 'white';
        canvasCtxRef.current.fillRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );
      }

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
  };

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
  // Checks the collision between two blocks
  const isColliding = (b1: Block, b2: Block) => (
    b1.x < b2.x + b2.w
      && b1.x + b1.w > b2.x
      && b1.y < b2.y + b2.h
      && b1.h + b1.y > b2.y
  );

  // Update coordinate in 'movementSpeed' increments
  const processKeys = () => {
    const validKeyPressed: boolean = keys.get('w') || keys.get('a') || keys.get('s') || keys.get('d') || false;

    if (validKeyPressed) {
      let keyPressed: string;

      if (keys.get('w')) keyPressed = 'w';
      else if (keys.get('a')) keyPressed = 'a';
      else if (keys.get('s')) keyPressed = 's';
      else if (keys.get('d')) keyPressed = 'd';

      setBlocks((prevBlocks) => {
        if (canvasRef.current) {
          const canvasHeight: number = canvasRef.current.height;
          const canvasWidth: number = canvasRef.current.width;
          const collisionBlocks = prevBlocks.filter((b) => b.type === 'collision');
          const updatedBlocks = [...prevBlocks];

          // Don't check for collision if there are no collision blocks
          if (collisionBlocks.length === 0) {
            if (keyPressed === 'w') {
              return updatedBlocks.map(
                (b) => (b.controllable ? { ...b, y: Math.max(b.y - movementSpeed, 0) } : b),
              );
            }
            if (keyPressed === 'a') {
              return updatedBlocks.map(
                (b) => (b.controllable ? { ...b, x: Math.max(b.x - movementSpeed, 0) } : b),
              );
            }
            if (keyPressed === 's') {
              return updatedBlocks.map(
                (b) => (
                  b.controllable ? { ...b, y: Math.min(b.y + movementSpeed, canvasHeight) } : b
                ),
              );
            }
            if (keyPressed === 'd') {
              return updatedBlocks.map(
                (b) => (
                  b.controllable ? { ...b, x: Math.min(b.x + movementSpeed, canvasWidth) } : b
                ),
              );
            }
          }

          // Check for collision
          let movementColliding: boolean;
          for (let i = 0; i < updatedBlocks.length; i += 1) {
            movementColliding = false;
            for (let j = 0; j < collisionBlocks.length; j += 1) {
              if (
                updatedBlocks[i].controllable
                && isColliding(
                  {
                    ...updatedBlocks[i],
                    y: updatedBlocks[i].y - movementSpeed,
                  },
                  collisionBlocks[j],
                )
                && keyPressed === 'w') {
                movementColliding = true;
                break;
              }

              if (
                updatedBlocks[i].controllable
                && isColliding(
                  {
                    ...updatedBlocks[i],
                    y: updatedBlocks[i].y + movementSpeed,
                  },
                  collisionBlocks[j],
                )
                && keyPressed === 's') {
                movementColliding = true;
                break;
              }

              if (
                updatedBlocks[i].controllable
                && isColliding(
                  {
                    ...updatedBlocks[i],
                    x: updatedBlocks[i].x - movementSpeed,
                  },
                  collisionBlocks[j],
                )
                && keyPressed === 'a') {
                movementColliding = true;
                break;
              }

              if (
                updatedBlocks[i].controllable
                && isColliding(
                  {
                    ...updatedBlocks[i],
                    x: updatedBlocks[i].x + movementSpeed,
                  },
                  collisionBlocks[j],
                )
                && keyPressed === 'd'
              ) {
                movementColliding = true;
                break;
              }
            }
            if (updatedBlocks[i].controllable && !movementColliding) {
              if (keyPressed === 'w') {
                updatedBlocks[i].y = Math.max(updatedBlocks[i].y - movementSpeed, 0);
              } else if (keyPressed === 'a') {
                updatedBlocks[i].x = Math.max(updatedBlocks[i].x - movementSpeed, 0);
              } else if (keyPressed === 's') {
                updatedBlocks[i].y = Math.min(updatedBlocks[i].y + movementSpeed, canvasHeight);
              } else if (keyPressed === 'd') {
                updatedBlocks[i].x = Math.min(updatedBlocks[i].x + movementSpeed, canvasWidth);
              }
            }
          }
          return updatedBlocks;
        }

        return prevBlocks;
      });
    }
  };

  // Initial draw
  useEffect(() => {
    const drawLoop = () => {
      drawMain();
      drawMinimap();
      drawViewport();
      processKeys();
      return () => {
        setTimeout(window.requestAnimationFrame, 1000 / 60);
      };
    };

    window.requestAnimationFrame(drawLoop);
  }, [drawMain]);

  useEffect(() => {
    // If block is camera locked, adjust viewport position
    for (let i = 0; i < blocks.length; i += 1) {
      if (blocks[i].cameraLocked && canvasViewportRef.current) {
        setViewportPosition({
          x: Math.floor(blocks[i].x - canvasViewportRef.current.width / 2 + blocks[i].w / 2),
          y: Math.floor(blocks[i].y - canvasViewportRef.current.height / 2 + blocks[i].h / 2),
        });
      }
    }
  }, [blocks]);

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

  return (
    <div className="flex flex-row items-start">
      <div className="flex flex-col h-screen overflow-scroll">
        <BackgroundObject
          background={background}
          setBackground={setBackground}
        />
        <ObjectForm
          blocks={blocks}
          setBlocks={setBlocks}
          blockCount={blockCount}
          setBlockCount={setBlockCount}
        />
        <EntityForm
          entities={entities}
          setEntities={setEntities}
          entityCount={entityCount}
          setEntityCount={setEntityCount}
        />
        <ObjectList
          blocks={blocks}
          setBlocks={setBlocks}
          selectedTargetId={selectedTargetId}
          setSelectedTargetId={setSelectedTargetId}
        />
      </div>
      <canvas
        className="border border-slate-400 hidden"
        id="canvas-main"
        ref={canvasRef}
        onBlur={() => undefined}
      />
      <Viewport
        canvasViewportRef={canvasViewportRef}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleMouseOut={handleMouseOut}
      />
      <Minimap
        canvasMinimapRef={canvasMinimapRef}
        canvasViewportRef={canvasViewportRef}
        drawMinimap={drawMinimap}
        drawViewport={drawViewport}
        setViewportPosition={setViewportPosition}
        mouseDown={mouseDown}
        setMouseDown={setMouseDown}
        setMouseDownPos={setMouseDownPos}
        mouseDownPos={mouseDownPos}
      />
    </div>
  );
}

export default App;
