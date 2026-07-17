import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BrowseShops from './pages/customer/BrowseShops';
import MyVehicles from './pages/customer/MyVehicles';
import MyRequests from './pages/customer/MyRequests';
import MyShopProfile from './pages/owner/MyShopProfile';
import ManageMechanics from './pages/owner/ManageMechanics';
import ManageRequests from './pages/owner/ManageRequests';
import MechanicDashboard from './pages/mechanic/MechanicDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// BootStrap Setup
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100 bg-light">
          <Navbar />
          <div className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Routes */}
              <Route
                path="/customer/browse"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['CUSTOMER']}>
                      <BrowseShops />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer/vehicles"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['CUSTOMER']}>
                      <MyVehicles />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer/requests"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['CUSTOMER']}>
                      <MyRequests />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />

              {/* Shop Owner Routes */}
              <Route
                path="/owner/shop"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['SHOP_OWNER']}>
                      <MyShopProfile />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/owner/mechanics"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['SHOP_OWNER']}>
                      <ManageMechanics />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/owner/jobs"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['SHOP_OWNER']}>
                      <ManageRequests />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />

              {/* Mechanic Routes */}
              <Route
                path="/mechanic/jobs"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['MECHANIC']}>
                      <MechanicDashboard />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/shops"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <footer className="bg-dark text-muted py-4 border-top border-secondary text-center">
            <div className="container">
              <small>© {new Date().getFullYear()} Trusted Vehicle Repair Hub. All rights reserved.</small>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
