import React from "react";

interface TimelineViewProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

/**
 * Pure Presentational Component.
 * Receives data and callbacks. Does not access global state or IPC directly.
 */
export const TimelineView: React.FC<TimelineViewProps> = ({ zoomLevel, onZoomIn, onZoomOut }) => {
  return (
    <div className="timeline-view">
      <div className="timeline-controls">
        <button onClick={onZoomOut}>-</button>
        <span>Zoom: {zoomLevel}%</span>
        <button onClick={onZoomIn}>+</button>
      </div>
      <div className="timeline-tracks">
        {/* Render tracks here */}
      </div>
    </div>
  );
};
