import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('CUSTOMER'); // Default to Customer
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password,
        phone,
        role,
      });
      const { token, role: userRole, userId, name: userName } = response.data;
      
      login(token, { email, role: userRole, userId, name: userName });

      // Redirect to correct dashboard
      const dashboardRoute = {
        CUSTOMER: '/customer/browse',
        SHOP_OWNER: '/owner/shop',
      }[userRole] || '/';
      
      navigate(dashboardRoute);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="bg-dark text-white p-4 text-center">
              <i className="bi bi-person-plus text-warning fs-1 mb-2"></i>
              <h3 className="fw-bold">Get Started</h3>
              <p className="text-muted mb-0">Join Trusted Vehicle Repair Hub today</p>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger border-0 rounded-3 mb-4 d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control rounded-3"
                    id="nameInput"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <label htmlFor="nameInput">Full Name</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control rounded-3"
                    id="emailInput"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="emailInput">Email address</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control rounded-3"
                    id="passwordInput"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="passwordInput">Password</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="tel"
                    className="form-control rounded-3"
                    id="phoneInput"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <label htmlFor="phoneInput">Phone Number (Optional)</label>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted d-block">Register As:</label>
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="roleRadio"
                      id="customerRadio"
                      checked={role === 'CUSTOMER'}
                      onChange={() => setRole('CUSTOMER')}
                    />
                    <label className="btn btn-outline-dark py-3 fw-bold rounded-start-3" htmlFor="customerRadio">
                      <i className="bi bi-person me-2"></i> Vehicle Owner (Customer)
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="roleRadio"
                      id="ownerRadio"
                      checked={role === 'SHOP_OWNER'}
                      onChange={() => setRole('SHOP_OWNER')}
                    />
                    <label className="btn btn-outline-dark py-3 fw-bold rounded-end-3" htmlFor="ownerRadio">
                      <i className="bi bi-shop me-2"></i> Shop Owner
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-dark w-100 py-3 rounded-3 text-warning fw-bold hover-scale"
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  ) : 'Create Account'}
                </button>
              </form>
              
              <div className="text-center mt-4">
                <span className="text-muted">Already have an account? </span>
                <Link to="/login" className="text-warning fw-bold text-decoration-none">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
