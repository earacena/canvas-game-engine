import React, { SetStateAction, useState } from 'react';
import { BsSquareFill } from 'react-icons/bs';
import ObjectForm, { ObjectFormData } from './ObjectForm';

export type Block = {
  id: string,
  name: string,
  type: string,
  x: number,
  y: number,
  w: number,
  h: number,
  z: number,
  color?: string,
};

type ObjectListProps = {
  blocks: Block[],
  blockCount: number,
  setBlocks: (value: React.SetStateAction<Block[]>) => void,
  setBlockCount: (value: React.SetStateAction<number>) => void,
};

function ObjectList({ blocks, setBlocks, setBlockCount, blockCount, }: ObjectListProps) {
  const [objectFormOpened, setObjectFormOpened] = useState(true);

  const addBlock = (data: ObjectFormData) => {
    console.log('Adding ', data, ' to: ', blocks);
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
      })
    );
    setBlockCount((count) => count + 1);
  };

  const objectPropertiesStyle = "text-sm text-slate-500 pr-1";

  return (
    <div className="w-96">
      Objects {objectFormOpened && <ObjectForm addBlock={addBlock} blocks={blocks} />}

      <ul className="bg-slate-400 rounded-md p-3">
        {blocks.map((b) => (
          <li key={b.id} className="flex flex-row items-center bg-slate-100 p-3 mt-1 rounded-md">
            <BsSquareFill className="pr-5" color={b.color} size={50}/>
            <div className="flex flex-col">
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
              <input>
                Upload texture
              </input>
            </div>
          </li>
        ))}

      </ul>
    </div>
  );
}

export default ObjectList;


