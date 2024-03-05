import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export const ProtectedRoute = () => {
	const { currentUser } = useAuth();
	return currentUser ? <Outlet /> : <Navigate to="/signup" />;
};
