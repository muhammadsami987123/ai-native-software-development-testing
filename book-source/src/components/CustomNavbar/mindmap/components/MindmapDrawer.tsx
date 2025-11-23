import React, { useState, useEffect } from 'react';
import LevelSelect from './LevelSelect';
import RecentMindmapsList from './RecentMindmapsList';
import MindmapModal from './MindmapModal';
import { useMindmapGenerator } from '../hooks/useMindmapGenerator';
import { useMindmapHistory } from '../hooks/useMindmapHistory';
import { detectAvailableLevels } from '../utils/detectLevels';
import { MindmapData } from '../types';
import './MindmapDrawer.css';

const MindmapDrawer: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [availableLevels, setAvailableLevels] = useState(detectAvailableLevels());
  const [currentMindmap, setCurrentMindmap] = useState<MindmapData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { generateMindmap, isGenerating } = useMindmapGenerator();
  const { history, addToHistory, removeFromHistory, renameMindmap } = useMindmapHistory();

  // Update available levels on mount
  useEffect(() => {
    setAvailableLevels(detectAvailableLevels());
  }, []);

  // Handle generate button click
  const handleGenerate = async () => {
    try {
      const mindmap = await generateMindmap(selectedLevel);
      addToHistory(mindmap);
      setCurrentMindmap(mindmap);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to generate mindmap:', error);
      // Could add error toast here
    }
  };

  // Handle opening a mindmap from history
  const handleOpenMindmap = (mindmap: MindmapData) => {
    setCurrentMindmap(mindmap);
    setIsModalOpen(true);
  };

  // Handle removing a mindmap from history
  const handleRemoveMindmap = (id: string) => {
    removeFromHistory(id);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mindmap-drawer">
      {/* Generator Section */}
      <div className="mindmap-drawer__generator">
        <div className="mindmap-drawer__header">
          <h3 className="mindmap-drawer__title">🗺️ Mindmap Generator</h3>
          <p className="mindmap-drawer__description">
            Generate interactive mindmaps at different hierarchy levels
          </p>
        </div>

        <LevelSelect
          value={selectedLevel}
          options={availableLevels}
          onChange={setSelectedLevel}
          disabled={isGenerating}
        />

        <button
          className="mindmap-drawer__generate-btn"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="mindmap-drawer__spinner" />
              Generating...
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ marginRight: '8px' }}
              >
                <path
                  d="M8 2V14M2 8H14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Generate Mindmap
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="mindmap-drawer__divider" />

      {/* Recent Mindmaps Section */}
      <div className="mindmap-drawer__history">
        <RecentMindmapsList
          mindmaps={history}
          onOpen={handleOpenMindmap}
          onRemove={handleRemoveMindmap}
          onRename={renameMindmap}
        />
      </div>

      {/* Mindmap Modal */}
      <MindmapModal
        isOpen={isModalOpen}
        mindmap={currentMindmap}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MindmapDrawer;
