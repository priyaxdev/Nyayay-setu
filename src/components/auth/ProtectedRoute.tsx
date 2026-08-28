import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRole?: "CITIZEN" | "POLICE";
};

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">Checking session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={allowedRole === "POLICE" ? "/police/login" : "/login"} replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    // Logged in, but wrong role trying to access this section
    return <Navigate to={user?.role === "POLICE" ? "/police/dashboard" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}