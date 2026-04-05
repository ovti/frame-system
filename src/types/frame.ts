import type { Relation } from './relation';

export interface FrameAttribute {
  key: string;
  value: string;
}

export interface Frame {
  id: string;
  name: string;
  type: string;
  description?: string;
  attributes: FrameAttribute[];
  relations: Relation[];
}
