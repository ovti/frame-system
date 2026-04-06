import type { Relation } from './relation';

export type FrameType = 'OBJECT' | 'CLASS';

export type AspectType = 'VALUE' | 'RANGE' | 'DEFAULT';

export type DemonType =
  | 'IF_NEEDED'
  | 'IF_ADDED'
  | 'IF_UPDATED'
  | 'IF_REMOVED'
  | 'IF_READ'
  | 'IF_NEW';

export interface FrameAspect {
  id: string;
  type: AspectType;
  value: string;
}

export interface FrameDemon {
  id: string;
  type: DemonType;
  description: string;
}

export interface FrameSlot {
  id: string;
  name: string;
  aspects: FrameAspect[];
  demons?: FrameDemon[];
}

export interface Frame {
  id: string;
  name: string;
  type: FrameType;
  description?: string;
  parentIds: string[];
  childIds: string[];
  slots: FrameSlot[];
  relations: Relation[];
}
