import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold text-gradient" to="/">
          <i className="bi bi-wrench-adjustable-circle-fill me-2 fs-3 text-warning"></i>
          <span>Repair<span className="text-warning">Hub</span></span>
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user?.role === 'CUSTOMER' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/customer/browse">
                    <i className="bi bi-search me-1"></i> Browse Shops
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/customer/vehicles">
                    <i className="bi bi-car-front-fill me-1"></i> My Vehicles
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/customer/requests">
                    <i className="bi bi-calendar-check me-1"></i> My Requests
                  </Link>
                </li>
              </>
            )}

            {user?.role === 'SHOP_OWNER' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/owner/shop">
                    <i className="bi bi-shop me-1"></i> My Shop
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/owner/mechanics">
                    <i className="bi bi-people-fill me-1"></i> Mechanics
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/owner/jobs">
                    <i className="bi bi-tools me-1"></i> Incoming Jobs
                  </Link>
                </li>
              </>
            )}

            {user?.role === 'MECHANIC' && (
              <li className="nav-item">
                <Link className="nav-link" to="/mechanic/jobs">
                  <i className="bi bi-list-task me-1"></i> Assigned Jobs
                </Link>
              </li>
            )}

            {user?.role === 'ADMIN' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/shops">
                    <i className="bi bi-shield-check me-1"></i> Shop Approvals
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">
                    <i className="bi bi-person-badge-fill me-1"></i> Users
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <div className="text-light text-end d-none d-md-block">
                  <div className="fw-bold">{user.name}</div>
                  <span className="badge bg-warning text-dark fs-7 px-2 py-1">{user.role}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline-warning btn-sm px-3 rounded-pill">
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3 rounded-pill">Login</Link>
                <Link to="/register" className="btn btn-warning btn-sm px-3 rounded-pill text-dark fw-bold">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
