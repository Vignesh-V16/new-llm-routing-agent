import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import './Analytics.css';
import API_BASE_URL from '../config';

const COLORS = ['#b685ff', '#7fa4bd', '#dbb37c', '#91cba7', '#8884d8'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAnalytics = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/v1/analytics`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch(err => {
        console.error("Failed to fetch analytics:", err);
        setError("Unable to load performance metrics.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="analytics-page loading-center">
        <div className="professional-loader">
          <div className="spinner"></div>
          <p>Analyzing system data streams...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="analytics-page error-center">
        <div className="error-card">
          <h2>Connection Fault</h2>
          <p>{error || "No data available."}</p>
          <button onClick={fetchAnalytics} className="btn-retry">Retry Connection</button>
        </div>
      </div>
    );
  }

  // Ensure charts have enough data for rendering even if history is short
  const safeTrendData = data.trendData.length > 0 ? data.trendData : [{name: '0', average: 0}];
  const safePieData = (data.volumeData || []).map(v => ({ name: v.name, value: v.coding + v.creative }));

  return (
    <div className="analytics-page animate-in">
      {/* Top Header Controls */}
      <div className="analytics-controls">
        <div className="header-left">
          <h1 className="analytics-title">ANALYTICS & PERFORMANCE</h1>
          <span className="last-updated">Last optimized: {lastUpdated}</span>
        </div>
        <div className="filter-group">
          <div className="filter-item">
            <span>Data Range:</span>
            <select>
              <option>Real-Time Session</option>
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="separator">|</div>
          <div className="filter-item">
            <span>Task Profile:</span>
            <select>
              <option>All Models</option>
              <option>Coding Specialist</option>
              <option>Creative Writing</option>
              <option>Scientific Research</option>
              <option>General Purpose</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="summary-row">
        <div className="summary-card">
          <div className="card-info">
             <span className="card-label">Total Request Volume</span>
             <span className="card-value">{data.totalRequests}</span>
             <span className="card-sub">requests</span>
          </div>
          <div className="card-chart">
            <ResponsiveContainer width={100} height={50}>
              <AreaChart data={safeTrendData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b685ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#b685ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="average" stroke="#b685ff" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-info">
             <span className="card-label">Average Response Time</span>
             <span className="card-value">{data.avgLatency}</span>
             <span className="card-sub">latency</span>
          </div>
          <div className="card-chart">
            <ResponsiveContainer width={100} height={50}>
              <AreaChart data={safeTrendData}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7fa4bd" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7fa4bd" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="average" stroke="#7fa4bd" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-info">
             <span className="card-label">Cost Optimization</span>
             <span className="card-value">{data.costSaved}</span>
             <span className="card-sub">saved</span>
          </div>
          <div className="card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
              <path d="M12 2v20M17 5H9.5a4.5 4.5 0 0 0 0 9h5a4.5 4.5 0 0 1 0 9H6" />
            </svg>
          </div>
        </div>

        <div className="summary-card uptime-card">
          <div className="card-info">
             <span className="card-label">System Integrity 
               <span className="check-mark">
                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                   <polyline points="20 6 9 17 4 12" />
                 </svg>
               </span>
             </span>
             <span className="card-value">{data.uptime}%</span>
          </div>
          <div className="uptime-bar">
            {[...Array(50)].map((_, i) => <div key={i} className={`uptime-segment ${i < 48 ? 'highlight' : ''}`}></div>)}
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="analytics-grid">
        {/* Trends Chart */}
        <div className="grid-item trend-chart">
          <h3>Request Scaling & Latency Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={safeTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis tickFormatter={(val) => `${val}ms`} fontSize={10} stroke="#888" />
              <Tooltip />
              <Legend verticalAlign="top" height={36}/>
              <Line name="Session Latency" type="monotone" dataKey="average" stroke="#b685ff" strokeWidth={3} dot={{r: 4, fill: '#b685ff'}} />
              <Line name="Baseline SLA" type="monotone" dataKey="sla" stroke="#bbb" strokeWidth={1} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Utilization Pipes */}
        <div className="grid-item utilization-sidebar">
          <h3>Live LLM Node Utilization</h3>
          <div className="pipe-row">
            {data.utilizationData.length > 0 ? data.utilizationData.map((pipe, i) => (
              <div key={i} className="pipe-container">
                <div className="pipe-bg">
                  <div className="pipe-fill" style={{ height: pipe.val + '%', backgroundColor: pipe.color }}></div>
                </div>
                <div className="pipe-label-group">
                  <span className="pipe-val">{pipe.val}%</span>
                  <div className="pipe-legend-item" style={{ color: pipe.color }}>
                    <svg width="14" height="6" viewBox="0 0 20 8" fill="none">
                       <line x1="0" y1="4" x2="20" y2="4" stroke="currentColor" strokeWidth="1.5" />
                       <circle cx="10" cy="4" r="2.5" fill="white" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                    <span className="pipe-name">{pipe.name.split('/')[0]}</span>
                  </div>
                </div>
              </div>
            )) : <p className="no-data">No active nodes</p>}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid-item volume-chart">
           <h3>Traffic Distribution by Node</h3>
           <ResponsiveContainer width="100%" height={200}>
             <BarChart data={data.volumeData}>
               <XAxis dataKey="name" stroke="#888" fontSize={10} tickFormatter={(v) => v.substring(0, 8)} />
               <YAxis hide />
               <Tooltip />
               <Bar name="Routing Hits" dataKey="coding" fill="#ac84fb" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>

        <div className="grid-item metrics-table-container">
          <h3>Top Performance Metrics by LLM</h3>
          <div className="table-scroll">
            <table className="metrics-table">
              <thead>
                <tr>
                  <th>Model Instance</th>
                  <th>Avg. Latency</th>
                  <th>Cost/Req</th>
                  <th>Success</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.performanceMetrics.length > 0 ? data.performanceMetrics.map((m, i) => (
                  <tr key={i}>
                    <td>{m.modelName}</td>
                    <td>{m.avgLatency}</td>
                    <td>{m.costPerReq}</td>
                    <td>{m.accuracy}%</td>
                    <td><span className="status-badge">active</span></td>
                  </tr>
                )) : <tr><td colSpan="5" className="no-table-data">Waiting for interactions...</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid-item pie-chart-container">
           <h3>Traffic Weight Distribution</h3>
           <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={safePieData} innerRadius={35} outerRadius={55} paddingAngle={8} dataKey="value">
                  {safePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="analytics-footer">
        <button className="btn-refresh" onClick={fetchAnalytics}>
           Refresh Real-Time Data
        </button>
        <button className="btn-export">Export Performance Ledger</button>
      </div>
    </div>
  );
};

export default Analytics;
