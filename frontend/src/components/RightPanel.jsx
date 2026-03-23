import React from 'react';
import RoutingHub from './RoutingHub';
import './RightPanel.css';

const RightPanel = ({ queryResult, isLoading, error }) => {
  return (
    <div className="panel right-panel">
      {isLoading && (
        <div className="status-overlay">
          <div className="loading-spinner"></div>
          <p>Analyzing intent & routing to experts...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      <RoutingHub activeExperts={queryResult?.utilizedExperts || []} />
    </div>
  );
};

export default RightPanel;
