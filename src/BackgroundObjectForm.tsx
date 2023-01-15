import React, { Dispatch, SetStateAction, ChangeEvent } from 'react';

type BackgroundObjectFormProps = {
  setBackground: Dispatch<SetStateAction<HTMLImageElement | null>>;
};

function BackgroundObjectForm({ setBackground }: BackgroundObjectFormProps) {
  const labelStyle = 'text-sm text-slate-500 pr-1';

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Create new image object
      const image = new Image();
      image.src = URL.createObjectURL(event.target.files[0]);
      image.onload = () => {
        setBackground(image);
      };
    }
  };

  return (
    <form>
      <label
        className={labelStyle}
        id="background-upload-label"
        htmlFor="background-upload"
      >
        <input
          id="background-upload"
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileUpload}
        />
      </label>
    </form>
  );
}

export default BackgroundObjectForm;
