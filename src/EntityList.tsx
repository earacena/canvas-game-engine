import React from 'react';
import type { Entity } from './common.types';

type EntityListProps = {
  entities: Entity[],
};

function EntityList({
  entities,
}: EntityListProps) {
  return (
    <ul>
      {entities.map((e) => {
        <li id={e.id}>
          {e.name}
        </li>
      })}
    </ul>
  );
}

export default EntityList;