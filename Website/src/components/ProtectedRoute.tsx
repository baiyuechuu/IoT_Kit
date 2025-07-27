import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { type ReactNode } from "react";

interface ProtectedRouteProps {
	children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, loading } = useAuth();
	const location = useLocation();

	// Show loading while checking auth state
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="flex flex-col items-center gap-4">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					<p className="text-sm text-muted-foreground">
						Checking authentication...
					</p>
				</div>
			</div>
		);
	}

	// Redirect to login page if not authenticated, save location to redirect back after login
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Render children if authenticated
	return <>{children}</>;
}

