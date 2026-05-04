export type RelationType = 'ASSOCIATION' | 'INSTANCE_OF' | 'INHERITS_FROM';

export type RelationCategory = 'FAMILY' | 'FRAME_SYSTEM' | 'CUSTOM';

export interface Relation {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  type: RelationType;
  category?: RelationCategory;
}
