import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const ManageMechanics = () => {
  const [mechanics, setMechanics] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');

  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    setListLoading(true);
    try {
      const res = await api.get('/api/owner/mechanics/my-shop');
      setMechanics(res.data);
    } catch (err) {
      console.error('Failed to load mechanics', err);
    } finally {
      setListLoading(false);
    }
  };

  const handleOnboardMechanic = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/api/owner/mechanics', { name, email, password, phone, specialization });
      setSuccess('Mechanic onboarded successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setSpecialization('');
      fetchMechanics();
    } catch (err) {
      setError(err.message || 'Failed to onboard mechanic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-5">

        {/* Onboarding Form */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
            <h4 className="fw-bold mb-3 text-dark">Add Mechanic</h4>
            <p className="text-muted fs-7 mb-4">Onboard a mechanic to your team. They can log in to view their assigned repair tasks.</p>

            {success && <div className="alert alert-success border-0 rounded-3 mb-3">{success}</div>}
            {error && <div className="alert alert-danger border-0 rounded-3 mb-3">{error}</div>}

            <form onSubmit={handleOnboardMechanic}>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Mechanic Name</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control rounded-3"
                  placeholder="mechanic@shop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Temporary Password</label>
                <input
                  type="password"
                  className="form-control rounded-3"
                  placeholder="minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Phone Number</label>
                <input
                  type="tel"
                  className="form-control rounded-3"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-semibold">Specialization</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. Engine Overhauls, Car Brakes, Electricals"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-dark w-100 py-3 rounded-3 text-warning fw-bold hover-scale">
                {loading ? <span className="spinner-border spinner-border-sm me-2" role="status"></span> : 'Onboard Mechanic'}
              </button>
            </form>
          </div>
        </div>

        {/* Mechanics List */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
            <h4 className="fw-bold mb-4 text-dark">Mechanic Directory</h4>

            {listLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status"></div>
              </div>
            ) : mechanics.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-people text-muted display-2"></i>
                <h5 className="mt-3 text-muted">No mechanics added yet.</h5>
                <p className="text-muted fs-7">Onboard team members using the form to start assigning them incoming repair requests.</p>
              </div>
            ) : (
              <div className="row g-3">
                {mechanics.map(m => (
                  <div className="col-12" key={m.id}>
                    <div className="border rounded-3 p-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-dark text-warning rounded-3 p-3">
                          <i className="bi bi-person-badge-fill fs-3"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{m.name}</h6>
                          <small className="text-muted d-block">{m.email}</small>
                          <small className="text-muted d-block mt-1">
                            <i className="bi bi-award-fill text-warning me-1"></i> {m.specialization || 'General Services'}
                          </small>
                        </div>
                      </div>
                      <span className={`badge ${m.isAvailable ? 'bg-success' : 'bg-secondary'} px-2 py-1.5 rounded-3`}>
                        {m.isAvailable ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageMechanics;
