# GRAGRAFRAME — Code Snippets

Selected code snippets from the implementation of the frame system modeling module,
organized to follow Chapter 5 (System Design and Implementation). Each snippet lists
the source file it originates from and a short description. Long fragments are
abridged; omitted parts are marked with `// ...`.

---

## 1. Data Model (TypeScript types)

### `src/types/frame.ts` — Frame structure

Type definitions for frames: a frame is either a `CLASS` or an `OBJECT`, contains
slots describing its properties, each slot holding facets (`VALUE`, `RANGE`,
`DEFAULT`) and optional demons (procedural attachments such as `IF_NEEDED`,
`IF_ADDED`). This is the precise modeling of graph node data mentioned in
section 5.1.1.

```typescript
export type FrameType = 'OBJECT' | 'CLASS';

export type FacetType = 'VALUE' | 'RANGE' | 'DEFAULT';

export type DemonType =
  'IF_NEEDED' | 'IF_ADDED' | 'IF_UPDATED' | 'IF_REMOVED' | 'IF_READ' | 'IF_NEW';

export interface FrameFacet {
  id: string;
  type: FacetType;
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
  facets: FrameFacet[];
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
}
```

### `src/types/relation.ts` — Relation structure

Type definitions for relations (graph edges). Each relation connects a source
frame with a target frame and carries a label used as the edge label in the IE
graph. The `layoutRole` controls how the edge influences the automatic graph
layout, and `category` assigns the relation to one of the predefined semantic
sets.

```typescript
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
```

---

## 2. Styling with Tailwind CSS

### `src/styles/uiClasses.ts` — Shared UI class constants

Styling is implemented with Tailwind CSS utility classes (section 5.1.4).
Recurring control styles — buttons and form inputs — are defined once as shared
constants and imported by the components, which keeps the visual appearance
consistent across all application views.

```typescript
export const primaryButtonClass =
  'w-full cursor-pointer rounded-xl bg-slate-900 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-slate-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 active:bg-slate-950 sm:w-auto';

export const secondaryButtonClass =
  'w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:bg-slate-200 sm:w-auto';

export const dangerButtonClass =
  'w-full cursor-pointer rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:bg-red-100 sm:w-auto';

export const inputClass =
  'w-full rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-300';

export const helperTextClass = 'mt-1 text-xs text-slate-400';
```

---

## 3. Application State Management

### `src/store/frameStore.ts` — Central application store

A Zustand store acting as the single source of truth for the whole module. It
holds the frames, the relations, and the manually adjusted graph node positions,
and persists them in the browser's `localStorage`, so the modeled system
survives page reloads. The excerpt shows the store interface and persistence
configuration.

```typescript
interface FrameStore {
  frames: Frame[];
  relations: Relation[];
  nodePositions: GraphNodePositions;

  addFrame: (frame: Frame) => void;
  updateFrame: (updatedFrame: Frame) => void;
  deleteFrame: (frameId: string) => void;

  addRelation: (relation: Relation) => void;
  deleteRelation: (relationId: string) => void;

  setNodePositions: (positions: GraphNodePositions) => void;

  resetStore: () => void;
}

export const useFrameStore = create<FrameStore>()(
  persist(
    (set) => ({
      frames: sampleFrames,
      relations: sampleRelations,
      // ...
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
```

### `src/store/frameStore.ts` — Keeping the frame hierarchy consistent

When a relation is added, the store also updates the frame hierarchy: an
`INHERITS_FROM` relation registers the target frame as a parent of the source
frame (and vice versa for children). Duplicate relations are rejected. This
guarantees that the hierarchy shown in the frame details view always matches
the relation list.

```typescript
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

    // ...

    return {
      frames: updatedFrames,
      relations: [...state.relations, relation],
    };
  }),
```

---

## 4. Application Views and Navigation

### `src/App.tsx` — Routing between application views

React Router configuration defining the application structure described in
section 5.2: the landing page, and the module views (dashboard, graph, frame
list, relation list, export, info) nested inside a shared layout with the top
header and side navigation menu.

```tsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/app" element={<MainLayout />}>
        <Route index element={<ModuleFunctionalitiesPage />} />
        <Route path="dashboard" element={<HomePage />} />
        <Route path="graph" element={<GraphPage />} />
        <Route path="frames" element={<FramesPage />} />
        <Route path="relations" element={<RelationsPage />} />
        <Route path="export" element={<ExportPage />} />
        <Route path="info" element={<InfoPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

### `src/pages/HomePage.tsx` — Statistics panel (section 5.2.3)

The statistics panel computes the model summary directly from the store: the
number of frames, relations, classes, and objects currently in the system.

```tsx
function HomePage() {
  const { frames, relations } = useFrameStore();

  const classCount = frames.filter((frame) => frame.type === 'CLASS').length;
  const objectCount = frames.filter((frame) => frame.type === 'OBJECT').length;

  const stats = [
    { label: 'Number of frames', value: frames.length },
    { label: 'Number of relations', value: relations.length },
    { label: 'Classes', value: classCount },
    { label: 'Objects', value: objectCount },
  ];

  // ...
}
```

---

## 5. Graph Visualization (section 5.2.4)

### `src/components/graph/PersonNode.tsx` — Custom React Flow node

A custom node type rendering a frame as a card with its name and type
(`OBJECT`/`CLASS`). Each side of the node exposes several invisible connection
handles, so edges can attach at different points and avoid overlapping when a
node participates in many relations.

```tsx
const HANDLE_POSITIONS = ['18%', '34%', '50%', '66%', '82%'];

