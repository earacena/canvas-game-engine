import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Block } from "./ObjectList";
import * as yup from "yup";

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
  blocks: Block[];
  addBlock: (data: ObjectFormData) => void;
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

function ObjectForm({ blocks, addBlock }: ObjectFormProps) {
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
      className="flex flex-col border border-slate-500 rounded-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label id="object-name-label" htmlFor="object-name-input">
        Object Name
      </label>
      <span className="text-red-700">{errors.objectName?.message}</span>
      <input id="object-name-input" {...register("objectName")} />

      <label id="object-x-label" htmlFor="object-x-input">
        X Position
      </label>
      <span className="text-red-700">{errors.objectX?.message}</span>
      <input id="object-x-input" defaultValue={0} {...register("objectX")} />

      <label id="object-y-label" htmlFor="object-y-input">
        Y Position
      </label>
      <span className="text-red-700">{errors.objectY?.message}</span>
      <input id="object-y-input" defaultValue={0} {...register("objectY")} />

      <label id="object-width-label" htmlFor="object-width-input">
        Width
      </label>
      <span className="text-red-700">{errors.objectWidth?.message}</span>
      <input id="object-width-input" {...register("objectWidth")} />

      <label id="object-height-label" htmlFor="object-height-input">
        Height
      </label>
      <span className="text-red-700">{errors.objectHeight?.message}</span>
      <input id="object-height-input" {...register("objectHeight")} />

      <label id="object-type-label" htmlFor="object-type-select">
        Type
      </label>
      <select id="object-type-select" {...register("objectType")}>
        <option value="block">Block</option>
      </select>

      <label id="object-color-label" htmlFor="object-color-select">
        Color
      </label>
      <span className="text-red-700">{errors.objectName?.message}</span>
      <select id="object-color-select" {...register("objectColor")}>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
      </select>

      <button type="submit">Create</button>
    </form>
  );
}

export default ObjectForm;
