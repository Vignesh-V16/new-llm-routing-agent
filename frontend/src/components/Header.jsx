import React from 'react';
import './Header.css';

const Header = ({ activeTab, onTabChange, onNewConversation }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="avatar-futuristic-container">
          <div className="holographic-ring"></div>
          <div className="avatar">
            <span className="star-icon">✨</span>
          </div>
        </div>
        <h1 className="team-name futuristic-text">Team G 🤗</h1>
      </div>
      
      <nav className="header-nav">
        {['Dashboard', 'Configurations', 'Analytics', 'About Us', 'History'].map(tab => (
          <button 
            key={tab}
            className={`nav-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      
      <div className="header-right">
        <button className="btn-new" onClick={onNewConversation}>
          <span className="feather-icon">🪶</span> New
        </button>
      </div>
    </header>
  );
};

export default Header;
