import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Mechanic Assignment State
  const [selectedMechanicMap, setSelectedMechanicMap] = useState({});
  const [assignLoadingId, setAssignLoadingId] = useState(null);

  useEffect(() => {
    fetchRequests();
    fetchMechanics();
  }, [page]);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/owner/repair-requests/my-shop?page=${page}&size=10`);
      setRequests(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load shop requests.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMechanics = async () => {
    try {
      const res = await api.get('/api/owner/mechanics/my-shop');
      setMechanics(res.data);
    } catch (err) {
      console.error('Failed to load mechanics', err);
    }
  };

  const handleMechanicChange = (requestId, mechanicId) => {
    setSelectedMechanicMap({
      ...selectedMechanicMap,
      [requestId]: mechanicId,
    });
  };

  const handleAssignMechanic = async (requestId) => {
    const mechanicId = selectedMechanicMap[requestId];
    if (!mechanicId) {
      alert('Please select a mechanic first.');
      return;
    }

    setAssignLoadingId(requestId);
    try {
      await api.put(`/api/owner/repair-requests/${requestId}/assign?mechanicId=${mechanicId}`);
      fetchRequests(); // Refresh requests list
    } catch (err) {
      alert(err.message || 'Failed to assign mechanic.');
    } finally {
      setAssignLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    return {
      REQUESTED: 'bg-primary text-white',
      ACCEPTED: 'bg-info text-dark',
      IN_PROGRESS: 'bg-warning text-dark',
      COMPLETED: 'bg-success text-white',
      CANCELLED: 'bg-danger text-white',
    }[status] || 'bg-secondary';
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-dark">Incoming Repair Jobs</h2>
          <p className="text-muted mb-0">Assign mechanics to incoming repair bookings and monitor progress logs.</p>
        </div>
        <button className="btn btn-outline-dark rounded-pill btn-sm px-3" onClick={fetchRequests}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger border-0 rounded-4 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-5 card border-0 shadow-sm rounded-4 bg-white">
          <div className="card-body py-5 text-center">
            <i className="bi bi-tools text-muted display-1"></i>
            <h4 className="mt-3 text-muted">No repair bookings recorded.</h4>
            <p className="text-muted fs-7">When customers select your shop and services, they will appear here.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {requests.map(req => (
              <div className="col-12" key={req.id}>
                <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                  <div className="row align-items-center g-3">
                    <div className="col-md-3">
                      <span className={`badge ${getStatusBadge(req.status)} px-3 py-2 rounded-pill fw-bold text-uppercase fs-8 mb-2 d-inline-block`}>
                        {req.status}
                      </span>
                      <h5 className="fw-bold text-dark mb-0">{req.serviceTypeName}</h5>
                      <small className="text-muted">Booking Reference: #{req.id}</small>
                    </div>

                    <div className="col-md-3">
                      <span className="text-muted d-block uppercase fs-8 fw-bold">Customer & Vehicle</span>
                      <span className="fw-semibold text-dark">{req.customerName}</span>
                      <small className="text-muted d-block">{req.vehicleDetails}</small>
                    </div>

                    <div className="col-md-3">
                      <span className="text-muted d-block uppercase fs-8 fw-bold">Assigned Mechanic</span>
                      {req.status === 'REQUESTED' ? (
                        <div className="d-flex gap-2 mt-1">
                          <select
                            className="form-select form-select-sm rounded-3"
                            value={selectedMechanicMap[req.id] || ''}
                            onChange={(e) => handleMechanicChange(req.id, e.target.value)}
                          >
                            <option value="">Choose Mechanic...</option>
                            {mechanics.map(m => (
                              <option key={m.id} value={m.id}>{m.name} ({m.specialization || 'General'})</option>
                            ))}
                          </select>
                          <button
                            className="btn btn-dark btn-sm rounded-3 px-3 fw-bold text-warning"
                            disabled={assignLoadingId === req.id}
                            onClick={() => handleAssignMechanic(req.id)}
                          >
                            {assignLoadingId === req.id ? '...' : 'Assign'}
                          </button>
                        </div>
                      ) : (
                        <span className="fw-semibold text-dark">
                          <i className="bi bi-person-fill text-warning me-1"></i> {req.mechanicName}
                        </span>
                      )}
                    </div>

                    <div className="col-md-2 text-md-end">
                      <span className="text-muted d-block uppercase fs-8 fw-bold">Cost</span>
                      <span className="fs-4 fw-bold text-dark">₹{req.cost}</span>
                    </div>
                  </div>

                  <div className="border-top mt-3 pt-3">
                    <div className="row text-muted fs-7">
                      <div className="col-md-8">
                        <strong className="text-dark">Issue Details:</strong> {req.issueDescription}
                      </div>
                      <div className="col-md-4 text-md-end">
                        <span>Booked on: {new Date(req.requestedAt).toLocaleString()}</span>
                      </div>
                    </div>
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
    </div>
  );
};

export default ManageRequests;
