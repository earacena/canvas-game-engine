import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export type ObjectFormData = {
  objectName: string;
  objectX: number;
  objectY: number;
  objectWidth: number;
  objectHeight: number;
  objectType: string;
  objectColor: string;
};

type ObjectFormProps = {
  addBlock: (data: ObjectFormData) => void;
  objectFormOpened: boolean;
};

const ObjectDataSchema = yup
  .object({
    objectName: yup.string().required(),
    objectX: yup.number().integer().required(),
    objectY: yup.number().integer().required(),
    objectWidth: yup.number().positive().required(),
    objectHeight: yup.number().positive().required(),
    objectType: yup.string().required(),
    objectColor: yup.string().required(),
  })
  .required();

function ObjectForm({ addBlock, objectFormOpened }: ObjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ObjectFormData>({
    resolver: yupResolver(ObjectDataSchema),
  });

  const onSubmit: SubmitHandler<ObjectFormData> = (data: ObjectFormData) => {
    if (data.objectType === 'block') {
      addBlock(data);
    }
  };

  return (
    <form
      className={`flex flex-col border border-slate-500 rounded-md ${objectFormOpened ? '' : 'hidden'}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <label id="object-name-label" htmlFor="object-name-input">
        Object Name
        <span className="text-red-700">{errors.objectName?.message}</span>
        <input id="object-name-input" {...register('objectName')} />
      </label>

      <label id="object-x-label" htmlFor="object-x-input">
        X Position
        <span className="text-red-700">{errors.objectX?.message}</span>
        <input id="object-x-input" defaultValue={0} {...register('objectX')} />
      </label>

      <label id="object-y-label" htmlFor="object-y-input">
        Y Position
        <span className="text-red-700">{errors.objectY?.message}</span>
        <input id="object-y-input" defaultValue={0} {...register('objectY')} />
      </label>

      <label id="object-width-label" htmlFor="object-width-input">
        Width
        <span className="text-red-700">{errors.objectWidth?.message}</span>
        <input id="object-width-input" {...register('objectWidth')} />
      </label>

      <label id="object-height-label" htmlFor="object-height-input">
        Height
        <span className="text-red-700">{errors.objectHeight?.message}</span>
        <input id="object-height-input" {...register('objectHeight')} />
      </label>

      <label id="object-type-label" htmlFor="object-type-select">
        Type
        <select id="object-type-select" {...register('objectType')}>
          <option value="block">Block</option>
        </select>
      </label>

      <label id="object-color-label" htmlFor="object-color-select">
        Color
        <span className="text-red-700">{errors.objectName?.message}</span>
        <select id="object-color-select" {...register('objectColor')}>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
        </select>
      </label>

      <button type="submit">Create</button>
    </form>
  );
}

export default ObjectForm;
