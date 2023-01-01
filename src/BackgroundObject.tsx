import React, { Dispatch, SetStateAction } from 'react';
import BackgroundObjectForm from './BackgroundObjectForm';

type BackgroundObjectProps = {
  background: HTMLImageElement | null,
  setBackground: Dispatch<SetStateAction<HTMLImageElement | null>>;
};

function BackgroundObject({ background, setBackground }: BackgroundObjectProps) {
  return (
    <div>
      Background
      {background === null && 'Upload a background'}
      {background !== null && `${background.id}`}
      <BackgroundObjectForm
        setBackground={setBackground}
      />
    </div>
  );
}

export default BackgroundObject;
