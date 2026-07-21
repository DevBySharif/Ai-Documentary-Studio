import React, { useState, useEffect } from "react";
import { TimelineView } from "./timeline-view";

/**
 * Container component for the Timeline feature.
 * Connects to Hooks, API boundaries (window.ads), and global state, passing simple props to the view.
 */
export const TimelineContainer: React.FC = () => {
  const [zoom, setZoom] = useState(100);

  // In a real implementation, we might listen to window.ads.timeline.onZoomChanged...
  useEffect(() => {
    // const subscription = window.ads.timeline.onUpdate(() => {...});
    // return () => subscription.dispose();
  }, []);

  const handleZoomIn = () => setZoom(z => Math.min(z + 10, 200));
  const handleZoomOut = () => setZoom(z => Math.max(z - 10, 10));

  return (
    <TimelineView 
      zoomLevel={zoom} 
      onZoomIn={handleZoomIn} 
      onZoomOut={handleZoomOut} 
    />
  );
};
