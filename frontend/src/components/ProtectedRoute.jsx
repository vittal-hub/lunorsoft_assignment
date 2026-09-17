import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Block access to private pages until the user is authenticated
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loading">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
