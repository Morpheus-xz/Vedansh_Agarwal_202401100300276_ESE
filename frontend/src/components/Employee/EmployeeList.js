import React, { useState } from 'react';
import api from '../../api';
import { Trash2, Pencil, X } from 'lucide-react';

const EditModal = ({ employee, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: employee.name,
    email: employee.email,
    department: employee.department,
    skills: (employee.skills || []).join(', '),
    performanceScore: employee.performanceScore,
    experience: employee.experience,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.put(`/employees/${employee._id}`, {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Edit Employee</span>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        {error && <div className="error-message" style={{margin:'0 1.375rem 1rem'}}>{error}</div>}

        <form onSubmit={onSubmit} className="modal-form">
          <div className="modal-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input name="department" value={form.department} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label>Skills <span style={{color:'#94a3b8',fontWeight:400}}>(comma-separated)</span></label>
              <input name="skills" value={form.skills} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label>Performance Score <span style={{color:'#94a3b8',fontWeight:400}}>(0–100)</span></label>
              <input type="number" name="performanceScore" value={form.performanceScore}
                onChange={onChange} required min="0" max="100" />
            </div>
            <div className="form-group">
              <label>Experience <span style={{color:'#94a3b8',fontWeight:400}}>(years)</span></label>
              <input type="number" name="experience" value={form.experience}
                onChange={onChange} required min="0" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{width:'auto'}} disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EmployeeList = ({ employees, fetchEmployees, onSelectEmployee, selectedEmployees }) => {
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this employee from the directory?')) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      alert('Error deleting employee');
    }
  };

  const getInitials = (name) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const scoreClass = (score) =>
    score >= 80 ? 'high' : score <= 50 ? 'low' : 'medium';

  return (
    <>
      {editingEmployee && (
        <EditModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSaved={fetchEmployees}
        />
      )}

      <div className="card" style={{ padding: '1.125rem' }}>
        <div className="card-header" style={{ marginBottom: '0.875rem' }}>
          <div className="card-title">
            <div className="card-title-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            Employee Directory
          </div>
          {selectedEmployees.length > 0 && (
            <span style={{fontSize:'0.75rem',color:'#2563eb',background:'#eff6ff',padding:'0.2rem 0.6rem',borderRadius:'12px',fontWeight:600}}>
              {selectedEmployees.length} selected
            </span>
          )}
        </div>

        <div className="table-count">
          {employees.length === 0 ? 'No employees' : `${employees.length} employee${employees.length !== 1 ? 's' : ''}`}
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{width:36}}></th>
                <th>Employee</th>
                <th>Skills</th>
                <th>Score</th>
                <th>Exp.</th>
                <th style={{width:90}}></th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr className="empty-table-row">
                  <td colSpan="6">No employees yet. Add your first employee using the form.</td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedEmployees.some(e => e._id === emp._id)}
                        onChange={() => onSelectEmployee(emp)}
                      />
                    </td>
                    <td>
                      <div className="employee-cell">
                        <div className="emp-avatar">{getInitials(emp.name)}</div>
                        <div>
                          <div className="emp-name">{emp.name}</div>
                          <div className="emp-dept">{emp.department}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="skills-list">
                        {(emp.skills || []).slice(0, 3).map(s => (
                          <span className="skill-tag" key={s}>{s}</span>
                        ))}
                        {(emp.skills || []).length > 3 && (
                          <span className="skill-tag">+{emp.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`score-badge ${scoreClass(emp.performanceScore)}`}>
                        {emp.performanceScore}
                      </span>
                    </td>
                    <td style={{color:'var(--text-muted)',fontSize:'0.875rem'}}>
                      {emp.experience}y
                    </td>
                    <td>
                      <div style={{display:'flex',gap:'0.375rem'}}>
                        <button
                          className="btn-edit"
                          onClick={() => setEditingEmployee(emp)}
                          title="Edit employee"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          className="btn-danger-outline"
                          onClick={() => handleDelete(emp._id)}
                          title="Remove employee"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EmployeeList;
