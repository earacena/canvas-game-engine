import React from 'react';

export type Block = {
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  z: number, 
};

type ObjectListProps = {
  blocks: Block[];
};

function ObjectList({ blocks }: ObjectListProps) {
  return (
    <div>
      Blocks
      <ul>
        {blocks.map((b) => (
          <li>
            id: {b.id} x: {b.x} y: {b.y} w: {b.w} h: {b.h}
          </li>
        ))}

      </ul>
    </div>
  );
}

export default ObjectList;


