import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { sampleFrames } from '../data/sampleFrames';
import type { Frame } from '../types/frame';
import type { Relation } from '../types/relation';

const initialRelations: Relation[] = sampleFrames.flatMap(
  (frame) => frame.relations,
);

interface FrameStore {
  frames: Frame[];
  relations: Relation[];
  selectedFrame: Frame | null;

  addFrame: (frame: Frame) => void;
  updateFrame: (updatedFrame: Frame) => void;
  deleteFrame: (frameId: string) => void;
  selectFrame: (frame: Frame | null) => void;

  addRelation: (relation: Relation) => void;
  deleteRelation: (relationId: string) => void;

  resetStore: () => void;
}

export const useFrameStore = create<FrameStore>()(
  persist(
    (set) => ({
      frames: sampleFrames,
      relations: initialRelations,
      selectedFrame: null,

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
        set((state) => ({
          frames: state.frames
            .filter((frame) => frame.id !== frameId)
            .map((frame) => ({
              ...frame,
              parentIds: frame.parentIds.filter((id) => id !== frameId),
              childIds: frame.childIds.filter((id) => id !== frameId),
            })),
          relations: state.relations.filter(
            (relation) =>
              relation.sourceId !== frameId && relation.targetId !== frameId,
          ),
          selectedFrame:
            state.selectedFrame?.id === frameId ? null : state.selectedFrame,
        })),

      selectFrame: (frame) =>
        set(() => ({
          selectedFrame: frame,
        })),

      addRelation: (relation) =>
        set((state) => ({
          relations: [...state.relations, relation],
        })),

      deleteRelation: (relationId) =>
        set((state) => ({
          relations: state.relations.filter(
            (relation) => relation.id !== relationId,
          ),
        })),

      resetStore: () =>
        set(() => ({
          frames: sampleFrames,
          relations: initialRelations,
          selectedFrame: null,
        })),
    }),
    {
      name: 'ie-graph-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        frames: state.frames,
        relations: state.relations,
      }),
    },
  ),
);
