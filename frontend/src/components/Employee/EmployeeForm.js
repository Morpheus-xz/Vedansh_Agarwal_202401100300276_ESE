import React, { useState } from 'react';
import api from '../../api';
import { UserPlus } from 'lucide-react';

const EmployeeForm = ({ onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', department: '', skills: '', performanceScore: '', experience: '',
  });
  const [loading, setLoading] = useState(false);

  const { name, email, department, skills, performanceScore, experience } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        performanceScore: Number(performanceScore),
        experience: Number(experience),
      };
      const res = await api.post('/employees', payload);
      onEmployeeAdded(res.data);
      setFormData({ name: '', email: '', department: '', skills: '', performanceScore: '', experience: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon"><UserPlus size={15} /></div>
          Add Employee
        </div>
      </div>

      <form onSubmit={onSubmit} className="employee-form">
        <div className="form-group">
          <label>Full Name</label>
          <input name="name" value={name} onChange={onChange} placeholder="Jane Smith" required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} placeholder="jane@company.com" required />
        </div>
        <div className="form-group">
          <label>Department</label>
          <input name="department" value={department} onChange={onChange} placeholder="e.g. Engineering" required />
        </div>
        <div className="form-group">
          <label>Skills <span style={{color:'#94a3b8',fontWeight:400}}>(comma-separated)</span></label>
          <input name="skills" value={skills} onChange={onChange} placeholder="Python, React, SQL" required />
        </div>
        <div className="form-group">
          <label>Performance Score <span style={{color:'#94a3b8',fontWeight:400}}>(0 – 100)</span></label>
          <input type="number" name="performanceScore" value={performanceScore} onChange={onChange}
            placeholder="85" required min="0" max="100" />
        </div>
        <div className="form-group">
          <label>Experience <span style={{color:'#94a3b8',fontWeight:400}}>(years)</span></label>
          <input type="number" name="experience" value={experience} onChange={onChange}
            placeholder="3" required min="0" />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Adding…' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
