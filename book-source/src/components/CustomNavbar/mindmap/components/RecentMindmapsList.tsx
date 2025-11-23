import React, { useState } from 'react';
import { MindmapData } from '../types';
import './RecentMindmapsList.css';

interface RecentMindmapsListProps {
  mindmaps: MindmapData[];
  onOpen: (mindmap: MindmapData) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

const RecentMindmapsList: React.FC<RecentMindmapsListProps> = ({
  mindmaps,
  onOpen,
  onRemove,
  onRename
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const getLevelIcon = (level: number): string => {
    switch (level) {
      case 1:
        return '📚'; // Book Level
      case 2:
        return '📖'; // Chapter Level
      case 3:
        return '📋'; // Page TOC
      default:
        return '🗺️';
    }
  };

  const handleStartEdit = (mindmap: MindmapData) => {
    setEditingId(mindmap.id);
    setEditValue(mindmap.title);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      onRename(id, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (mindmaps.length === 0) {
    return (
      <div className="recent-mindmaps__empty">
        <p>No recent mindmaps yet</p>
        <p className="recent-mindmaps__empty-hint">Generate your first mindmap to get started</p>
      </div>
    );
  }

  return (
    <div className="recent-mindmaps">
      <h3 className="recent-mindmaps__title">Recent Mindmaps</h3>
      <div className="recent-mindmaps__list">
        {mindmaps.map((mindmap) => (
          <div key={mindmap.id} className="recent-mindmap-item">
            <div className="recent-mindmap-item__info">
              <span className="recent-mindmap-item__icon">{getLevelIcon(mindmap.level)}</span>
              <div className="recent-mindmap-item__content">
                {editingId === mindmap.id ? (
                  <input
                    type="text"
                    className="recent-mindmap-item__edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, mindmap.id)}
                    onBlur={() => handleSaveEdit(mindmap.id)}
                    autoFocus
                  />
                ) : (
                  <span className="recent-mindmap-item__title">{mindmap.title}</span>
                )}
                <span className="recent-mindmap-item__time">{getTimeAgo(mindmap.timestamp)}</span>
              </div>
            </div>
            <div className="recent-mindmap-item__actions">
              <button
                className="recent-mindmap-item__btn recent-mindmap-item__btn--open"
                onClick={() => onOpen(mindmap)}
                title="Open mindmap"
              >
                Open
              </button>
              <button
                className="recent-mindmap-item__btn recent-mindmap-item__btn--rename"
                onClick={() => handleStartEdit(mindmap)}
                title="Rename mindmap"
              >
                ✎
              </button>
              <button
                className="recent-mindmap-item__btn recent-mindmap-item__btn--remove"
                onClick={() => onRemove(mindmap.id)}
                title="Remove from history"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentMindmapsList;
