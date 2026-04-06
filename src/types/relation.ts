export type RelationType = 'INSTANCE_OF' | 'INHERITS_FROM' | 'ASSOCIATION';

export interface Relation {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  type: RelationType;
}
