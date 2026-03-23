import React, { useState } from 'react';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Configurations from './components/Configurations';
import Analytics from './components/Analytics';
import AboutUs from './components/AboutUs';
import History from './components/History';
import './index.css';
import API_BASE_URL from './config';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [queryResult, setQueryResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(Date.now());

  const handleSendQuery = async (query) => {
    setIsLoading(true);
    setError(null);
    setQueryResult(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/api/v1/router/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      if (!resp.ok) {
        throw new Error('Backend failed to respond');
      }
      const data = await resp.json();
      setQueryResult(data);
    } catch (err) {
      setError(err.message);
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setActiveTab('Dashboard');
    setQueryResult(null);
    setError(null);
    setConversationId(Date.now());
  };

  const handleSelectConversation = (item) => {
    setActiveTab('Dashboard');
    setQueryResult({
      query: item.text,
      finalAnswer: item.finalAnswer,
      utilizedExperts: item.experts || []
    });
    setConversationId(item.id);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'Configurations':
        return <Configurations onCancel={() => setActiveTab('Dashboard')} />;
      case 'Analytics':
        return <Analytics />;
      case 'About Us':
        return <AboutUs onBack={() => setActiveTab('Dashboard')} />;
      case 'History':
        return <History onSelectConversation={handleSelectConversation} />;
      default:
        return (
          <>
            <LeftPanel 
              onSend={handleSendQuery} 
              disabled={isLoading} 
              queryResult={queryResult} 
              conversationId={conversationId}
            />
            <RightPanel queryResult={queryResult} isLoading={isLoading} error={error} />
          </>
        );
    }
  };

  return (
    <div className="app-container">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onNewConversation={handleNewConversation}
      />
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