function PersonNode({ data, selected }: NodeProps) {
  const typedData = data as unknown as PersonNodeData;

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border-2 bg-white text-center shadow-sm transition ${
        selected ? 'border-slate-900' : 'border-slate-300'
      }`}
    >
      {HANDLE_POSITIONS.map((position, index) => (
        <Handle
          key={`top-source-${index}`}
          id={`top-source-${index}`}
          type="source"
          position={Position.Top}
          style={{ left: position }}
        />
      ))}

      {/* ... analogous handles for the remaining sides ... */}

      <div className="text-base font-semibold text-slate-900">
        {typedData.label}
      </div>

      <div className="mt-1 text-[10px] font-medium tracking-wide text-slate-500 uppercase">
        {typedData.type}
      </div>
    </div>
  );
}
```

### `src/components/graph/GraphCanvas.tsx` — Layout role of an edge

Each edge is assigned a layout role. `TREE` edges (inheritance, instance-of,
parent–child relations) define the hierarchical layout of the graph, while
`CROSS` and `LATERAL` edges (e.g. the symmetric `spouse` relation) are drawn
without influencing node placement.

```typescript
function getEdgeLayoutRole(edge: Edge): RelationLayoutRole {
  const edgeData = getEdgeData(edge);

  if (edgeData.layoutRole) {
    return edgeData.layoutRole;
  }

  if (
    edgeData.relationType === 'INHERITS_FROM' ||
    edgeData.relationType === 'INSTANCE_OF'
  ) {
    return 'TREE';
  }

  return 'CROSS';
}
```

### `src/components/graph/GraphCanvas.tsx` — Automatic hierarchical layout

Automatic node placement is computed with the dagre library: only `TREE` edges
are passed to the layout engine, producing a readable top-to-bottom hierarchy
(e.g. parents above children in the family example). Positions manually
adjusted by the user are stored and take precedence over the computed layout.

```typescript
function getDagreLayoutedElements(nodes: Node[], edges: Edge[]) {
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: 'TB',
    nodesep: 240,
    ranksep: 170,
    marginx: 120,
    marginy: 100,
    ranker: 'network-simplex',
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.filter(isTreeEdge).forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const layoutedNode = dagreGraph.node(node.id);

    if (!layoutedNode) {
      return node;
    }

    return {
      ...node,
      position: {
        x: layoutedNode.x - NODE_WIDTH / 2,
        y: layoutedNode.y - NODE_HEIGHT / 2,
      },
    };
  });

  // ...
}
```

---

## 6. Creating Frames and Relations (sections 5.2.7–5.2.9)

### `src/components/frame/FrameForm.tsx` — Frame form validation

The frame creation/editing form validates user input before saving: the name is
required and length-limited, and every slot must be named. A new frame receives
a generated unique identifier.

```typescript
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError('');

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();

  if (!trimmedName) {
    setError('Frame name is required.');
    return;
  }

  if (trimmedName.length > FRAME_NAME_MAX_LENGTH) {
    setError(
      `Frame name can contain up to ${FRAME_NAME_MAX_LENGTH} characters.`,
    );
    return;
  }

  const hasInvalidSlot = slots.some((slot) => !slot.name.trim());

  if (hasInvalidSlot) {
    setError('Each slot must have a name.');
    return;
  }

  const frame: Frame = {
    id: initialFrame?.id ?? crypto.randomUUID(),
    name: trimmedName,
    type,
    description: trimmedDescription,
    // ...
  };

  // ...
};
```

### `src/data/relationPresets.ts` — Predefined relation sets

Relations are not arbitrary strings: the user chooses them from predefined
semantic sets (section 5.2.8). The excerpt shows the family relations group
used in the example — `spouse` is symmetric and lateral, while `child` and
`parent` are tree-forming relations.

```typescript
export const relationPresetGroups: RelationPresetGroup[] = [
  {
    id: 'FAMILY',
    name: 'Family relations',
    description: 'Relations describing people and family dependencies.',
    relations: [
      {
        id: 'spouse',
        label: 'spouse',
        type: 'ASSOCIATION',
        category: 'FAMILY',
        description: 'A symmetric family relation between two people.',
        layoutRole: 'LATERAL',
      },
      {
        id: 'child',
        label: 'child',
        type: 'ASSOCIATION',
        category: 'FAMILY',
        description:
          'A family relation from a parent to a child, e.g. Anna → Piotr.',
        layoutRole: 'TREE',
      },
      {
        id: 'parent',
        label: 'parent',
        type: 'ASSOCIATION',
        category: 'FAMILY',
        description:
          'A family relation from a child to a parent, e.g. Piotr → Anna.',
        layoutRole: 'TREE',
      },
    ],
  },
  // ... FRAME_SYSTEM and MECHANICAL_PART groups ...
];
```

### `src/relation/RelationForm.tsx` — Semantic validation of a new relation

Before a relation is saved, the form verifies its semantic correctness: a frame
cannot be related to itself, inheritance is allowed only between classes, and
the instance relation requires the OBJECT → CLASS structure (section 5.2.9).

```typescript
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError('');

  if (!sourceId || !targetId) {
    setError('Select the source and target frame.');
    return;
  }

  if (sourceId === targetId) {
    setError('A frame cannot be related to itself.');
    return;
  }

  // ...

  if (
    selectedPreset.type === 'INHERITS_FROM' &&
    (sourceFrame.type !== 'CLASS' || targetFrame.type !== 'CLASS')
  ) {
    setError('The inheritance relation is allowed only between classes.');
    return;
  }

  if (
    selectedPreset.type === 'INSTANCE_OF' &&
    (sourceFrame.type !== 'OBJECT' || targetFrame.type !== 'CLASS')
  ) {
    setError('The instance relation requires the OBJECT → CLASS structure.');
    return;
  }

  onSubmit({
    id: crypto.randomUUID(),
    sourceId,
    targetId,
    label,
    relationName: selectedPreset.label,
    type: selectedPreset.type,
    category: selectedPreset.category,
    layoutRole: selectedPreset.layoutRole,
  });

  // ...
};
```

---

## 7. Export to the IE Graph Representation (section 5.2.10)

### `src/services/ieGraphExporter.ts` — Node indexing (LOTT BFS order)

Graph nodes are assigned indices using a deterministic breadth-first traversal
over the undirected graph. Start frames and neighbors are visited in
alphabetical order, so the same model always produces the same node indexing —
a property required by the IE graph representation.

```typescript
function getLottOrder(frames: Frame[], relations: Relation[]): IndexedNode[] {
  const frameMap = new Map(frames.map((frame) => [frame.id, frame]));
  const adjacency = buildUndirectedAdjacency(frames, relations);
  const startFrames = getStartFrames(frames);

  const visited = new Set<string>();
  const orderedIds: string[] = [];

  for (const startFrame of startFrames) {
    if (visited.has(startFrame.id)) continue;

    const queue: string[] = [startFrame.id];

    while (queue.length > 0) {
      const currentId = queue.shift();

      if (!currentId || visited.has(currentId)) continue;

      visited.add(currentId);
      orderedIds.push(currentId);

      const neighbors = [...(adjacency.get(currentId) ?? [])]
        .filter((neighborId) => !visited.has(neighborId))
        .sort((a, b) => {
          const frameA = frameMap.get(a);
          const frameB = frameMap.get(b);

          return (frameA?.name ?? a).localeCompare(frameB?.name ?? b);
        });

      neighbors.forEach((neighborId) => {
        if (!visited.has(neighborId) && !queue.includes(neighborId)) {
          queue.push(neighborId);
        }
      });
    }
  }

  return orderedIds.map((id, index) => {
    const frame = frameMap.get(id);

    return {
      id,
      index: index + 1,
      label: frame ? getNodeLabel(frame) : id,
    };
  });
}
```

### `src/services/ieGraphExporter.ts` — Edge normalization with inverse labels

Every exported edge is oriented from the node with the lower index to the node
with the higher index. If normalization reverses the original direction of a
relation, its label is replaced with the inverse label (e.g. `child^-1`);
symmetric relations such as `spouse` keep their label. The original direction
is preserved in the `original` metadata.

```typescript
const SYMMETRIC_RELATION_NAMES = ['spouse'];

function getInverseName(name: string): string {
  if (SYMMETRIC_RELATION_NAMES.includes(name.toLowerCase())) {
    return name;
  }

  return `${name}^-1`;
}

// inside buildIEEdges:
const directionPreserved = sourceIndex < targetIndex;

const source = directionPreserved ? sourceIndex : targetIndex;
const target = directionPreserved ? targetIndex : sourceIndex;

const exportedLabel = directionPreserved
  ? relation.label
  : getInverseName(relation.label);
```

### `src/services/ieGraphExporter.ts` — Building the exported IE graph document

The final export document combines the indexed node set `V`, the normalized
edge set `E`, the node and edge label alphabets (`Sigma`, `Gamma`), the node
labeling function `phi`, the characteristic description (per-node out-degrees
and edge labels), and the full original frames and relations as the
interpretation of the graph.

```typescript
function buildIEGraphJson(frames: Frame[], relations: Relation[]): IEGraphJson {
  const order = getLottOrder(frames, relations);
  const edges = buildIEEdges(relations, order);
  const V = buildIEGraphNodes(frames, order);

  return {
    format: 'IE_GRAPH_JSON',
    version: '1.1',
    graph: {
      V,
      E: edges,
      Sigma: buildSigma(frames),
      Gamma: buildGamma(edges),
      relationNames: buildRelationNames(edges),
      phi: buildPhi(order),
    },
    indexing: {
      scheme: 'LOTT_BFS',
      order,
    },
    characteristicDescription: buildCharacteristicDescription(order, edges),
    interpretation: {
      entities: frames,
      relations,
    },
  };
}
```

### `src/pages/ExportPage.tsx` — Downloading and saving the export

The export view lets the user copy the generated representation, download it as
a JSON file with a sanitized custom file name, or save it directly on the
server where the inference module can later access it.

```typescript
const handleDownload = () => {
  const blob = new Blob([exportResult.text], {
    type: 'application/json;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${normalizedFileName}.json`;
  link.click();

  URL.revokeObjectURL(url);
};

const handleSaveToServer = async () => {
  // ...
  const response = await fetch('/gragraframe/api/save-export.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: normalizedFileName,
      content: exportResult.text,
    }),
  });
  // ...
};
```
