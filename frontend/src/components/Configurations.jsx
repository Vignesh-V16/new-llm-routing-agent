import React, { useState, useEffect } from 'react';
import './Configurations.css';
import API_BASE_URL from '../config';

const Configurations = ({ onCancel }) => {
  const [instructions, setInstructions] = useState('');
  const [routingPreferences, setRoutingPreferences] = useState({
    creative: false,
    coding: false,
    synthesis: false,
    accuracy: false,
    latency: false,
    tone: false,
    complexity: false,
    factCheck: false,
    context: false
  });
  const [weights, setWeights] = useState({
    gemini: 0,
    gpt4: 0,
    claude: 0,
    quick: 0,
    perplexity: 0
  });
  const [systemHealth, setSystemHealth] = useState({
    errorLogging: false,
    metricsTracking: false,
    apiLogs: false
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/config`)
      .then(res => res.json())
      .then(data => {
        setInstructions(data.instructions);
        setRoutingPreferences(data.routingPreferences);
        setWeights(data.modelWeights);
        setSystemHealth(data.systemHealth);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch config:", err);
        setIsLoading(false);
      });
  }, []);

  const handleWeightChange = (model, val) => {
    setWeights(prev => ({ ...prev, [model]: parseInt(val) }));
  };

  const handlePreferenceToggle = (key) => {
    setRoutingPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleHealthToggle = (key) => {
    setSystemHealth(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const configData = {
      instructions,
      routingPreferences,
      modelWeights: weights,
      systemHealth
    };

    fetch(`${API_BASE_URL}/api/v1/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configData)
    })
      .then(res => res.json())
      .then(() => {
        alert('Configurations saved successfully!');
        onCancel();
      })
      .catch(err => {
        console.error("Failed to save config:", err);
        alert('Failed to save configurations.');
      });
  };

  if (isLoading) {
    return <div className="configurations-page"><div className="config-card">Loading settings...</div></div>;
  }

  return (
    <div className="configurations-page">
      <div className="config-card">
        {/* Global System Instructions */}
        <section className="config-section">
          <h2>Global System Instructions</h2>
          <textarea 
            className="config-textarea"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </section>

        {/* Routing Logic Preferences */}
        <section className="config-section">
          <h2>Routing Logic Preferences</h2>
          <div className="preferences-grid">
            <div className="pref-item">
              <label className="switch">
                <input type="checkbox" checked={routingPreferences.creative} onChange={() => handlePreferenceToggle('creative')} />
                <span className="slider round"></span>
              </label>
              <span>Optimized for Creative Ideation</span>
            </div>
            <div className="pref-item">
              <label className="switch">
                <input type="checkbox" checked={routingPreferences.coding} onChange={() => handlePreferenceToggle('coding')} />
                <span className="slider round"></span>
              </label>
              <span>Optimized for Advanced Coding</span>
            </div>
            <div className="pref-item">
              <label className="switch">
                <input type="checkbox" checked={routingPreferences.synthesis} onChange={() => handlePreferenceToggle('synthesis')} />
                <span className="slider round"></span>
              </label>
              <span>Optimized for Document Synthesis</span>
            </div>

            <div className="pref-item">
              <label className="switch">
                <input type="checkbox" checked={routingPreferences.accuracy} onChange={() => handlePreferenceToggle('accuracy')} />
                <span className="slider round"></span>
              </label>
              <span>High-Accuracy Mode</span>
            </div>
            <div className="pref-item">
              <label className="switch">
                <input type="checkbox" checked={routingPreferences.latency} onChange={() => handlePreferenceToggle('latency')} />
                <span className="slider round"></span>
              </label>
              <span>Minimum Latency Mode</span>
            </div>
            <div className="pref-item">
              <label className="switch">
                <input type="checkbox" checked={routingPreferences.tone} onChange={() => handlePreferenceToggle('tone')} />
                <span className="slider round"></span>
              </label>
              <span>(new) Adaptive Tone (Professional/Casual)</span>
            </div>

            <div className="pref-item">
              <label className="switch">
                <input type="checkbox" checked={routingPreferences.complexity} onChange={() => handlePreferenceToggle('complexity')} />
                <span className="slider round"></span>
              </label>
              <span>Code Complexity Analysis</span>
            </div>
            <div className="pref-item">
              <label className="switch">
                <input type="checkbox" checked={routingPreferences.factCheck} onChange={() => handlePreferenceToggle('factCheck')} />
                <span className="slider round"></span>
              </label>
              <span>Fact-Checking Mode</span>
            </div>
            <div className="pref-item">
              <label className="switch">
                <input type="checkbox" checked={routingPreferences.context} onChange={() => handlePreferenceToggle('context')} />
                <span className="slider round"></span>
              </label>
              <span>Multi-Turn Context Retention</span>
            </div>
          </div>
        </section>

        {/* Model-Specific API Weights */}
        <section className="config-section">
          <h2>Model-Specific API Weights</h2>
          <div className="weights-list">
            {[
              { id: 'gemini', label: 'Gemini Pro (Creative)' },
              { id: 'gpt4', label: 'GPT-4o (Coding/Reasoning)' },
              { id: 'claude', label: 'Claude 3 Opus (General)' },
              { id: 'quick', label: 'Quick Answer (Speed)' },
              { id: 'perplexity', label: 'Perplexity (Research)' }
            ].map((model) => (
              <div key={model.id} className="weight-item">
                <span className="weight-label">{model.label}</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={weights[model.id]} 
                  onChange={(e) => handleWeightChange(model.id, e.target.value)}
                  className="weight-slider"
                  style={{'--val': weights[model.id] + '%'}}
                />
                <input 
                  type="number" 
                  value={weights[model.id]} 
                  onChange={(e) => handleWeightChange(model.id, e.target.value)}
                  className="weight-number"
                />
              </div>
            ))}
          </div>
        </section>

        {/* System Health & Logging */}
        <section className="config-section">
          <h2>System Health & Logging</h2>
          <div className="health-row">
            <div className="pref-item">
              <label className="switch">
                <input type="checkbox" checked={systemHealth.errorLogging} onChange={() => handleHealthToggle('errorLogging')} />
                <span className="slider round"></span>
              </label>
              <span>System Error Logging</span>
            </div>
            <div className="pref-item">
              <label className="switch">
                <input type="checkbox" checked={systemHealth.metricsTracking} onChange={() => handleHealthToggle('metricsTracking')} />
                <span className="slider round"></span>
              </label>
              <span>Performance Metrics Tracking</span>
            </div>
            <div className="pref-item">
              <label className="switch">
                <input type="checkbox" checked={systemHealth.apiLogs} onChange={() => handleHealthToggle('apiLogs')} />
                <span className="slider round"></span>
              </label>
              <span>Detailed API Call Logs</span>
            </div>
          </div>
        </section>
      </div>

      <div className="config-footer">
        <button className="btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="btn-save" onClick={handleSave}>
          SAVE CONFIGURATIONS
          <svg className="sparkle-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="white" fillOpacity="0.8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Configurations;
