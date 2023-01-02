import React, { Dispatch, SetStateAction } from 'react';
import BackgroundObjectForm from './BackgroundObjectForm';

type BackgroundObjectProps = {
  background: HTMLImageElement | null,
  setBackground: Dispatch<SetStateAction<HTMLImageElement | null>>;
};

function BackgroundObject({ background, setBackground }: BackgroundObjectProps) {
  return (
    <div className="flex flex-col items-center">
      Background
      <span className="slate-500">
        {background === null && 'Upload a background'}
      </span>
      <BackgroundObjectForm
        setBackground={setBackground}
      />
    </div>
  );
}

export default BackgroundObject;
