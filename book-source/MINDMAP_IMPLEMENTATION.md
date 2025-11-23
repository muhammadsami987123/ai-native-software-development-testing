# Mindmap Generator Implementation

## Overview
This implementation provides a complete mindmap generation + history management system using ReactFlow, integrated inside the existing Docusaurus app's right drawer.

## Architecture

### Component Structure
```
src/components/CustomNavbar/mindmap/
├── types.ts                          # TypeScript interfaces
├── index.ts                          # Export barrel file
├── components/
│   ├── MindmapDrawer.tsx            # Main drawer component
│   ├── MindmapDrawer.css
│   ├── LevelSelect.tsx              # Level selection dropdown
│   ├── LevelSelect.css
│   ├── RecentMindmapsList.tsx       # History list component
│   ├── RecentMindmapsList.css
│   ├── MindmapModal.tsx             # ReactFlow viewer modal
│   └── MindmapModal.css
├── hooks/
│   ├── useMindmapGenerator.ts       # Mindmap generation logic
│   └── useMindmapHistory.ts         # LocalStorage history management
└── utils/
    ├── detectLevels.ts              # Dynamic level detection
    └── buildGraph.ts                # ReactFlow graph building
```

### Key Features

#### 1. Level Selection System
The mindmap can be generated at 4 different hierarchy levels:
- **Level 1 (Book Level)**: Shows all parts of the book
- **Level 2 (Chapter Level)**: Shows chapters within parts
- **Level 3 (Lesson Level)**: Shows lessons within chapters
- **Level 4 (Page TOC)**: Shows table of contents of current page

The available levels are detected dynamically from the Docusaurus content structure.

#### 2. Mindmap Generation
- Uses ReactFlow for professional graph visualization
- Auto-layout with configurable node positions
- Interactive nodes with click-to-navigate functionality
- Zoom and pan controls
- Minimap for navigation
- Styled nodes with gradient effects

#### 3. History Management
- Stores generated mindmaps in localStorage
- Recent list shows last 50 mindmaps
- Each entry shows icon, title, and timestamp
- Quick access via "Open" button
- Remove unwanted entries with "×" button

#### 4. Modal Viewer
- Full-screen overlay for viewing mindmaps
- Doesn't interfere with drawer functionality
- Supports zoom, pan, and drag
- ESC key to close
- Node count display
- Helpful usage hints

## Integration

The feature integrates seamlessly with the existing drawer system:

1. **MindmapContent.tsx** - Updated to use the new `MindmapDrawer` component
2. **RightDrawer.tsx** - Already configured to display MindmapContent when title is "Mindmap"
3. **Existing navbar** - Mindmap button already present and functional

## Data Flow

```
User clicks "Generate Mindmap"
    ↓
useMindmapGenerator.generateMindmap(level)
    ↓
buildHierarchyFromSidebar(level) - Fetches content structure
    ↓
hierarchyToGraph(hierarchy, level) - Converts to ReactFlow nodes/edges
    ↓
MindmapData created with id, title, timestamp, nodes, edges
    ↓
useMindmapHistory.addToHistory(mindmap) - Saves to localStorage
    ↓
MindmapModal opens to display the graph
```

## Technologies Used

- **@xyflow/react** (v12.9.3) - ReactFlow library for graph visualization
- **React Hooks** - useState, useEffect, useCallback for state management
- **localStorage API** - Persistent history storage
- **Docusaurus APIs** - Integration with docs structure

## Future Enhancements

Currently, the implementation uses demo data for hierarchy levels 1-3. To fully integrate with the real Docusaurus sidebar structure, you would need to:

1. Parse the actual `sidebars.ts` configuration
2. Access Docusaurus global data for content structure
3. Implement real URL generation for navigation
4. Add support for custom sidebar configurations

The infrastructure is in place at `book-source/src/components/CustomNavbar/mindmap/utils/buildGraph.ts:17-28`.

## Usage

1. Click the Mindmap button in the bottom navbar
2. Select a level from the dropdown (Book Level, Chapter Level, Lesson Level, or Page TOC)
3. Click "Generate Mindmap"
4. View the interactive graph in the modal
5. Click nodes to navigate (when real URLs are implemented)
6. Access recent mindmaps from the history list

## CSS Variables

The implementation uses Docusaurus CSS variables for theming:
- `--ifm-color-primary` - Primary brand color
- `--ifm-background-surface-color` - Surface backgrounds
- `--ifm-font-color-base` - Text color
- `--ifm-color-emphasis-*` - Various UI elements
- Supports both light and dark modes automatically

## Performance

- Lazy generation (only generates when requested)
- Efficient localStorage usage (max 50 items)
- Optimized React rendering with proper hooks
- Modal prevents body scroll when open
- Smooth animations and transitions
