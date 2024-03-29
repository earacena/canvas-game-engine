import React, { ChangeEvent, SetStateAction } from 'react';
import { BsSquareFill, BsTrash } from 'react-icons/bs';
import type { Block } from './common.types';

type ObjectListProps = {
  blocks: Block[];
  setBlocks: (value: React.SetStateAction<Block[]>) => void;
  selectedTargetId: string | null;
  setSelectedTargetId: (value: React.SetStateAction<string | null>) => void;
};

function ObjectList({
  blocks,
  setBlocks,
  selectedTargetId,
  setSelectedTargetId,
}: ObjectListProps) {
  const handleFileUpload = (
    id: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      // Create new image object
      const image = new Image();
      image.src = URL.createObjectURL(event.target.files[0]);

      // Update the selected blocks image and cached copy
      setBlocks(blocks.map((b) => (b.id === id ? { ...b, image } : b)));
    }
  };

  const handleSetControllable = (
    event: ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    setBlocks(
      (newBlocks) => newBlocks.map(
        (b) => (b.id === id ? { ...b, controllable: event.target.checked } : b),
      ),
    );
  };

  const handleSetLocked = (
    event: ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    // Unlock any other camera locked object and lock desired object
    setBlocks(
      (newBlocks) => newBlocks.map(
        (b) => (
          b.id === id ? { ...b, cameraLocked: event.target.checked } : { ...b, cameraLocked: false }
        ),
      ),
    );
  };

  const handleDelete = (blockId: string) => {
    setBlocks((updatedBlocks) => (
      updatedBlocks.filter((b) => b.id !== blockId)
    ));
  };

  const objectPropertiesStyle = 'text-sm text-slate-500 pr-1';

  return (
    <div className="w-fit">
      <ul className={`bg-slate-400 rounded-md p-1 ${blocks.length === 0 ? 'hidden' : ''} overflow-scroll`}>
        {blocks.map((b) => (
          <div className="flex flex-row">
            <button type="button" onClick={() => handleDelete(b.id)}>
              <BsTrash />
            </button>
            <button
              key={b.id}
              type="button"
              className={`flex flex-row items-center bg-slate-100 p-4 rounded-md m-2 ${
                selectedTargetId === b.id ? 'border-gray-900 border-4' : ''
              }`}
              onClick={() => setSelectedTargetId(b.id)}
            >
              <BsSquareFill className="pr-5" color={b.color} size={50} />
              <div className="flex flex-col items-start">
                <div>
                  <span className={objectPropertiesStyle}>NAME</span>
                  {b.name}
                </div>
                <div>
                  <span className={objectPropertiesStyle}>X</span>
                  {b.x}
                </div>
                <div>
                  <span className={objectPropertiesStyle}>Y</span>
                  {b.y}
                </div>
                <div>
                  <span className={objectPropertiesStyle}>WIDTH</span>
                  {b.w}
                </div>
                <div>
                  <span className={objectPropertiesStyle}>HEIGHT</span>
                  {b.h}
                </div>
                <div className="flex flex-col items-start">
                  <span className={objectPropertiesStyle}>TEXTURE</span>
                  <input
                    type="file"
                    onChange={
                      (event: ChangeEvent<HTMLInputElement>) => handleFileUpload(b.id, event)
                    }
                    accept=".jpg,.jpeg,.png"
                  />
                </div>
                <label
                  id="controllable-checkbox-label"
                  htmlFor="controllable-checkbox"
                >
                  Controllable (WASD)?
                  <input
                    id="controllable-checkbox"
                    type="checkbox"
                    onChange={(event) => handleSetControllable(event, b.id)}
                  />
                </label>
                <label
                  id="locked-camera-checkbox-label"
                  htmlFor="locaked-camera-checkbox"
                >
                  Lock camera?
                  <input
                    id="locked-camera-checkbox"
                    type="checkbox"
                    onChange={(event) => handleSetLocked(event, b.id)}
                  />
                </label>
              </div>
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default ObjectList;
