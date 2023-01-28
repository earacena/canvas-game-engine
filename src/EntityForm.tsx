import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Entity } from './common.types';

export type EntityFormData = {
  entityName: string;
  entityX: number;
  entityY: number;
  entityWidth: number;
  entityHeight: number;
  entityType: string;
  entityMovementType?: string,
  entityHealth?: number,
  entityAttackDamage?: number,
};

type EntityFormProps = {
  entities: Entity[],
  setEntities: (value: React.SetStateAction<Entity[]>) => void,
  entityCount: number,
  setEntityCount: (value: React.SetStateAction<number>) => void,
};

const EntityDataSchema = yup
  .object({
    entityName: yup.string().required(),
    entityX: yup.number().integer().required(),
    entityY: yup.number().integer().required(),
    entityWidth: yup.number().positive().required(),
    entityHeight: yup.number().positive().required(),
    entityType: yup.string().required(),
    entityMovementType: yup.string(),
    entityHealth: yup.number(),
    entityAttackDamage: yup.number(),
  })
  .required();

function ObjectForm({
  entities,
  setEntities,
  entityCount,
  setEntityCount,
}: EntityFormProps) {
  const [objectFormOpened, setObjectFormOpened] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EntityFormData>({
    resolver: yupResolver(EntityDataSchema),
  });

  const addEntity = (data: EntityFormData) => {
    setEntities(
      entities.concat({
        id: `${entityCount}`,
        name: data.entityName,
        type: data.entityType,
        x: data.entityX,
        y: data.entityY,
        w: data.entityWidth,
        h: data.entityHeight,
        movementType: data.entityMovementType,
        health: data.entityHealth,
        attackDamage: data.entityAttackDamage,
      }),
    );

    setEntityCount((count) => count + 1);
  };

  const onSubmit: SubmitHandler<EntityFormData> = (data: EntityFormData) => {
    addEntity(data);
  };

  const labelStyle: string = 'm-1';
  const inputStyle: string = 'm-1 p-1 rounded-md';

  return (
    <div>
      <button
        type="button"
        className={`p-1 m-1 border border-slate-500 ${
          objectFormOpened ? 'hidden' : ''
        }`}
        onClick={() => setObjectFormOpened(true)}
      >
        Add entity
      </button>
      <button
        type="button"
        className={`p-1 m-1 border border-slate-500 ${
          objectFormOpened ? '' : 'hidden'
        }`}
        onClick={() => setObjectFormOpened(false)}
      >
        Close
      </button>
      <form
        className={`flex flex-col border border-slate-500 rounded-md ${objectFormOpened ? '' : 'hidden'}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <label id="entity-name-label" htmlFor="entity-name-input" className={labelStyle}>
          Entity Name
          <span className="text-red-700">{errors.entityName?.message}</span>
          <input id="entity-name-input" className={inputStyle} {...register('entityName')} />
        </label>

        <label id="entity-x-label" htmlFor="entity-x-input" className={labelStyle}>
          X Position
          <span className="text-red-700">{errors.entityX?.message}</span>
          <input id="entity-x-input" className={inputStyle} defaultValue={0} {...register('entityX')} />
        </label>

        <label id="entity-y-label" htmlFor="entity-y-input" className={labelStyle}>
          Y Position
          <span className="text-red-700">{errors.entityY?.message}</span>
          <input id="entity-y-input" className={inputStyle} defaultValue={0} {...register('entityY')} />
        </label>

        <label id="entity-width-label" htmlFor="entity-width-input" className={labelStyle}>
          Width
          <span className="text-red-700">{errors.entityWidth?.message}</span>
          <input id="entity-width-input" className={inputStyle} {...register('entityWidth')} />
        </label>

        <label id="entity-height-label" htmlFor="entity-height-input" className={labelStyle}>
          Height
          <span className="text-red-700">{errors.entityHeight?.message}</span>
          <input id="entity-height-input" className={inputStyle} {...register('entityHeight')} />
        </label>

        <label id="entity-type-label" htmlFor="entity-type-select" className={labelStyle}>
          Type
          <select id="entity-type-select" className={inputStyle} {...register('entityType')}>
            <option value="player">Player</option>
            <option value="enemy">Enemy</option>
          </select>
        </label>

        <label id="entity-move-type-label" htmlFor="entity-move-type-select" className={labelStyle}>
          Type
          <select id="entity-move-type-select" className={inputStyle} {...register('entityMovementType')}>
            <option value="random">Random</option>
            <option value="static">Stationary</option>
            <option value="timed">Move with timer</option>
          </select>
        </label>

        <label id="entity-health-label" htmlFor="entity-health-input" className={labelStyle}>
          Health
          <span className="text-red-700">{errors.entityHeight?.message}</span>
          <input id="entity-health-input" className={inputStyle} {...register('entityHealth')} />
        </label>

        <label id="entity-height-label" htmlFor="entity-height-input" className={labelStyle}>
          Height
          <span className="text-red-700">{errors.entityHeight?.message}</span>
          <input id="entity-height-input" className={inputStyle} {...register('entityHeight')} />
        </label>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default ObjectForm;
