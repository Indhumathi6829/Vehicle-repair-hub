import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [type, setType] = useState('Car');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [regNumber, setRegNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setListLoading(true);
    try {
      const res = await api.get('/api/customer/vehicles/my');
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to load vehicles');
    } finally {
      setListLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/api/customer/vehicles', { type, brand, model, regNumber });
      setSuccess('Vehicle profile added successfully!');
      setBrand('');
      setModel('');
      setRegNumber('');
      fetchVehicles();
    } catch (err) {
      setError(err.message || 'Failed to add vehicle profile.');
    } finally {
      setLoading(false);
    }
  };

  const getVehicleIcon = (vType) => {
    return {
      Car: 'bi-car-front-fill',
      Bike: 'bi-bicycle',
      SUV: 'bi-truck-flatbed',
      Truck: 'bi-truck'
    }[vType] || 'bi-car-front';
  };

  return (
    <div className="container py-5">
      <div className="row mb-5 text-center text-md-start">
        <div className="col-12">
          <span className="badge bg-dark text-warning px-3 py-2 rounded-pill fw-bold text-uppercase fs-8 mb-2">
            <i className="bi bi-car-front-fill me-1"></i> Fleet Management
          </span>
          <h2 className="fw-extrabold text-dark">My Registered Vehicles</h2>
          <p className="text-muted">Save your vehicle specifications to expedite transparent catalog bookings.</p>
        </div>
      </div>

      <div className="row g-5">
        
        {/* Left Column: Form */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
            <h4 className="fw-bold mb-3 text-dark">Add New Vehicle</h4>
            <p className="text-muted fs-7 mb-4">Complete details to create a unique profile card for quick booking selectors.</p>
            
            {success && <div className="alert alert-success border-0 rounded-3 mb-3 shadow-sm"><i className="bi bi-check-circle-fill me-2"></i>{success}</div>}
            {error && <div className="alert alert-danger border-0 rounded-3 mb-3 shadow-sm"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}

            <form onSubmit={handleAddVehicle}>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold fs-7">Vehicle Classification Type</label>
                <select className="form-select rounded-3 bg-light" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Car">Sedan / Hatchback (Car)</option>
                  <option value="Bike">Motorcycle / Scooter (Bike)</option>
                  <option value="SUV">SUV / Crossover</option>
                  <option value="Truck">Heavy Vehicle / Truck</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted fw-semibold fs-7">Brand / Manufacturer</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. Honda, Hyundai, BMW"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted fw-semibold fs-7">Model Variant Name</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. Civic, Creta, i8"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-semibold fs-7">Registration Plate Number</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. KA-01-AB-1234"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-dark w-100 py-3 rounded-3 text-warning fw-bold hover-scale">
                {loading ? <span className="spinner-border spinner-border-sm me-2" role="status"></span> : 'Onboard Vehicle Profile'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
            <h4 className="fw-bold mb-4 text-dark">Garage Fleet ({vehicles.length})</h4>
            
            {listLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status"></div>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-car-front text-muted display-2"></i>
                <h5 className="mt-3 text-muted">No vehicles registered yet.</h5>
                <p className="text-muted fs-7">Add your vehicle profile using the onboarding form to enable repair bookings.</p>
              </div>
            ) : (
              <div className="row g-3">
                {vehicles.map(v => (
                  <div className="col-12" key={v.id}>
                    <div className="border rounded-3 p-3 d-flex align-items-center justify-content-between hover-shadow transition-all bg-light bg-opacity-20">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-dark text-warning rounded-3 p-3">
                          <i className={`bi fs-3 ${getVehicleIcon(v.type)}`}></i>
                        </div>
                        <div>
                          <h5 className="fw-bold mb-0 text-dark">{v.brand} {v.model}</h5>
                          <span className="text-muted text-uppercase fw-bold fs-8 px-2 py-1 rounded bg-white border d-inline-block mt-2">
                            <i className="bi bi-tag-fill me-1"></i> {v.regNumber}
                          </span>
                        </div>
                      </div>
                      <span className="badge bg-dark text-warning border px-3 py-2 rounded-pill fw-bold uppercase fs-8">{v.type}</span>
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

export default MyVehicles;

