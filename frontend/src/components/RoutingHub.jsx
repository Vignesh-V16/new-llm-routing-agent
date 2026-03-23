import React, { useMemo } from 'react';
import './RoutingHub.css';

const RoutingHub = ({ activeExperts = [] }) => {
  const expertToIdMap = {
    coding: ['chatgpt'],
    summarization: ['claude'],
    realtime: ['perplexity'],
    general: ['gemini'],
    quick: ['quick']
  };

  const activeIds = useMemo(() => {
    const ids = new Set();
    activeExperts.forEach(exp => {
      const mappedIds = expertToIdMap[exp.toLowerCase()];
      if (mappedIds) {
        mappedIds.forEach(id => ids.add(id));
      }
    });
    return ids;
  }, [activeExperts]);

  const isActive = (id) => activeIds.has(id);

  return (
    <div className="routing-hub-container">
      {/* SVG for connecting paths, dots, and arrows */}
      <svg className="connecting-lines" viewBox="0 0 600 500" preserveAspectRatio="none">
        <defs>
          <marker id="arrow-gemini" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <path d="M0,0 L5,2 L0,4 Z" fill="#b685ff" />
          </marker>
          <marker id="arrow-chatgpt" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <path d="M0,0 L5,2 L0,4 Z" fill="#7fa4bd" />
          </marker>
          <marker id="arrow-claude" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <path d="M0,0 L5,2 L0,4 Z" fill="#dbb37c" />
          </marker>
          <marker id="arrow-quick" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <path d="M0,0 L5,2 L0,4 Z" fill="#eb7a7a" />
          </marker>
          <marker id="arrow-perplexity" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <path d="M0,0 L5,2 L0,4 Z" fill="#91cba7" />
          </marker>
        </defs>
        
        {/* Core connection point (red dot on edge of hub) */}
        <circle cx="70" cy="250" r="4" fill="#d95a5a" />

        {/* Gemini Path */}
        <path d="M 70,250 C 130,250 150,140 210,140" className={`path path-gemini ${isActive('gemini') ? 'active' : ''}`} />
        <path d="M 210,140 C 310,140 330,45 380,45" className={`path path-gemini ${isActive('gemini') ? 'active' : ''}`} markerEnd="url(#arrow-gemini)" />
        <circle cx="210" cy="140" r="8" className={`path-node node-gemini-dot ${isActive('gemini') ? 'active' : ''}`} />

        {/* ChatGPT Path */}
        <path d="M 70,250 C 130,250 160,195 230,195" className={`path path-chatgpt ${isActive('chatgpt') ? 'active' : ''}`} />
        <path d="M 230,195 C 320,195 340,150 380,150" className={`path path-chatgpt ${isActive('chatgpt') ? 'active' : ''}`} markerEnd="url(#arrow-chatgpt)" />
        <circle cx="230" cy="195" r="8" className={`path-node node-chatgpt-dot ${isActive('chatgpt') ? 'active' : ''}`} />

        {/* Claude Path */}
        <path d="M 70,250 C 130,250 170,250 250,250" className={`path path-claude ${isActive('claude') ? 'active' : ''}`} />
        <path d="M 250,250 L 380,250" className={`path path-claude ${isActive('claude') ? 'active' : ''}`} markerEnd="url(#arrow-claude)" />
        <circle cx="250" cy="250" r="8" className={`path-node node-claude-dot ${isActive('claude') ? 'active' : ''}`} />

        {/* Quick Answer Path */}
        <path d="M 70,250 C 130,250 150,320 220,320" className={`path path-quick ${isActive('quick') ? 'active' : ''}`} />
        <path d="M 220,320 C 310,320 330,350 380,350" className={`path path-quick ${isActive('quick') ? 'active' : ''}`} markerEnd="url(#arrow-quick)" />
        <circle cx="220" cy="320" r="8" className={`path-node node-quick-dot ${isActive('quick') ? 'active' : ''}`} />

        {/* Perplexity Path */}
        <path d="M 70,250 C 130,250 150,380 230,380" className={`path path-perplexity ${isActive('perplexity') ? 'active' : ''}`} />
        <path d="M 230,380 C 320,380 340,455 380,455" className={`path path-perplexity ${isActive('perplexity') ? 'active' : ''}`} markerEnd="url(#arrow-perplexity)" />
        <circle cx="230" cy="380" r="8" className={`path-node node-perplexity-dot ${isActive('perplexity') ? 'active' : ''}`} />
      </svg>

      {/* Glow behind the hub */}
      <div className="hub-center-glow"></div>

      <div className="hub-center">
        <div className="hub-icon-container">
          <div className="hub-icons-wrapper">
             {/* Gear Icon - Thin Outline */}
             <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2c2c2c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hub-gear">
               <circle cx="12" cy="12" r="3"></circle>
               <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
             </svg>
             {/* Brain Icon - Thin Orange Outline */}
             <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d96b58" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hub-brain">
               <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
               <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
               <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
               <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
               <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
               <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
               <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
               <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
               <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
             </svg>
          </div>
        </div>
        <div className="hub-label">Smart Routing Hub</div>
      </div>

      <div className="llm-nodes">
        <div className={`llm-node node-gemini ${isActive('gemini') ? 'active' : ''}`}>
          <div className="node-glow"></div>
          <div className="node-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
              <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
              <text x="12" y="14" fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle" style={{fontFamily: 'Inter'}}>G</text>
            </svg>
          </div>
          <span className="node-label">Gemini</span>
        </div>
        <div className={`llm-node node-chatgpt ${isActive('chatgpt') ? 'active' : ''}`}>
          <div className="node-glow"></div>
          <div className="node-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <path d="M9 13l-2 2 2 2" />
              <path d="M15 13l2 2-2 2" />
              <line x1="13" y1="12" x2="11" y2="18" />
            </svg>
          </div>
          <span className="node-label">ChatGPT</span>
        </div>
        <div className={`llm-node node-claude ${isActive('claude') ? 'active' : ''}`}>
          <div className="node-glow"></div>
          <div className="node-icon">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4H6a2 2 0 0 0-2 2z" />
               <path d="M14 4v4h4" />
               <line x1="8" y1="13" x2="16" y2="13" />
               <line x1="8" y1="17" x2="16" y2="17" />
               <line x1="8" y1="9" x2="10" y2="9" />
             </svg>
          </div>
          <span className="node-label">Claude</span>
        </div>
        <div className={`llm-node node-quick ${isActive('quick') ? 'active' : ''}`}>
          <div className="node-glow"></div>
          <div className="node-icon">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
               <line x1="10" y1="14" x2="14" y2="14" opacity="0.5" />
               <line x1="10" y1="11" x2="16" y2="11" opacity="0.5" />
               <line x1="3" y1="10" x2="6" y2="10" />
               <line x1="3" y1="13" x2="5" y2="13" />
               <line x1="3" y1="16" x2="6" y2="16" />
             </svg>
          </div>
          <span className="node-label">Quick Answer</span>
        </div>
        <div className={`llm-node node-perplexity ${isActive('perplexity') ? 'active' : ''}`}>
          <div className="node-glow"></div>
          <div className="node-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="7" />
              <line x1="21" y1="21" x2="15" y2="15" />
            </svg>
          </div>
          <span className="node-label">Perplexity</span>
        </div>
      </div>
    </div>
  );
};

export default RoutingHub;
