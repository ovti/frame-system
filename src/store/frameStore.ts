import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { sampleFrames } from '../data/sampleFrames';
import { sampleRelations } from '../data/sampleRelations';
import type { Frame } from '../types/frame';
import type { GraphNodePositions } from '../types/graph';
import type { Relation } from '../types/relation';

interface FrameStore {
  frames: Frame[];
  relations: Relation[];
  selectedFrame: Frame | null;
  nodePositions: GraphNodePositions;

  addFrame: (frame: Frame) => void;
  updateFrame: (updatedFrame: Frame) => void;
  deleteFrame: (frameId: string) => void;
  selectFrame: (frame: Frame | null) => void;

  addRelation: (relation: Relation) => void;
  deleteRelation: (relationId: string) => void;

  setNodePositions: (positions: GraphNodePositions) => void;
  clearNodePositions: () => void;

  resetStore: () => void;
}

const addUniqueId = (ids: string[], id: string) => {
  return ids.includes(id) ? ids : [...ids, id];
};

const removeId = (ids: string[], id: string) => {
  return ids.filter((item) => item !== id);
};

const shouldUpdateMechanicalChildFrames = (relation: Relation) => {
  return (
    relation.category === 'MECHANICAL_PART' && relation.layoutRole === 'TREE'
  );
};

export const useFrameStore = create<FrameStore>()(
  persist(
    (set) => ({
      frames: sampleFrames,
      relations: sampleRelations,
      selectedFrame: null,
      nodePositions: {},

      addFrame: (frame) =>
        set((state) => ({
          frames: [...state.frames, frame],
        })),

      updateFrame: (updatedFrame) =>
        set((state) => ({
          frames: state.frames.map((frame) =>
            frame.id === updatedFrame.id ? updatedFrame : frame,
          ),
        })),

      deleteFrame: (frameId) =>
        set((state) => {
          const nextNodePositions = { ...state.nodePositions };
          delete nextNodePositions[frameId];

          return {
            frames: state.frames
              .filter((frame) => frame.id !== frameId)
              .map((frame) => ({
                ...frame,
                parentIds: removeId(frame.parentIds, frameId),
                childIds: removeId(frame.childIds, frameId),
              })),
            relations: state.relations.filter(
              (relation) =>
                relation.sourceId !== frameId && relation.targetId !== frameId,
            ),
            selectedFrame:
              state.selectedFrame?.id === frameId ? null : state.selectedFrame,
            nodePositions: nextNodePositions,
          };
        }),

      selectFrame: (frame) =>
        set(() => ({
          selectedFrame: frame,
        })),

      addRelation: (relation) =>
        set((state) => {
          const relationAlreadyExists = state.relations.some(
            (item) =>
              item.sourceId === relation.sourceId &&
              item.targetId === relation.targetId &&
              item.type === relation.type &&
              item.label === relation.label &&
              item.relationName === relation.relationName,
          );

          if (relationAlreadyExists) {
            return state;
          }

          let updatedFrames = state.frames;

          if (relation.type === 'INHERITS_FROM') {
            updatedFrames = updatedFrames.map((frame) => {
              if (frame.id === relation.sourceId) {
                return {
                  ...frame,
                  parentIds: addUniqueId(frame.parentIds, relation.targetId),
                };
              }

              if (frame.id === relation.targetId) {
                return {
                  ...frame,
                  childIds: addUniqueId(frame.childIds, relation.sourceId),
                };
              }

              return frame;
            });
          }

          if (shouldUpdateMechanicalChildFrames(relation)) {
            updatedFrames = updatedFrames.map((frame) => {
              if (frame.id === relation.sourceId) {
                return {
                  ...frame,
                  childIds: addUniqueId(frame.childIds, relation.targetId),
                };
              }

              return frame;
            });
          }

          return {
            frames: updatedFrames,
            relations: [...state.relations, relation],
          };
        }),

      deleteRelation: (relationId) =>
        set((state) => {
          const relationToDelete = state.relations.find(
            (relation) => relation.id === relationId,
          );

          if (!relationToDelete) {
            return state;
          }

          let updatedFrames = state.frames;

          if (relationToDelete.type === 'INHERITS_FROM') {
            updatedFrames = updatedFrames.map((frame) => {
              if (frame.id === relationToDelete.sourceId) {
                return {
                  ...frame,
                  parentIds: removeId(
                    frame.parentIds,
                    relationToDelete.targetId,
                  ),
                };
              }

              if (frame.id === relationToDelete.targetId) {
                return {
                  ...frame,
                  childIds: removeId(frame.childIds, relationToDelete.sourceId),
                };
              }

              return frame;
            });
          }

          if (shouldUpdateMechanicalChildFrames(relationToDelete)) {
            updatedFrames = updatedFrames.map((frame) => {
              if (frame.id === relationToDelete.sourceId) {
                return {
                  ...frame,
                  childIds: removeId(frame.childIds, relationToDelete.targetId),
                };
              }

              return frame;
            });
          }

          return {
            frames: updatedFrames,
            relations: state.relations.filter(
              (relation) => relation.id !== relationId,
            ),
          };
        }),

      setNodePositions: (positions) =>
        set(() => ({
          nodePositions: positions,
        })),

      clearNodePositions: () =>
        set(() => ({
          nodePositions: {},
        })),

      resetStore: () =>
        set(() => ({
          frames: sampleFrames,
          relations: sampleRelations,
          selectedFrame: null,
          nodePositions: {},
        })),
    }),
    {
      name: 'ie-graph-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        frames: state.frames,
        relations: state.relations,
        nodePositions: state.nodePositions,
      }),
    },
  ),
);
