import { Navigate, Route, Routes } from "react-router-dom";

import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import EntryEditPage from "./pages/EntryEditPage";
import EntryNewPage from "./pages/EntryNewPage";
import EntryViewPage from "./pages/EntryViewPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./context/AuthContext";

const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

const App = () => {
  return (
    <div className="poster-surface min-h-screen bg-cream text-cocoa">
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/entry/new"
          element={
            <PrivateRoute>
              <EntryNewPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/entry/:id"
          element={
            <PrivateRoute>
              <EntryViewPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/entry/:id/edit"
          element={
            <PrivateRoute>
              <EntryEditPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
