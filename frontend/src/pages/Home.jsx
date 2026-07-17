import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  const getDashboardRoute = () => {
    if (!user) return '/login';
    return {
      CUSTOMER: '/customer/browse',
      SHOP_OWNER: '/owner/shop',
      MECHANIC: '/mechanic/jobs',
      ADMIN: '/admin/shops',
    }[user.role] || '/login';
  };

  return (
    <div className="bg-light">
      {/* Premium Hero Section */}
      <section className="bg-dark text-white py-5 position-relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="position-absolute top-0 start-50 translate-middle-x" style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255, 193, 7, 0.08) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }}></div>

        <div className="container py-5 position-relative z-1">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-center text-lg-start">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold text-uppercase fs-8 mb-4 shadow-sm animate-pulse">
                <i className="bi bi-shield-fill-check me-1"></i> ISO 9001:2026 Certified Platform
              </span>
              <h1 className="display-3 fw-extrabold mb-4 lh-sm">
                Smart Vehicle Repair <br />
                <span className="text-gradient">With Fixed Pricing.</span>
              </h1>
              <p className="lead text-muted mb-4 fs-5" style={{ maxWidth: '600px' }}>
                Skip the negotiation. Browse certified local mechanic shops, book standardized services at fixed catalog rates, and monitor repair status in real-time.
              </p>
              
              <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3 mt-4">
                <Link to={getDashboardRoute()} className="btn btn-warning text-dark btn-lg px-4 py-3 rounded-pill fw-bold hover-scale shadow-lg">
                  <i className="bi bi-speedometer2 me-2"></i> Access Dashboard
                </Link>
                {!user && (
                  <Link to="/register" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill hover-scale">
                    <i className="bi bi-shop me-2"></i> Register Your Shop
                  </Link>
                )}
              </div>

              {/* Stat badges under CTA */}
              <div className="row g-4 mt-5 pt-3 border-top border-secondary text-start justify-content-center justify-content-lg-start">
                <div className="col-auto col-md-4">
                  <h3 className="fw-bold text-warning mb-0">15,000+</h3>
                  <small className="text-muted">Repairs Completed</small>
                </div>
                <div className="col-auto col-md-4">
                  <h3 className="fw-bold text-warning mb-0">250+</h3>
                  <small className="text-muted">Verified Garages</small>
                </div>
                <div className="col-auto col-md-4">
                  <h3 className="fw-bold text-warning mb-0">4.9 / 5.0</h3>
                  <small className="text-muted">Customer Rating</small>
                </div>
              </div>
            </div>
            
            {/* Visual Dashboard Mockup Card */}
            <div className="col-lg-5 text-center d-none d-lg-block">
              <div className="card bg-secondary bg-opacity-10 border border-secondary border-opacity-25 rounded-4 p-4 shadow-lg text-start">
                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary border-opacity-25 pb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="bg-success rounded-circle d-inline-block" style={{ width: '10px', height: '10px' }}></span>
                    <span className="text-muted fs-8 fw-semibold uppercase">Live Tracker</span>
                  </div>
                  <small className="text-warning fw-bold fs-8">Ref: #RR-4820</small>
                </div>
                
                <h6 className="fw-bold text-white mb-1">Standard Engine Diagnostic</h6>
                <p className="text-muted fs-7 mb-4">Stark QuickFix Garage — Mechanic Tony</p>
                
                {/* Visual Timeline Stepper */}
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex gap-3 align-items-center opacity-50">
                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                    <div>
                      <small className="text-muted d-block fs-8">Step 1</small>
                      <span className="text-white fs-7 fw-semibold">Booking Approved</span>
                    </div>
                  </div>
                  <div className="d-flex gap-3 align-items-center opacity-50">
                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                    <div>
                      <small className="text-muted d-block fs-8">Step 2</small>
                      <span className="text-white fs-7 fw-semibold">Mechanic Assigned</span>
                    </div>
                  </div>
                  <div className="d-flex gap-3 align-items-center">
                    <i className="bi bi-record-circle-fill text-warning fs-5 animate-pulse"></i>
                    <div>
                      <small className="text-warning d-block fs-8 fw-bold">Step 3 (Active)</small>
                      <span className="text-white fs-7 fw-bold">Repair In Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="py-4 bg-white border-bottom">
        <div className="container text-center">
          <span className="text-muted uppercase fs-8 fw-bold mb-3 d-block">Trusted by Leading Automotive Brands</span>
          <div className="row justify-content-center align-items-center g-5 opacity-50">
            <div className="col-4 col-md-2 fw-extrabold text-dark fs-4">MOTOR-MAX</div>
            <div className="col-4 col-md-2 fw-extrabold text-dark fs-4">AUTO-GLOW</div>
            <div className="col-4 col-md-2 fw-extrabold text-dark fs-4">GEAR-TEC</div>
            <div className="col-4 col-md-2 fw-extrabold text-dark fs-4">DRIVE-PRO</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-5 bg-light">
        <div className="container py-5 text-center text-md-start">
          <div className="text-center mb-5">
            <span className="badge bg-dark text-warning px-3 py-2 rounded-pill fw-bold text-uppercase fs-8 mb-2">Features</span>
            <h2 className="fw-extrabold text-dark">Engineered For Reliability</h2>
            <p className="text-muted max-w-600 mx-auto">We connect customers, shops, and technicians through a single integrated portal.</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 p-4 hover-shadow bg-white">
                <div className="bg-warning text-dark d-inline-flex p-3 rounded-4 mb-4">
                  <i className="bi bi-shield-lock-fill fs-3"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Verified Workshop Standards</h5>
                <p className="text-muted fs-7 mb-0">Every workshop details undergo comprehensive verification reviews before being approved to receive bookings.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 p-4 hover-shadow bg-white">
                <div className="bg-warning text-dark d-inline-flex p-3 rounded-4 mb-4">
                  <i className="bi bi-tag-fill fs-3"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Fixed Catalog Pricing</h5>
                <p className="text-muted fs-7 mb-0">No surprise markups. View standardized baseline rates for services set by the platform administration catalog.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 p-4 hover-shadow bg-white">
                <div className="bg-warning text-dark d-inline-flex p-3 rounded-4 mb-4">
                  <i className="bi bi-chat-heart-fill fs-3"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Genuine Client Reviews</h5>
                <p className="text-muted fs-7 mb-0">Read transparent ratings and testimonials from verified vehicle owners post-service completion.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-extrabold text-dark">What Customers Say</h2>
            <p className="text-muted">Real stories of transparent repairs on our platform.</p>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="border rounded-4 p-4 bg-light h-100 d-flex flex-column justify-content-between">
                <p className="text-muted fs-7 mb-4 italic">
                  "Finding an honest mechanic can be tough. Having fixed-rate pricing catalogs and seeing exactly when my mechanic started on my battery replacement was amazing!"
                </p>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-warning text-dark rounded-circle p-2 fw-bold fs-7" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    PW
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 fs-7">Peter Parker</h6>
                    <small className="text-muted">Honda Civic Owner</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="border rounded-4 p-4 bg-light h-100 d-flex flex-column justify-content-between">
                <p className="text-muted fs-7 mb-4 italic">
                  "Approved shops and clear updates on status. I booked an oil change, saw John Doe get assigned, and got my Tesla back in 45 minutes flat!"
                </p>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-warning text-dark rounded-circle p-2 fw-bold fs-7" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    BW
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 fs-7">Bruce Wayne</h6>
                    <small className="text-muted">Tesla Model 3 Owner</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 offset-md-3 offset-lg-0">
              <div className="border rounded-4 p-4 bg-light h-100 d-flex flex-column justify-content-between">
                <p className="text-muted fs-7 mb-4 italic">
                  "Registering my shop and listing mechanics took 5 minutes. The admin approved our profile quickly, and bookings came in immediately. High recommend."
                </p>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-warning text-dark rounded-circle p-2 fw-bold fs-7" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    TS
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 fs-7">Tony Stark</h6>
                    <small className="text-muted">Stark QuickFix Owner</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-dark text-white py-5 text-center position-relative">
        <div className="container py-4">
          <h2 className="fw-extrabold mb-3">Onboard Your Workshop Today</h2>
          <p className="text-muted mb-4 max-w-600 mx-auto">Get access to custom repair bookings, manage mechanics, and digitize your customer repair updates.</p>
          <Link to="/register" className="btn btn-warning text-dark px-5 py-3 rounded-pill fw-bold hover-scale shadow">
            Get Registered Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

