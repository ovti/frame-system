export type RelationType = 'ASSOCIATION' | 'INSTANCE_OF' | 'INHERITS_FROM';

export type RelationCategory = 'FAMILY' | 'FRAME_SYSTEM' | 'MECHANICAL_PART';

export type RelationLayoutRole = 'TREE' | 'CROSS' | 'LATERAL';

export interface Relation {
  id: string;
  sourceId: string;
  targetId: string;

  label: string;

  relationName?: string;

  type: RelationType;
  category?: RelationCategory;
  layoutRole?: RelationLayoutRole;
}
