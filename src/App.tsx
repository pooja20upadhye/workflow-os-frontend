// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./features/auth/context/auth-context";
import { Toaster } from "sonner";

// Public Pages
import { LoginPage } from "./features/auth/pages/loginPage";
import { RegisterPage } from "./features/auth/pages/registerPage";

// Protected Pages
import { DashboardPage } from "./features/auth/pages/dashboardPage";

// Layout & Protection
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import RequesterRequestsPage from "./features/workflow/pages/RequesterRequestsPage";
import RequesterHistoryPage from "./features/workflow/pages/RequesterHistoryPage";
import RequesterSettingsPage from "./features/workflow/pages/RequesterSettingsPage";
import ApproverApprovalsPage from "./features/workflow/pages/ApproverApprovalsPage";
import ApproverHistoryPage from "./features/workflow/pages/ApproverHistoryPage";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" richColors closeButton />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes with Shared Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/requests" element={<RequesterRequestsPage />} />
            <Route path="/history" element={<RequesterHistoryPage />} />
            <Route path="/settings" element={<RequesterSettingsPage />} />
            <Route path="/approvals" element={<ApproverApprovalsPage />} />
            <Route path="/history" element={<ApproverHistoryPage />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}