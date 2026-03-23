import React, { useState, useEffect, useRef } from 'react';
import './LeftPanel.css';

const LeftPanel = ({ onSend, disabled, queryResult, conversationId }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState('en-US'); // Default to English
  const responseEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [conversationId]);

  useEffect(() => {
    if (queryResult && queryResult.finalAnswer) {
      const historicMessages = [];
      if (queryResult.query) {
        historicMessages.push({ role: 'user', content: queryResult.query });
      }
      historicMessages.push({ 
        role: 'ai', 
        content: queryResult.finalAnswer,
        expert: queryResult.utilizedExperts?.[0]
      });
      setMessages(historicMessages);
    }
  }, [queryResult]);

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      const newQuery = inputValue.trim();
      setMessages(prev => [...prev, { role: 'user', content: newQuery }]);
      onSend(newQuery);
      setInputValue('');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleLike = (idx) => {
    setMessages(prev => prev.map((msg, i) => 
      i === idx ? { ...msg, liked: !msg.liked, disliked: false } : msg
    ));
  };

  const handleDislike = (idx) => {
    setMessages(prev => prev.map((msg, i) => 
      i === idx ? { ...msg, disliked: !msg.disliked, liked: false } : msg
    ));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleListening = () => {
    if (isListening) {
       recognitionRef.current?.stop();
       setIsListening(false);
       return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLang;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="panel left-panel">
      <div className="response-area">
        {messages.length > 0 ? (
          <div className="chat-history">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-wrapper ${msg.role}`}>
                {msg.role === 'user' ? (
                  <div className="user-bubble">{msg.content}</div>
                ) : (
                  <div className="ai-message">
                    {msg.expert && (
                      <div className="expert-tag-row">
                        ✦ {msg.expert}
                      </div>
                    )}
                    <div className="ai-text">{msg.content}</div>
                    <div className="ai-actions">
                      <button 
                        className="action-icon" 
                        title="Copy"
                        onClick={() => handleCopy(msg.content)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      </button>
                      <button 
                        className={`action-icon ${msg.liked ? 'active' : ''}`} 
                        title="Like"
                        onClick={() => handleLike(idx)}
                      >
                        <svg viewBox="0 0 24 24" fill={msg.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                      </button>
                      <button 
                        className={`action-icon ${msg.disliked ? 'active' : ''}`} 
                        title="Dislike"
                        onClick={() => handleDislike(idx)}
                      >
                        <svg viewBox="0 0 24 24" fill={msg.disliked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2H20a2 2 0 0 1 2 2v7a2 2 0 0 1-2-2h-3"></path></svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={responseEndRef} />
          </div>
        ) : (
          <div className="empty-state">
            <h1>What can I help with?</h1>
            <p>Intelligence routed through ChatGPT, Gemini, Perplexity, and Claude.</p>
          </div>
        )}
      </div>

      <div className="input-container">
        <div className="voice-controls">
          <button 
            className={`mic-btn ${isListening ? 'listening' : ''}`} 
            disabled={disabled}
            onClick={toggleListening}
            title={isListening ? "Stop Listening" : "Start Voice Typing"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>
          <button 
            className="lang-toggle" 
            onClick={() => setVoiceLang(prev => prev === 'en-US' ? 'ta-IN' : 'en-US')}
            disabled={disabled || isListening}
            title="Switch Language (EN/TA)"
          >
            {voiceLang === 'en-US' ? 'EN' : 'TA'}
          </button>
        </div>
        <input 
          type="text" 
          placeholder={disabled ? "Processing..." : "Ask AI anything..."}
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button className="send-btn" onClick={handleSend} disabled={disabled || !inputValue.trim()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 2 11 13"></polyline>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LeftPanel;
