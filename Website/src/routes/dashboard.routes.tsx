import { lazy } from "react";
import MainLayout from "@/layouts/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const DashboardListPage = lazy(() => import("@/pages/dashboard/DashboardListPage"));
const DevPage = lazy(() => import("@/pages/dashboard/dev/DevPage"));

// Only show dashboard routes in development environment
const isDevelopment = import.meta.env.DEV;

export const dashboardRoute = isDevelopment ? {
	path: "/dashboard",
	element: <MainLayout />,
	children: [
		{
			index: true,
			element: (
				<ProtectedRoute>
					<DashboardListPage />
				</ProtectedRoute>
			),
		},
		{
			path: ":dashboardId",
			element: (
				<ProtectedRoute>
					<DevPage />
				</ProtectedRoute>
			),
		},
	],
} : {
	path: "/dashboard",
	element: <MainLayout />,
	children: [
		{
			index: true,
			element: <Dashboard />,
		},
	],
};