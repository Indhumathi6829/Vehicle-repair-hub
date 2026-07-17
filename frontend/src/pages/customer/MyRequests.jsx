import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Review state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [page]);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/customer/repair-requests/my?page=${page}&size=10`);
      setRequests(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load repair requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = (req) => {
    setSelectedRequest(req);
    setRating(5);
    setComment('');
    setReviewError('');
    setReviewSuccess('');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      await api.post('/api/customer/reviews', {
        repairRequestId: selectedRequest.id,
        rating,
        comment,
      });
      setReviewSuccess('Thank you for sharing your experience!');
      fetchRequests(); // Refresh request list to hide "Leave Review" button
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    return {
      REQUESTED: 'bg-primary text-white',
      ACCEPTED: 'bg-info text-dark',
      IN_PROGRESS: 'bg-warning text-dark',
      COMPLETED: 'bg-success text-white',
      CANCELLED: 'bg-danger text-white',
    }[status] || 'bg-secondary text-white';
  };

  // Helper to determine active status steps
  const getTimelineSteps = (status) => {
    const steps = [
      { name: 'Requested', done: true, active: status === 'REQUESTED' },
      { name: 'Assigned', done: ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(status), active: status === 'ACCEPTED' },
      { name: 'In Progress', done: ['IN_PROGRESS', 'COMPLETED'].includes(status), active: status === 'IN_PROGRESS' },
      { name: 'Completed', done: status === 'COMPLETED', active: status === 'COMPLETED' }
    ];
    return steps;
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <span className="badge bg-dark text-warning px-3 py-2 rounded-pill fw-bold text-uppercase fs-8 mb-2">
            <i className="bi bi-clock-history me-1"></i> Operations History
          </span>
          <h2 className="fw-extrabold text-dark">My Repair Bookings</h2>
          <p className="text-muted mb-0">Track real-time maintenance logs and status of your vehicle repairs.</p>
        </div>
        <button className="btn btn-outline-dark rounded-pill btn-sm px-3" onClick={fetchRequests}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger rounded-4 py-3">{error}</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-5 card border-0 shadow-sm rounded-4">
          <div className="card-body py-5 text-center">
            <i className="bi bi-calendar-x text-muted display-1"></i>
            <h4 className="mt-3 text-muted">You haven't booked any repairs yet.</h4>
            <p className="text-muted fs-7">Browse standard catalogs and verify shop details to place your first booking.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {requests.map(req => (
              <div className="col-12" key={req.id}>
                <div className="card shadow-sm border-0 rounded-4 p-4 bg-white hover-shadow transition-all">
                  <div className="row align-items-center g-3">
                    <div className="col-md-3">
                      <span className={`badge ${getStatusBadgeClass(req.status)} px-3 py-2 rounded-pill fw-bold text-uppercase fs-8 mb-2 d-inline-block shadow-sm`}>
                        {req.status}
                      </span>
                      <h5 className="fw-bold text-dark mb-0">{req.serviceTypeName}</h5>
                      <small className="text-muted">Booking Reference: #{req.id}</small>
                    </div>

                    <div className="col-md-3">
                      <span className="text-muted d-block uppercase fs-8 fw-bold">Vehicle Details</span>
                      <span className="fw-bold text-dark"><i className="bi bi-car-front-fill text-muted me-1"></i>{req.vehicleDetails}</span>
                    </div>

                    <div className="col-md-3">
                      <span className="text-muted d-block uppercase fs-8 fw-bold">Workshop & Technician</span>
                      <span className="fw-semibold text-dark">{req.shopName}</span>
                      <small className="text-muted d-block mt-1">
                        <i className="bi bi-person-fill text-warning me-1"></i> {req.mechanicName || 'Assigning soon...'}
                      </small>
                    </div>

                    <div className="col-md-2">
                      <span className="text-muted d-block uppercase fs-8 fw-bold">Cost Estimate</span>
                      <span className="fs-4 fw-extrabold text-dark">₹{req.cost}</span>
                    </div>

                    <div className="col-md-1 text-md-end">
                      {req.status === 'COMPLETED' && !req.isReviewed && (
                        <button
                          className="btn btn-warning text-dark fw-bold btn-sm rounded-pill px-3 hover-scale"
                          data-bs-toggle="modal"
                          data-bs-target="#reviewModal"
                          onClick={() => handleOpenReviewModal(req)}
                        >
                          Review
                        </button>
                      )}
                      {req.status === 'COMPLETED' && req.isReviewed && (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-3 fs-8 fw-bold">
                          Reviewed <i className="bi bi-check-circle-fill"></i>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Step Tracker Timeline */}
                  {req.status !== 'CANCELLED' && (
                    <div className="row mt-4 pt-3 border-top border-light">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center position-relative my-2 flex-wrap gap-2">
                          {getTimelineSteps(req.status).map((step, idx) => (
                            <div key={idx} className="d-flex align-items-center gap-2">
                              <span className={`rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm ${
                                step.active ? 'bg-warning text-dark border border-warning' :
                                step.done ? 'bg-success text-white border border-success' : 'bg-light text-muted border border-light-subtle'
                              }`} style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                                {step.done ? <i className="bi bi-check"></i> : idx + 1}
                              </span>
                              <span className={`fs-8 fw-bold ${step.active ? 'text-warning' : step.done ? 'text-dark' : 'text-muted'}`}>{step.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-top mt-3 pt-3">
                    <div className="row text-muted fs-7">
                      <div className="col-md-8">
                        <strong className="text-dark">Customer Issue Notes:</strong> {req.issueDescription}
                      </div>
                      <div className="col-md-4 text-md-end">
                        <span>Submitted: {new Date(req.requestedAt).toLocaleString()}</span>
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

      {/* Review Modal */}
      <div className="modal fade" id="reviewModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow">
            <div className="modal-header bg-dark text-white border-0 py-3">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-star text-warning me-2"></i>
                Rate Your Experience
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              {reviewSuccess ? (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle-fill text-success display-3 mb-3"></i>
                  <h5 className="fw-bold">Feedback Submitted</h5>
                  <p className="text-muted">{reviewSuccess}</p>
                </div>
              ) : (
                <form onSubmit={submitReview}>
                  {reviewError && (
                    <div className="alert alert-danger border-0 rounded-3 mb-3">{reviewError}</div>
                  )}

                  {/* Rating selection */}
                  <div className="mb-3 text-center">
                    <label className="form-label text-muted fw-bold">Select Star Rating:</label>
                    <div className="d-flex gap-2 justify-content-center my-3 fs-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`bi bi-star-fill cursor-pointer hover-scale ${star <= rating ? 'text-warning' : 'text-muted'}`}
                          style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                          onClick={() => setRating(star)}
                        ></i>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <label className="form-label text-muted fw-bold">Write a brief description</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="4"
                      placeholder="Share your thoughts about the service, price accuracy, repair efficiency, and overall staff behavior..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="btn btn-dark w-100 py-3 rounded-3 text-warning fw-bold hover-scale"
                  >
                    {reviewLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : 'Submit Feedback'}
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

export default MyRequests;

