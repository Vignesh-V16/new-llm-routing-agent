import React, { useState, useEffect } from 'react';
import './History.css';
import API_BASE_URL from '../config';

const History = ({ onSelectConversation }) => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [taskFilter, setTaskFilter] = useState('All');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/history`)
      .then(res => res.json())
      .then(data => {
        // Map the backend Interaction object to the frontend expectations
        const mappedData = data.map(item => ({
          id: item.id,
          text: item.query,
          finalAnswer: item.finalAnswer,
          model: mapExpertToBrand(item.selectedExperts[0] || 'Unknown'),
          experts: item.selectedExperts,
          time: formatRelativeTime(item.timestamp),
          type: mapExpertToType(item.selectedExperts[0] || 'General'),
          status: 'active'
        })).reverse(); // Newest first
        setHistoryItems(mappedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch history:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`${API_BASE_URL}/api/v1/history/${id}`, { method: 'DELETE' });
      setHistoryItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  const mapExpertToBrand = (expert) => {
    switch(expert.toLowerCase()) {
      case 'coding': return 'ChatGPT';
      case 'general': return 'Gemini';
      case 'summarization': return 'Perplexity';
      case 'realtime': return 'Claude';
      case 'research': return 'Perplexity';
      default: return expert;
    }
  };

  const mapExpertToType = (expert) => {
    switch(expert.toLowerCase()) {
      case 'coding': return 'Coding Specialist';
      case 'general': return 'General Purpose';
      case 'summarization': return 'Document Synthesis';
      case 'realtime': return 'Quick Response';
      case 'research': return 'Deep Research';
      default: return 'Expert Routing';
    }
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTask = taskFilter === 'All' || item.type.includes(taskFilter);
    return matchesSearch && matchesTask;
  });

  if (loading) return <div className="history-page loading">Gathering archives...</div>;

  return (
    <div className="history-page">
      <h1 className="history-title">Advanced Conversation History & Smart Filtering</h1>

      {/* Filter Bar */}
      <div className="history-filters">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search prompt text, dates, or model..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-dropdown">
          <select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}>
            <option value="All">All Task Profiles</option>
            <option value="Coding">Coding</option>
            <option value="Synthesis">Synthesis</option>
            <option value="Research">Research</option>
            <option value="General">General</option>
          </select>
        </div>
        <div className="filter-dropdown">
          <select><option>Date Range: All Time</option></select>
        </div>
        <div className="filter-dropdown">
          <select><option>LLM Model: All</option></select>
        </div>
      </div>

      {/* History List */}
      <div className="history-list">
        {filteredItems.length > 0 ? filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="history-item clickable" 
            onClick={() => onSelectConversation(item)}
          >
            <div className="item-left">
              <div className="user-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="item-text-group">
                <div className="item-header">
                  <span className="item-user">User</span>
                  <span className="item-time">{item.time}</span>
                </div>
                <p className="item-preview">{item.text}</p>
              </div>
            </div>

            <div className="item-right">
              <div className="model-badge">
                <div className="model-icons">
                  <div className={`icon-cloud-${item.model.toLowerCase()}`}>
                    {item.model === 'Gemini' ? '☁️ G' : item.model === 'ChatGPT' ? '🤖 GPT' : '⚡'}
                  </div>
                  <div className="icon-code">{"</>"}</div>
                  <div className="icon-doc">📄</div>
                </div>
                <div className="model-info">
                  <span className="routed-text">Routed to {item.model}</span>
                </div>
              </div>
              <div className={`status-dot ${item.status}`}></div>
              <div className="action-icons">
                 <button onClick={(e) => e.stopPropagation()} title="Refresh">🔄</button>
                 <button onClick={(e) => handleDelete(e, item.id)} title="Delete">🗑️</button>
                 <button onClick={(e) => e.stopPropagation()} title="Bookmark">🔖</button>
                 <button onClick={(e) => e.stopPropagation()} title="Share">🔗</button>
              </div>
            </div>
          </div>
        )) : (
          <div className="no-history">No matching interactions found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span className="pagination-label">Pagination:</span>
        <button className="page-btn">[Prev]</button>
        <span className="page-num active">1</span>
        <button className="page-btn">[Next]</button>
      </div>
    </div>
  );
};

export default History;
