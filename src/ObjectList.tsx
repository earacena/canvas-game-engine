import React, { ChangeEvent, SetStateAction, useState } from 'react';
import { BsSquareFill } from 'react-icons/bs';
import ObjectForm, { ObjectFormData } from './ObjectForm';
import type { Block } from './common.types';

type ObjectListProps = {
  blocks: Block[];
  blockCount: number;
  setBlocks: (value: React.SetStateAction<Block[]>) => void;
  setBlockCount: (value: React.SetStateAction<number>) => void;
  selectedTargetId: string | null;
  setSelectedTargetId: (value: React.SetStateAction<string | null>) => void;
};

function ObjectList({
  blocks,
  setBlocks,
  setBlockCount,
  blockCount,
  selectedTargetId,
  setSelectedTargetId,
}: ObjectListProps) {
  const [objectFormOpened, setObjectFormOpened] = useState(false);

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
      (newBlocks) => (
        newBlocks.map((b) => (b.id === id ? { ...b, controllable: event.target.checked } : b))
      ),
    );
  };

  const addBlock = (data: ObjectFormData) => {
    // console.log('Adding ', data, ' to: ', blocks);

    setBlocks(
      blocks.concat({
        id: `${blockCount}`,
        name: data.objectName,
        type: data.objectType,
        x: data.objectX,
        y: data.objectY,
        w: data.objectWidth,
        h: data.objectHeight,
        z: blockCount,
        controllable: false,
        color: data.objectColor,
      }),
    );

    setBlockCount((count) => count + 1);
  };

  const objectPropertiesStyle = 'text-sm text-slate-500 pr-1';

  return (
    <div className="w-96">
      Objects
      {' '}
      <button type="button" className={`p-1 m-1 border border-slate-500 ${objectFormOpened ? 'hidden' : ''}`} onClick={() => setObjectFormOpened(true)}>
        Add object
      </button>
      <button type="button" className={`p-1 m-1 border border-slate-500 ${objectFormOpened ? '' : 'hidden'}`} onClick={() => setObjectFormOpened(false)}>
        Close
      </button>
      <ObjectForm objectFormOpened={objectFormOpened} addBlock={addBlock} />
      <ul className="bg-slate-400 rounded-md p-3">
        {blocks.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`flex flex-row items-center bg-slate-100 p-4 w-auto rounded-md ${
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
                  onChange={(event: ChangeEvent<HTMLInputElement>) => handleFileUpload(b.id, event)}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
              <label
                id="controllable-checkbox-label"
                htmlFor="controllable-checkbox"
              >
                Controllable?
                <input
                  id="controllable-checkbox"
                  type="checkbox"
                  onChange={(event) => handleSetControllable(event, b.id)}
                />
              </label>
            </div>
          </button>
        ))}
      </ul>
    </div>
  );
}

export default ObjectList;
