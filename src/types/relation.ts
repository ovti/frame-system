export type RelationType = 'ASSOCIATION' | 'INSTANCE_OF' | 'INHERITS_FROM';

export type RelationCategory = 'FAMILY' | 'FRAME_SYSTEM' | 'MECHANICAL_PART';

export type RelationLayoutRole = 'TREE' | 'CROSS' | 'LATERAL';

export interface Relation {
  id: string;
  sourceId: string;
  targetId: string;

  /**
   * Edge label used in the IE graph, e.g. 5, a.5.6, y, child, spouse.
   */
  label: string;

  /**
   * Human-readable relation name, e.g. embedded_in, placed_in, spatial_relation.
   */
  relationName?: string;

  type: RelationType;
  category?: RelationCategory;
  layoutRole?: RelationLayoutRole;
}
