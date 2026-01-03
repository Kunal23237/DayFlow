import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';

import FeaturesPage from './pages/FeaturesPage';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import AuthLayout from './layouts/AuthLayout';

import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import EmployeeListPage from './features/employees/pages/EmployeeListPage';
import AttendancePage from './features/attendance/pages/AttendancePage';
import LeavePage from './features/leave/pages/LeavePage';
import PayrollPage from './features/payroll/pages/PayrollPage';
import ProfilePage from './features/employees/pages/ProfilePage';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/features" element={<FeaturesPage />} />

                    {/* Auth Routes */}
                    <Route path="/auth" element={<AuthLayout />}>
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<SignupPage />} />
                        <Route index element={<LoginPage />} />
                    </Route>

                    {/* Alias Routes for Features that require Auth */}
                    <Route path="/hr-management" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<DashboardPage />} />
                    </Route>

                    <Route path="/employee-portal" element={
                        <ProtectedRoute allowedRoles={['employee']}>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<DashboardPage />} />
                    </Route>

                    {/* Admin Dashboard */}
                    <Route
                        path="/admin-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardPage />} />
                        <Route path="profile" element={<ProfilePage />} /> {/* New Admin Profile Route */}
                        <Route path="employees" element={<EmployeeListPage />} />
                        <Route path="attendance" element={<AttendancePage />} />
                        <Route path="leave" element={<LeavePage />} />
                        <Route path="payroll" element={<PayrollPage />} />
                    </Route>

                    {/* Employee Dashboard */}
                    <Route
                        path="/employee-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['employee']}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardPage />} />
                        <Route path="employees" element={<ProfilePage />} /> {/* Reuse ProfilePage for "My Profile" */}
                        <Route path="attendance" element={<AttendancePage />} />
                        <Route path="leave" element={<LeavePage />} />
                        <Route path="payroll" element={<PayrollPage />} />
                    </Route>

                    {/* Legacy Redirect */}
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />

                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
