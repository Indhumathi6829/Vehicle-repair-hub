import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const BrowseShops = () => {
  const [shops, setShops] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  
  // Filters
  const [city, setCity] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Booking Modal State
  const [selectedShop, setSelectedShop] = useState(null);
  const [bookingVehicleId, setBookingVehicleId] = useState('');
  const [bookingServiceTypeId, setBookingServiceTypeId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetchServiceTypes();
    fetchVehicles();
  }, []);

  useEffect(() => {
    fetchShops();
  }, [city, selectedServiceId, page]);

  const fetchServiceTypes = async () => {
    try {
      const res = await api.get('/api/service-types');
      setServiceTypes(res.data);
    } catch (err) {
      console.error('Failed to fetch service types');
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/api/customer/vehicles/my');
      setVehicles(res.data);
      if (res.data.length > 0) {
        setBookingVehicleId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles');
    }
  };

  const fetchShops = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `/api/shops?page=${page}&size=6`;
      if (city) url += `&city=${city}`;
      if (selectedServiceId) url += `&serviceTypeId=${selectedServiceId}`;
      
      const res = await api.get(url);
      setShops(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load shops.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBookingModal = (shop) => {
    setSelectedShop(shop);
    setBookingSuccess('');
    setBookingError('');
    setIssueDescription('');
    if (shop.services && shop.services.length > 0) {
      setBookingServiceTypeId(shop.services[0].id);
    } else {
      setBookingServiceTypeId('');
    }
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    if (!bookingVehicleId) {
      setBookingError('Please add a vehicle profile first.');
      return;
    }
    if (!bookingServiceTypeId) {
      setBookingError('Please select a service.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');

    try {
      await api.post('/api/customer/repair-requests', {
        shopId: selectedShop.id,
        vehicleId: parseInt(bookingVehicleId),
        serviceTypeId: parseInt(bookingServiceTypeId),
        issueDescription,
      });
      setBookingSuccess('Booking completed successfully! You can track progress under "My Requests".');
      setIssueDescription('');
    } catch (err) {
      setBookingError(err.message || 'Failed to complete booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const getSelectedServicePrice = () => {
    if (!bookingServiceTypeId) return 0;
    const service = serviceTypes.find(s => s.id === parseInt(bookingServiceTypeId));
    return service ? service.basePrice : 0;
  };

  return (
    <div className="container py-5">
      <div className="row mb-5 text-center text-md-start align-items-center">
        <div className="col-md-8">
          <span className="badge bg-dark text-warning px-3 py-2 rounded-pill fw-bold text-uppercase fs-8 mb-2">
            <i className="bi bi-geo-alt-fill me-1"></i> Local Marketplace
          </span>
          <h2 className="fw-extrabold text-dark">Find & Book Trusted Repair Shops</h2>
          <p className="text-muted">Browse top-rated mechanics near you and book fixed catalog rate repairs transparently.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-5 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-geo-alt"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-1 bg-light"
                placeholder="Search by city (e.g. Chennai, Bangalore)..."
                value={city}
                onChange={(e) => { setCity(e.target.value); setPage(0); }}
              />
            </div>
          </div>
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-wrench"></i>
              </span>
              <select
                className="form-select border-start-0 ps-1 bg-light"
                value={selectedServiceId}
                onChange={(e) => { setSelectedServiceId(e.target.value); setPage(0); }}
              >
                <option value="">All Services</option>
                {serviceTypes.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-2">
            <button className="btn btn-warning text-dark w-100 py-2.5 rounded-3 fw-bold shadow-sm" onClick={fetchShops}>
              <i className="bi bi-funnel-fill me-1"></i> Filter
            </button>
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger rounded-4 py-3">{error}</div>
      ) : shops.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-shop-window text-muted display-1"></i>
          <h4 className="mt-3 text-muted">No shops found matching your search.</h4>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {shops.map(shop => (
              <div className="col-md-6 col-lg-4" key={shop.id}>
                <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow overflow-hidden transition-all bg-white d-flex flex-column justify-content-between">
                  <div className="bg-dark p-4 text-white position-relative">
                    <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-3 px-2.5 py-1.5 rounded-pill fw-bold shadow">
                      <i className="bi bi-star-fill text-dark me-1"></i>
                      {shop.avgRating > 0 ? shop.avgRating.toFixed(1) : 'New'}
                    </span>
                    <h4 className="fw-bold mb-1 pe-5 text-gradient">{shop.name}</h4>
                    <small className="text-muted d-block mb-0">
                      <i className="bi bi-geo-alt-fill text-warning me-1"></i> {shop.address}, {shop.city}
                    </small>
                  </div>
                  
                  <div className="card-body p-4 d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                      <h6 className="fw-bold text-muted uppercase fs-8 mb-3">Offered Services checklist:</h6>
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {shop.services && shop.services.length > 0 ? (
                          shop.services.map(s => (
                            <span key={s.id} className="badge bg-light text-dark border px-2.5 py-1.5 rounded-3 fs-8 fw-semibold">
                              <i className="bi bi-check2 text-success me-1"></i>{s.name} (₹{s.basePrice})
                            </span>
                          ))
                        ) : (
                          <span className="text-muted fs-7 italic">No services registered yet.</span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      className="btn btn-dark w-100 py-3 rounded-3 text-warning fw-bold hover-scale"
                      data-bs-toggle="modal"
                      data-bs-target="#bookingModal"
                      onClick={() => handleOpenBookingModal(shop)}
                    >
                      <i className="bi bi-calendar-plus me-1"></i> Book Repair Slot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <nav>
                <ul className="pagination gap-2">
                  <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                    <button className="page-link rounded-3 border-0" onClick={() => setPage(page - 1)}>
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                      <button className="page-link rounded-3 border-0" onClick={() => setPage(i)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                    <button className="page-link rounded-3 border-0" onClick={() => setPage(page + 1)}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Booking Modal */}
      <div className="modal fade" id="bookingModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow">
            <div className="modal-header bg-dark text-white border-0 py-3">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-calendar-plus text-warning me-2"></i>
                Book Repair at {selectedShop?.name}
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              {bookingSuccess ? (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle-fill text-success display-3 mb-3"></i>
                  <h5 className="fw-bold">Booking Confirmed!</h5>
                  <p className="text-muted">{bookingSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleBookService}>
                  {bookingError && (
                    <div className="alert alert-danger border-0 rounded-3 mb-3">{bookingError}</div>
                  )}

                  {/* Vehicle selection */}
                  <div className="mb-3">
                    <label className="form-label text-muted fw-bold">1. Select Registered Vehicle</label>
                    {vehicles.length === 0 ? (
                      <div className="alert alert-warning p-2 rounded-3 fs-7 mb-0">
                        No vehicle profiles found. Please register a vehicle in your profile dashboard first.
                      </div>
                    ) : (
                      <select
                        className="form-select rounded-3"
                        value={bookingVehicleId}
                        onChange={(e) => setBookingVehicleId(e.target.value)}
                        required
                      >
                        {vehicles.map(v => (
                          <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.regNumber})</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Service selection */}
                  <div className="mb-3">
                    <label className="form-label text-muted fw-bold">2. Select Offered Service</label>
                    <select
                      className="form-select rounded-3"
                      value={bookingServiceTypeId}
                      onChange={(e) => setBookingServiceTypeId(e.target.value)}
                      required
                    >
                      {selectedShop?.services?.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cost Summary */}
                  <div className="bg-light border rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted d-block fw-bold fs-7">Standard Catalog Estimate:</span>
                      <small className="text-muted fs-8">(Fixed price guarantee)</small>
                    </div>
                    <span className="fs-3 fw-extrabold text-dark">₹{getSelectedServicePrice()}</span>
                  </div>

                  {/* Description input */}
                  <div className="mb-4">
                    <label className="form-label text-muted fw-bold">3. Describe the Problem</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="3"
                      placeholder="Detail warnings lights, squeaking sound, engine heat, diagnostic issues..."
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading || vehicles.length === 0}
                    className="btn btn-dark w-100 py-3 rounded-3 text-warning fw-bold hover-scale"
                  >
                    {bookingLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : 'Confirm Repair Booking'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseShops;

