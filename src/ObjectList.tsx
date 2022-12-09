import React, { SetStateAction, useState } from 'react';
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

  return (
    <div>
      Objects {objectFormOpened && <ObjectForm addBlock={addBlock} blocks={blocks} />}

      <ul className="bg-slate-400 rounded-md p-3">
        {blocks.map((b) => (
          <li key={b.id} className="bg-slate-100 p-3 mt-1 rounded-md">
            
            <div>
              <span className="text-sm text-slate-500">ID</span> {b.id}
              <span className="text-sm text-slate-500">X</span> {b.x}
              <span className="text-sm text-slate-500">Y</span> {b.y}
              <span className="text-sm text-slate-500">WIDTH</span> {b.w}
              <span className="text-sm text-slate-500">HEIGHT</span> {b.h}
            </div>
          </li>
        ))}

      </ul>
    </div>
  );
}

export default ObjectList;


