import React from 'react';
import './AboutUs.css';

const AboutUs = ({ onBack }) => {
  return (
    <div className="about-page">
      <div className="about-content">
        {/* Main Heading */}
        <div className="about-header">
          <h1>MEET THE ARCHITECTS BEHIND OUR LLM ROUTING AGENT</h1>
          <p className="subtitle">OPTIMIZING HUMAN INTELLIGENCE THROUGH INTELLIGENT MODEL ORCHESTRATION.</p>
        </div>

        <div className="about-grid">
          {/* Left Block: Logo & Motto */}
          <div className="about-left">
            <div className="large-logo-container">
              <div className="logo-glow-red"></div>
              <div className="logo-glow-green"></div>
              <div className="logo-glow-blue"></div>
              <div className="main-logo-glow">
                 <svg viewBox="0 0 100 100" className="about-logo-svg" width="200" height="200" style={{ overflow: 'visible' }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                    <g transform="translate(50,50) scale(0.6)">
                        <path d="M0 -40 L10 -15 L35 -15 L15 5 L25 30 L0 15 L-25 30 L-15 5 L-35 -15 L-10 -15 Z" fill="rgba(0,0,0,0.05)" />
                    </g>
                    {/* The double gear / brain central icon */}
                    <path d="M50 25 A25 25 0 1 0 50 75 A25 25 0 1 0 50 25" fill="white" fillOpacity="0.2" />
                    <path d="M50 30 C38 30 30 38 30 50 C30 62 38 70 50 70 M50 30 C62 30 70 38 70 50 C70 62 62 70 50 70" fill="none" stroke="#666" strokeWidth="2" strokeOpacity="0.5"/>
                    <path d="M50 35 L50 65 M35 50 L65 50" stroke="#666" strokeWidth="1" strokeOpacity="0.3"/>
                    <text x="60" y="45" fontSize="200" textAnchor="middle" dominantBaseline="middle">🎯</text>
                 </svg>
              </div>
            </div>
            <p className="motto">Neutrality, Efficiency, and Student-Led.</p>
          </div>

          {/* Right Blocks */}
          <div className="about-right">
            {/* Mandate & Horizon */}
            <div className="mission-blocks">
              <div className="mission-card">
                <div className="card-top">
                   <div className="icon-circle">🧭</div>
                   <h3>OUR MANDATE</h3>
                </div>
                <p>CULTIVATING CLARITY TO REVOLUTIONIZE LLM PERFORMANCE BY COORDINATING A NETWORK OF BEST-IN-CLASS VIRTUAL MINDS.</p>
              </div>
              <div className="mission-card">
                <div className="card-top">
                   <div className="icon-circle">🔍</div>
                   <h3>OUR HORIZON</h3>
                </div>
                <p>A SCALABLE ECOSYSTEM WHERE AI'S COMPLEXITY IS INVISIBLE, EMPOWERING THE IMMEDIATE CLARITY OF HUMAN THOUGHT.</p>
              </div>
            </div>

            {/* Core Values */}
            <div className="values-row">
              <div className="value-item">
                 <div className="value-icon">⚖️</div>
                 <h4>NEUTRALITY</h4>
                 <p>Routing decisions based on objective performance data.</p>
              </div>
              <div className="value-item">
                 <div className="value-icon">⚡</div>
                 <h4>EFFICIENCY</h4>
                 <p>Minimizing latency and optimizing API cost.</p>
              </div>
              <div className="value-item">
                 <div className="value-icon">🎓</div>
                 <h4>STUDENT-DRIVEN INNOVATION</h4>
                 <p>Pioneering solutions with fresh perspectives.</p>
              </div>
            </div>

            {/* Team Section */}
            <div className="team-section">
              <h3 className="team-title">Meet the Student Team</h3>
              <div className="team-avatars">
                {[
                  "Project Lead & Routing Strategist",
                  "UX/UI Designer & Backend Integrator",
                  "Model Evaluator & Data Analyst",
                  "Frontend Developer & System Architect",
                  "Machine Learning Specialist & API Engineer"
                ].map((role, i) => (
                  <div key={i} className="team-member">
                    <div className="avatar-circle">
                      <div className="avatar-placeholder">👤</div>
                    </div>
                    <span className="member-role">{role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Return Button */}
      <div className="about-footer">
        <button className="btn-return" onClick={onBack}>RETURN TO DASHBOARD</button>
      </div>
    </div>
  );
};

export default AboutUs;
