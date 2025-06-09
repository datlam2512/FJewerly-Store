import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, roles = [] }) => {
  const userRole = localStorage.getItem("role");

  if (!Array.isArray(roles) || !roles.includes(userRole)) {
    return <Navigate to="/no-access" />;
  }

  return children;
};

export default RoleBasedRoute;