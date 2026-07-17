import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const MechanicDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/mechanic/repair-requests/my-jobs?page=${page}&size=10`);
      setJobs(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load assigned jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    setUpdatingId(jobId);
    try {
      await api.put(`/api/mechanic/repair-requests/${jobId}/status?status=${newStatus}`);
      fetchJobs(); // Refresh jobs list
    } catch (err) {
      alert(err.message || 'Failed to update job status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    return {
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
          <span className="badge bg-dark text-warning px-3 py-2 rounded-pill fw-bold text-uppercase fs-8 mb-2">
            <i className="bi bi-tools me-1"></i> Workshop Queue
          </span>
          <h2 className="fw-extrabold text-dark">Technician Job Queue</h2>
          <p className="text-muted mb-0">View your assigned tasks queue and update active repair progress in one click.</p>
        </div>
        <button className="btn btn-outline-dark rounded-pill btn-sm px-3" onClick={fetchJobs}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger border-0 rounded-4 mb-4 shadow-sm">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-5 card border-0 shadow-sm rounded-4 bg-white">
          <div className="card-body py-5 text-center">
            <i className="bi bi-list-task text-muted display-1"></i>
            <h4 className="mt-3 text-muted">No jobs assigned.</h4>
            <p className="text-muted fs-7">When the shop owner assigns a repair booking to you, it will appear in this task queue.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {jobs.map(job => (
              <div className="col-12" key={job.id}>
                <div className="card shadow-sm border-0 rounded-4 p-4 bg-white hover-shadow transition-all">
                  <div className="row align-items-center g-3">
                    <div className="col-md-3">
                      <span className={`badge ${getStatusBadgeClass(job.status)} px-3 py-2 rounded-pill fw-bold text-uppercase fs-8 mb-2 d-inline-block shadow-sm`}>
                        {job.status === 'IN_PROGRESS' && <span className="spinner-grow spinner-grow-sm me-1" role="status" style={{ width: '8px', height: '8px' }}></span>}
                        {job.status}
                      </span>
                      <h5 className="fw-bold text-dark mb-0">{job.serviceTypeName}</h5>
                      <small className="text-muted">Job ID: #{job.id}</small>
                    </div>

                    <div className="col-md-3">
                      <span className="text-muted d-block uppercase fs-8 fw-bold">Vehicle Details</span>
                      <span className="fw-bold text-dark"><i className="bi bi-car-front-fill text-muted me-1"></i>{job.vehicleDetails}</span>
                    </div>

                    <div className="col-md-3">
                      <span className="text-muted d-block uppercase fs-8 fw-bold">Customer Profile</span>
                      <span className="fw-semibold text-dark">
                        <i className="bi bi-person-circle text-muted me-1"></i> {job.customerName}
                      </span>
                    </div>

                    <div className="col-md-3 text-md-end">
                      {job.status === 'ACCEPTED' && (
                        <button
                          className="btn btn-warning text-dark fw-bold px-4 py-2.5 rounded-pill hover-scale shadow-sm"
                          disabled={updatingId === job.id}
                          onClick={() => handleUpdateStatus(job.id, 'IN_PROGRESS')}
                        >
                          {updatingId === job.id ? 'Starting...' : <><i className="bi bi-play-fill me-1"></i>Start Repair</>}
                        </button>
                      )}
                      {job.status === 'IN_PROGRESS' && (
                        <button
                          className="btn btn-success text-white fw-bold px-4 py-2.5 rounded-pill hover-scale shadow-sm"
                          disabled={updatingId === job.id}
                          onClick={() => handleUpdateStatus(job.id, 'COMPLETED')}
                        >
                          {updatingId === job.id ? 'Completing...' : <><i className="bi bi-check2-circle me-1"></i>Mark Completed</>}
                        </button>
                      )}
                      {job.status === 'COMPLETED' && (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold fs-7 shadow-sm">
                          <i className="bi bi-check-circle-fill me-1"></i> Task Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-top mt-3 pt-3">
                    <div className="row text-muted fs-7">
                      <div className="col-md-8">
                        <strong className="text-dark">Customer Issue Notes:</strong> {job.issueDescription}
                      </div>
                      <div className="col-md-4 text-md-end">
                        <span>Assigned: {new Date(job.requestedAt).toLocaleString()}</span>
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

export default MechanicDashboard;

