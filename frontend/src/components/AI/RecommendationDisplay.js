import React, { useState } from 'react';
import api from '../../api';
import { Sparkles, Loader, Bot } from 'lucide-react';

const TYPES = [
  { value: 'promotion', label: 'Promotion Recommendation' },
  { value: 'ranking',   label: 'Employee Ranking' },
  { value: 'training',  label: 'Training Suggestions' },
  { value: 'feedback',  label: 'Performance Feedback' },
];

const RecommendationDisplay = ({ selectedEmployees }) => {
  const [type, setType] = useState('promotion');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    setRecommendation('');
    try {
      const res = await api.post('/ai/recommend', { employees: selectedEmployees, type });
      setRecommendation(res.data.recommendation);
    } catch (err) {
      setError('Failed to generate insights. Check your API configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-card">
      <div className="ai-card-header">
        <div className="ai-card-title">
          <Sparkles size={16} color="#93c5fd" />
          AI Insights
        </div>
        <div className="ai-card-sub">Select employees then generate recommendations</div>
      </div>

      <div className="ai-card-body">
        {selectedEmployees.length > 0 && (
          <div className="selected-count">
            {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected
          </div>
        )}

        <label className="ai-select-label">Insight type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="ai-select"
        >
          {TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <button
          className="btn-ai"
          onClick={generate}
          disabled={loading || selectedEmployees.length === 0}
        >
          {loading
            ? <><Loader size={15} className="spin" />Analyzing…</>
            : <><Sparkles size={15} />Generate Insights</>
          }
        </button>

        <div className="ai-output">
          {loading ? (
            <div className="ai-loading">
              <Loader size={18} className="spin" />
              Analyzing employee data…
            </div>
          ) : error ? (
            <div style={{color:'var(--danger)',fontSize:'0.8125rem'}}>{error}</div>
          ) : recommendation ? (
            <div className="ai-result-text">
              {recommendation.split('\n').filter(l => l.trim()).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          ) : (
            <div className="ai-empty">
              <div className="ai-empty-icon"><Bot size={28} /></div>
              <span>Select employees and click Generate Insights</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationDisplay;
