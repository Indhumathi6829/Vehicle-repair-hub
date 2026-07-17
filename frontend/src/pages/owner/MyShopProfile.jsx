import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const MyShopProfile = () => {
  const [shop, setShop] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('overview');
  
  // Registration form
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchShopDetails();
    fetchCatalogServices();
  }, []);

  const fetchShopDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/owner/shops/my');
      setShop(res.data);
      if (res.data.name) setName(res.data.name);
      if (res.data.address) setAddress(res.data.address);
      if (res.data.city) setCity(res.data.city);
      if (res.data.services) {
        setSelectedServiceIds(res.data.services.map(s => s.id));
      }
    } catch (err) {
      if (err.message.includes('not found') || err.message.includes('404')) {
        setShop(null);
      } else {
        setError(err.message || 'Failed to load shop details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogServices = async () => {
    setCatalogLoading(true);
    try {
      const res = await api.get('/api/service-types');
      setServiceTypes(res.data);
    } catch (err) {
      console.error('Failed to load catalog');
    } finally {
      setCatalogLoading(false);
    }
  };

  const handleRegisterShop = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/api/owner/shops', { name, address, city });
      setShop(res.data);
      setSuccess('Shop registered successfully and is pending admin approval!');
    } catch (err) {
      setError(err.message || 'Failed to register shop.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (serviceId) => {
    if (selectedServiceIds.includes(serviceId)) {
      setSelectedServiceIds(selectedServiceIds.filter(id => id !== serviceId));
    } else {
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
    }
  };

  const handleUpdateServices = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/api/owner/shops/services', selectedServiceIds);
      setShop(res.data);
      setSuccess('Shop service catalog updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update shop services.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return {
      PENDING: 'bg-warning text-dark',
      APPROVED: 'bg-success text-white',
      SUSPENDED: 'bg-danger text-white',
    }[status] || 'bg-secondary';
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12 text-center text-md-start">
          <span className="badge bg-dark text-warning px-3 py-2 rounded-pill fw-bold text-uppercase fs-8 mb-2">
            <i className="bi bi-shop me-1"></i> Workshop Operations
          </span>
          <h2 className="fw-extrabold text-dark">My Shop Manager</h2>
          <p className="text-muted">Manage your business profile, adjust active catalog offerings, and check live ratings.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger border-0 rounded-4 mb-4 shadow-sm"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}
      {success && <div className="alert alert-success border-0 rounded-4 mb-4 shadow-sm"><i className="bi bi-check-circle-fill me-2"></i>{success}</div>}

      {loading && !shop ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
        </div>
      ) : !shop ? (
        /* Register Shop Form */
        <div className="row justify-content-center py-4">
          <div className="col-md-6">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              <div className="text-center mb-4">
                <i className="bi bi-shop-window text-warning display-4"></i>
                <h3 className="fw-bold mt-2 text-dark">Register Your Workshop</h3>
                <p className="text-muted fs-7">Provide business details below. A platform administrator will audit and approve your profile before customer bookings open.</p>
              </div>
              
              <form onSubmit={handleRegisterShop}>
                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold fs-7">Registered Business Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. SpeedLine Performance Center"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold fs-7">Physical Address</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. 101 Outer Ring Road, T-Nagar"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted fw-semibold fs-7">City</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. Chennai, Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-dark w-100 py-3 rounded-3 text-warning fw-bold hover-scale">
                  Submit Registration
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* Shop details and Offered services config */
        <div>
          {/* Sub Navigation Tabs */}
          <div className="d-flex justify-content-center justify-content-md-start mb-4">
            <div className="nav nav-pills gap-2 bg-white p-1.5 rounded-3 shadow-sm border">
              <button
                className={`nav-link rounded-3 fw-bold ${activeSubTab === 'overview' ? 'active bg-dark text-warning' : 'text-dark'}`}
                onClick={() => setActiveSubTab('overview')}
              >
                <i className="bi bi-info-circle me-1"></i> Overview
              </button>
              <button
                className={`nav-link rounded-3 fw-bold ${activeSubTab === 'services' ? 'active bg-dark text-warning' : 'text-dark'}`}
                onClick={() => setActiveSubTab('services')}
              >
                <i className="bi bi-card-checklist me-1"></i> Manage Offerings ({selectedServiceIds.length})
              </button>
            </div>
          </div>

          <div className="row g-4">
            {/* Left Column: Details */}
            {activeSubTab === 'overview' && (
              <div className="col-12 col-lg-6 mx-auto">
                <div className="card shadow-sm border-0 rounded-4 p-4 bg-white text-center">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className={`badge ${getStatusBadge(shop.status)} px-3 py-2 rounded-pill fw-bold text-uppercase fs-8`}>
                      {shop.status}
                    </span>
                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-bold fs-7">
                      <i className="bi bi-star-fill text-warning me-1"></i> {shop.avgRating > 0 ? shop.avgRating.toFixed(1) : 'No Ratings'} / 5.0
                    </span>
                  </div>

                  <div className="bg-dark text-warning rounded-circle d-inline-flex p-4 mb-3 shadow-sm mx-auto" style={{ width: '80px', height: '80px', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-shop fs-2"></i>
                  </div>
                  <h3 className="fw-bold text-dark mb-1">{shop.name}</h3>
                  <p className="text-muted mb-4 fs-6">
                    <i className="bi bi-geo-alt-fill text-warning me-1"></i> {shop.address}, {shop.city}
                  </p>

                  <hr className="my-4 opacity-50" />

                  {shop.status === 'PENDING' && (
                    <div className="alert alert-warning border-0 rounded-3 mb-0 text-start fs-7 shadow-sm">
                      <i className="bi bi-info-circle-fill me-2 fs-5 align-middle"></i>
                      Your shop registration is under administrative review. Customers will be able to search and book repair slots as soon as the status changes to <strong>APPROVED</strong>.
                    </div>
                  )}
                  {shop.status === 'APPROVED' && (
                    <div className="alert alert-success border-0 rounded-3 mb-0 text-start fs-7 shadow-sm">
                      <i className="bi bi-patch-check-fill me-2 fs-5 align-middle"></i>
                      Your shop is approved and active! Customers can view your details and schedule bookings at your listed prices.
                    </div>
                  )}
                  {shop.status === 'SUSPENDED' && (
                    <div className="alert alert-danger border-0 rounded-3 mb-0 text-start fs-7 shadow-sm">
                      <i className="bi bi-exclamation-octagon-fill me-2 fs-5 align-middle"></i>
                      Your shop has been suspended by administration. Please contact support to resolve pending audits.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Right Column: Catalog Services Checklist */}
            {activeSubTab === 'services' && (
              <div className="col-12 col-lg-8 mx-auto">
                <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                  <h4 className="fw-bold mb-2 text-dark">Services We Offer</h4>
                  <p className="text-muted fs-7 mb-4">Select the baseline service types your shop offers. Customers can choose from these options when booking a repair at your shop.</p>
                  
                  {catalogLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-dark" role="status"></div>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateServices}>
                      <div className="row g-3 mb-4">
                        {serviceTypes.map(s => (
                          <div className="col-12" key={s.id}>
                            <div className="border rounded-3 p-3 d-flex align-items-center justify-content-between hover-shadow transition-all bg-light bg-opacity-20">
                              <div className="form-check mb-0">
                                <input
                                  className="form-check-input border-dark cursor-pointer"
                                  type="checkbox"
                                  id={`check-${s.id}`}
                                  checked={selectedServiceIds.includes(s.id)}
                                  onChange={() => handleCheckboxChange(s.id)}
                                  style={{ transform: 'scale(1.15)', cursor: 'pointer' }}
                                />
                                <label className="form-check-label fw-bold text-dark ms-3 cursor-pointer" htmlFor={`check-${s.id}`}>
                                  {s.name}
                                </label>
                                <small className="text-muted d-block ms-3 mt-1">{s.description}</small>
                              </div>
                              <span className="fs-5 fw-extrabold text-dark px-3 py-1 bg-white border rounded-3">₹{s.basePrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button type="submit" disabled={loading} className="btn btn-dark py-3 px-5 rounded-3 text-warning fw-bold hover-scale w-100">
                        {loading ? <span className="spinner-border spinner-border-sm me-2" role="status"></span> : 'Save Service Offerings'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyShopProfile;

