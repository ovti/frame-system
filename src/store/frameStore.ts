import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Frame } from '../types/frame'
import type { Relation } from '../types/relation'
import { sampleFrames } from '../data/sampleFrames'
import { sampleRelations } from '../data/sampleRelations'

interface FrameStore {
  frames: Frame[]
  relations: Relation[]
  selectedFrame: Frame | null

  addFrame: (frame: Frame) => void
  updateFrame: (updatedFrame: Frame) => void
  deleteFrame: (frameId: string) => void
  selectFrame: (frame: Frame | null) => void

  addRelation: (relation: Relation) => void
  deleteRelation: (relationId: string) => void

  resetStore: () => void
}

const addUniqueId = (ids: string[], id: string) => {
  return ids.includes(id) ? ids : [...ids, id]
}

const removeId = (ids: string[], id: string) => {
  return ids.filter((item) => item !== id)
}

export const useFrameStore = create<FrameStore>()(
  persist(
    (set) => ({
      frames: sampleFrames,
      relations: sampleRelations,
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
              parentIds: removeId(frame.parentIds, frameId),
              childIds: removeId(frame.childIds, frameId),
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
        set((state) => {
          const relationAlreadyExists = state.relations.some(
            (item) =>
              item.sourceId === relation.sourceId &&
              item.targetId === relation.targetId &&
              item.type === relation.type &&
              item.label === relation.label,
          )

          if (relationAlreadyExists) {
            return state
          }

          let updatedFrames = state.frames

          if (relation.type === 'INHERITS_FROM') {
            updatedFrames = state.frames.map((frame) => {
              if (frame.id === relation.sourceId) {
                return {
                  ...frame,
                  parentIds: addUniqueId(frame.parentIds, relation.targetId),
                }
              }

              if (frame.id === relation.targetId) {
                return {
                  ...frame,
                  childIds: addUniqueId(frame.childIds, relation.sourceId),
                }
              }

              return frame
            })
          }

          return {
            frames: updatedFrames,
            relations: [...state.relations, relation],
          }
        }),

      deleteRelation: (relationId) =>
        set((state) => {
          const relationToDelete = state.relations.find(
            (relation) => relation.id === relationId,
          )

          if (!relationToDelete) {
            return state
          }

          let updatedFrames = state.frames

          if (relationToDelete.type === 'INHERITS_FROM') {
            updatedFrames = state.frames.map((frame) => {
              if (frame.id === relationToDelete.sourceId) {
                return {
                  ...frame,
                  parentIds: removeId(
                    frame.parentIds,
                    relationToDelete.targetId,
                  ),
                }
              }

              if (frame.id === relationToDelete.targetId) {
                return {
                  ...frame,
                  childIds: removeId(
                    frame.childIds,
                    relationToDelete.sourceId,
                  ),
                }
              }

              return frame
            })
          }

          return {
            frames: updatedFrames,
            relations: state.relations.filter(
              (relation) => relation.id !== relationId,
            ),
          }
        }),

      resetStore: () =>
        set(() => ({
          frames: sampleFrames,
          relations: sampleRelations,
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
)