import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  
  // Stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Shops List
  const [shops, setShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [shopSearch, setShopSearch] = useState('');
  
  // Users List
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // New Service Type Form
  const [serviceName, setServiceName] = useState('');
  const [serviceBasePrice, setServiceBasePrice] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceSuccess, setServiceSuccess] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [serviceLoading, setServiceLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'shops') fetchShops();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await api.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch admin stats');
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchShops = async () => {
    setShopsLoading(true);
    try {
      const res = await api.get('/api/admin/shops');
      setShops(res.data);
    } catch (err) {
      console.error('Failed to fetch admin shops');
    } finally {
      setShopsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch admin users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUpdateStatus = async (shopId, newStatus) => {
    try {
      await api.put(`/api/admin/shops/${shopId}/status?status=${newStatus}`);
      fetchShops(); // Refresh shops list
    } catch (err) {
      alert(err.message || 'Failed to update shop status.');
    }
  };

  const handleAddServiceType = async (e) => {
    e.preventDefault();
    setServiceLoading(true);
    setServiceError('');
    setServiceSuccess('');
    try {
      await api.post('/api/admin/service-types', {
        name: serviceName,
        basePrice: parseFloat(serviceBasePrice),
        description: serviceDesc,
      });
      setServiceSuccess('Service Type catalog added successfully!');
      setServiceName('');
      setServiceBasePrice('');
      setServiceDesc('');
    } catch (err) {
      setServiceError(err.message || 'Failed to add service type catalog.');
    } finally {
      setServiceLoading(false);
    }
  };

  const getShopStatusBadge = (status) => {
    return {
      PENDING: 'bg-warning text-dark',
      APPROVED: 'bg-success text-white',
      SUSPENDED: 'bg-danger text-white',
    }[status] || 'bg-secondary';
  };

  // Local filtering
  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
    shop.ownerName.toLowerCase().includes(shopSearch.toLowerCase()) ||
    shop.city.toLowerCase().includes(shopSearch.toLowerCase())
  );

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12 text-center text-md-start">
          <span className="badge bg-dark text-warning px-3 py-2 rounded-pill fw-bold text-uppercase fs-8 mb-2">
            <i className="bi bi-shield-lock-fill me-1"></i> Admin Oversight Panel
          </span>
          <h2 className="fw-extrabold text-dark">Platform Controls Dashboard</h2>
          <p className="text-muted">Audit users, verify workshops, expand the baseline service catalog, and monitor system KPIs.</p>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="d-flex justify-content-center justify-content-md-start mb-4">
        <div className="nav nav-pills gap-2 bg-white p-2 rounded-4 shadow-sm border">
          <button
            className={`nav-link rounded-3 px-4 py-2 fw-bold ${activeTab === 'stats' ? 'active bg-dark text-warning' : 'text-dark'}`}
            onClick={() => setActiveTab('stats')}
          >
            <i className="bi bi-graph-up-arrow me-2"></i> System Metrics
          </button>
          <button
            className={`nav-link rounded-3 px-4 py-2 fw-bold ${activeTab === 'shops' ? 'active bg-dark text-warning' : 'text-dark'}`}
            onClick={() => setActiveTab('shops')}
          >
            <i className="bi bi-shop-window me-2"></i> Shop Verification
          </button>
          <button
            className={`nav-link rounded-3 px-4 py-2 fw-bold ${activeTab === 'users' ? 'active bg-dark text-warning' : 'text-dark'}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people-fill me-2"></i> Users Directory
          </button>
          <button
            className={`nav-link rounded-3 px-4 py-2 fw-bold ${activeTab === 'catalog' ? 'active bg-dark text-warning' : 'text-dark'}`}
            onClick={() => setActiveTab('catalog')}
          >
            <i className="bi bi-folder-plus me-2"></i> Manage Catalog
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
        
        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <h4 className="fw-bold mb-4 text-dark d-flex align-items-center">
              <i className="bi bi-bar-chart-fill text-warning me-2"></i> Real-time KPIs
            </h4>
            {statsLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status"></div>
              </div>
            ) : stats ? (
              <div className="row g-4">
                <div className="col-md-3">
                  <div className="border border-light-subtle rounded-4 p-4 text-center hover-shadow bg-light bg-opacity-50">
                    <div className="bg-dark text-warning rounded-circle d-inline-flex p-3 mb-3 shadow-sm" style={{ width: '60px', height: '60px', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-people fs-4"></i>
                    </div>
                    <h2 className="fw-extrabold mb-1">{stats.totalUsers}</h2>
                    <span className="text-muted fs-8 uppercase fw-bold">Platform Users</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border border-light-subtle rounded-4 p-4 text-center hover-shadow bg-light bg-opacity-50">
                    <div className="bg-dark text-warning rounded-circle d-inline-flex p-3 mb-3 shadow-sm" style={{ width: '60px', height: '60px', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-shop fs-4"></i>
                    </div>
                    <h2 className="fw-extrabold mb-1">{stats.totalShops}</h2>
                    <span className="text-muted fs-8 uppercase fw-bold">Registered Shops</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border border-light-subtle rounded-4 p-4 text-center hover-shadow bg-light bg-opacity-50">
                    <div className="bg-dark text-warning rounded-circle d-inline-flex p-3 mb-3 shadow-sm" style={{ width: '60px', height: '60px', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-tools fs-4"></i>
                    </div>
                    <h2 className="fw-extrabold mb-1">{stats.totalJobs}</h2>
                    <span className="text-muted fs-8 uppercase fw-bold">Active Repair Jobs</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border border-light-subtle rounded-4 p-4 text-center hover-shadow bg-light bg-opacity-50">
                    <div className="bg-dark text-warning rounded-circle d-inline-flex p-3 mb-3 shadow-sm" style={{ width: '60px', height: '60px', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-person-heart fs-4"></i>
                    </div>
                    <h2 className="fw-extrabold mb-1">{stats.totalCustomers}</h2>
                    <span className="text-muted fs-8 uppercase fw-bold">Car Owners</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted">Failed to load statistics.</div>
            )}
          </div>
        )}

        {/* Shop Approvals Tab */}
        {activeTab === 'shops' && (
          <div>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
              <h4 className="fw-bold text-dark mb-0">Shop Verification Pipeline</h4>
              <div className="input-group" style={{ maxWidth: '350px' }}>
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Filter shops name, owner, city..."
                  value={shopSearch}
                  onChange={(e) => setShopSearch(e.target.value)}
                />
              </div>
            </div>

            {shopsLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status"></div>
              </div>
            ) : filteredShops.length === 0 ? (
              <div className="text-center text-muted py-5">No workshops found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th className="rounded-start-3">ID</th>
                      <th>Shop Details</th>
                      <th>Owner Name</th>
                      <th>Location</th>
                      <th>Verification Status</th>
                      <th className="text-end rounded-end-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShops.map(s => (
                      <tr key={s.id}>
                        <td><span className="badge bg-light text-dark border fw-bold">#{s.id}</span></td>
                        <td>
                          <div className="fw-bold text-dark">{s.name}</div>
                          <small className="text-muted">Total Offered Services: {s.services ? s.services.length : 0}</small>
                        </td>
                        <td className="fw-semibold text-muted">{s.ownerName}</td>
                        <td>{s.address}, <span className="fw-bold">{s.city}</span></td>
                        <td>
                          <span className={`badge ${getShopStatusBadge(s.status)} px-3 py-1.5 rounded-pill fw-bold text-uppercase fs-8`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            {s.status !== 'APPROVED' && (
                              <button
                                className="btn btn-success btn-sm rounded-pill px-3"
                                onClick={() => handleUpdateStatus(s.id, 'APPROVED')}
                              >
                                Approve
                              </button>
                            )}
                            {s.status !== 'SUSPENDED' && (
                              <button
                                className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                onClick={() => handleUpdateStatus(s.id, 'SUSPENDED')}
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
              <h4 className="fw-bold text-dark mb-0">Platform Users Directory</h4>
              <div className="input-group" style={{ maxWidth: '350px' }}>
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Filter users name, email, role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            {usersLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center text-muted py-5">No user records found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th className="rounded-start-3">ID</th>
                      <th>Account Owner</th>
                      <th>Email Address</th>
                      <th>Phone</th>
                      <th>System Role</th>
                      <th className="rounded-end-3">Joined On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td><span className="badge bg-light text-dark border">#{u.id}</span></td>
                        <td className="fw-bold text-dark">{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone || <em className="text-muted">Not provided</em>}</td>
                        <td>
                          <span className={`badge ${
                            u.role === 'ADMIN' ? 'bg-danger text-white' :
                            u.role === 'SHOP_OWNER' ? 'bg-warning text-dark' :
                            u.role === 'MECHANIC' ? 'bg-info text-dark' : 'bg-secondary text-white'
                          } px-2.5 py-1.5 rounded-3 fs-8 fw-bold`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Catalog Tab */}
        {activeTab === 'catalog' && (
          <div className="row justify-content-center py-3">
            <div className="col-lg-6">
              <div className="text-center mb-4">
                <h4 className="fw-bold text-dark mb-2">Create Standardized Catalog Entry</h4>
                <p className="text-muted fs-7">Add baseline service items to the central catalog. Shop owners select items from here to set up their offered services checklist.</p>
              </div>

              {serviceSuccess && <div className="alert alert-success border-0 rounded-3 mb-3 shadow-sm"><i className="bi bi-check-circle-fill me-2"></i>{serviceSuccess}</div>}
              {serviceError && <div className="alert alert-danger border-0 rounded-3 mb-3 shadow-sm"><i className="bi bi-exclamation-triangle-fill me-2"></i>{serviceError}</div>}

              <form onSubmit={handleAddServiceType} className="border rounded-4 p-4 shadow-sm bg-light bg-opacity-20">
                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold fs-7">Service Classification Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. Gearbox Overhaul, Complete Battery Check"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold fs-7">Standard Baseline Price (INR)</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control rounded-e-3"
                      placeholder="e.g. 1500"
                      value={serviceBasePrice}
                      onChange={(e) => setServiceBasePrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted fw-semibold fs-7">Scope Description</label>
                  <textarea
                    className="form-control rounded-3"
                    rows="3"
                    placeholder="Provide details of diagnostic checks, parts inclusion, or standard hours..."
                    value={serviceDesc}
                    onChange={(e) => setServiceDesc(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" disabled={serviceLoading} className="btn btn-dark w-100 py-3 rounded-3 text-warning fw-bold hover-scale">
                  {serviceLoading ? <span className="spinner-border spinner-border-sm me-2" role="status"></span> : 'Onboard To Catalog'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;

