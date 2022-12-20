import React, { ChangeEvent, SetStateAction, useState } from 'react';
import { BsSquareFill } from 'react-icons/bs';
import ObjectForm, { ObjectFormData } from './ObjectForm';
import type { Block } from './common.types';

type ObjectListProps = {
  blocks: Block[];
  blockCount: number;
  setBlocks: (value: React.SetStateAction<Block[]>) => void;
  setBlockCount: (value: React.SetStateAction<number>) => void;
  setSelectedTargetId: (value: React.SetStateAction<string | null>) => void;
};

function ObjectList({
  blocks,
  setBlocks,
  setBlockCount,
  blockCount,
  setSelectedTargetId,
}: ObjectListProps) {
  const [objectFormOpened] = useState(true);

  const handleFileUpload = (
    id: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      // Create new image object
      const image = new Image();
      image.src = URL.createObjectURL(event.target.files[0]);

      // console.log(image.src);

      // Update the selected blocks image
      setBlocks(blocks.map((b) => (b.id === id ? { ...b, image } : b)));
    }
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
      {objectFormOpened && <ObjectForm addBlock={addBlock} />}
      <ul className="bg-slate-400 rounded-md p-3">
        {blocks.map((b) => (
          <button
            key={b.id}
            type="button"
            className="flex flex-row items-center bg-slate-100 p-3 mt-1 rounded-md"
            onClick={() => setSelectedTargetId(b.id)}
          >
            <BsSquareFill className="pr-5" color={b.color} size={50} />
            <div className="flex flex-col items-start">
              <div>
                <span className={objectPropertiesStyle}>ID</span>
                {b.id}
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
              <div
                className="flex flex-start items-center"
              >
                <span className={objectPropertiesStyle}>TEXTURE</span>
                <input
                  type="file"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => handleFileUpload(b.id, event)}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
            </div>
          </button>
        ))}
      </ul>
    </div>
  );
}

export default ObjectList;
