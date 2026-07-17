import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, role, userId, name } = response.data;
      
      login(token, { email, role, userId, name });

      // Redirect to correct dashboard based on role
      const dashboardRoute = {
        CUSTOMER: '/customer/browse',
        SHOP_OWNER: '/owner/shop',
        MECHANIC: '/mechanic/jobs',
        ADMIN: '/admin/shops',
      }[role] || '/';
      
      navigate(dashboardRoute);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="bg-dark text-white p-4 text-center">
              <i className="bi bi-wrench-adjustable text-warning fs-1 mb-2"></i>
              <h3 className="fw-bold">Welcome Back</h3>
              <p className="text-muted mb-0">Sign in to manage repairs or book services</p>
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
                
                <div className="form-floating mb-4">
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
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-dark w-100 py-3 rounded-3 text-warning fw-bold hover-scale"
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  ) : 'Sign In'}
                </button>
              </form>
              
              <div className="text-center mt-4">
                <span className="text-muted">New to RepairHub? </span>
                <Link to="/register" className="text-warning fw-bold text-decoration-none">Create an Account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
