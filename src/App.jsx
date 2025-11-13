import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Plans from "./pages/Plans";
import Dashboard from "./pages/Dashboard";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import NavBar from "./components/NavBar";
import { refreshAccess } from "./slices/authSlice";
import { fetchPlans, fetchMySubscription } from "./slices/plansSlice";

function ProtectedRoute({ children, role }) {
  const auth = useSelector(s => s.auth);
  if (!auth.user) return <Navigate to="/login" replace />;
  if (role && auth.user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const dispatch = useDispatch();
  const auth = useSelector(s => s.auth);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  useEffect(() => {
    if (auth.user) {
      dispatch(fetchMySubscription({ userId: auth.user.id }));
    }
  }, [auth.user, dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      const tok = JSON.parse(localStorage.getItem("subdash_tokens") || "null");
      if (tok && tok.refreshToken) {
        dispatch(refreshAccess({ refreshToken: tok.refreshToken })).catch(() => {
          localStorage.removeItem("subdash_tokens");
        });
      }
    }, 1000 * 60 * 4);
    return () => clearInterval(timer);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/plans" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plans" element={<Plans />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/subscriptions"
            element={<ProtectedRoute role="admin"><AdminSubscriptions /></ProtectedRoute>}
          />
        </Routes>
      </main>
    </div>
  );
}
