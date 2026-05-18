import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from './Employee/EmployeeForm';
import EmployeeList from './Employee/EmployeeList';
import SearchFilter from './Employee/SearchFilter';
import RecommendationDisplay from './AI/RecommendationDisplay';
import api from '../api';
import { LogOut, Users, Building2 } from 'lucide-react';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const fetchEmployees = useCallback(async (department = '') => {
    try {
      const url = department ? `/employees/search?department=${department}` : '/employees';
      const res = await api.get(url);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) handleLogout();
    }
  }, [handleLogout]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleSelectEmployee = (employee) => {
    const isSelected = selectedEmployees.some(e => e._id === employee._id);
    setSelectedEmployees(
      isSelected
        ? selectedEmployees.filter(e => e._id !== employee._id)
        : [...selectedEmployees, employee]
    );
  };

  const deptCount = new Set(employees.map(e => e.department)).size;

  return (
    <div className="app-shell">


      {/* ── Main ── */}
      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">HR Portal</div>
            <div className="topbar-meta">Manage employees and generate AI-powered insights</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HR Administrator</div>
            </div>
            <button className="btn-secondary" onClick={handleLogout} style={{ padding: '0.4rem 0.75rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon blue"><Users size={20} /></div>
            <div>
              <div className="stat-value">{employees.length}</div>
              <div className="stat-label">Total Employees</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple"><Building2 size={20} /></div>
            <div>
              <div className="stat-value">{deptCount || '—'}</div>
              <div className="stat-label">Departments</div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Left column: Employee Management */}
          <div className="main-panel">
            <div className="panel-header">
              <h2>Employee Management</h2>
              <p>Add and manage your organization's workforce.</p>
            </div>
            <EmployeeForm onEmployeeAdded={() => fetchEmployees()} />
            <SearchFilter onSearch={fetchEmployees} />
            <EmployeeList
              employees={employees}
              fetchEmployees={fetchEmployees}
              onSelectEmployee={handleSelectEmployee}
              selectedEmployees={selectedEmployees}
            />
          </div>

          {/* Right column: AI Insights */}
          <div className="ai-panel">
            <div className="panel-header">
              <h2>AI Intelligence</h2>
              <p>Select employees from the list to generate insights.</p>
            </div>
            <RecommendationDisplay selectedEmployees={selectedEmployees} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
