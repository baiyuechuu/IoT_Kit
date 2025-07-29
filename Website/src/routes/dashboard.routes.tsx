import { lazy } from "react";
import MainLayout from "@/layouts/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const DashboardListPage = lazy(() => import("@/pages/dashboard/DashboardListPage"));
const DevPage = lazy(() => import("@/pages/dashboard/dev/DevPage"));

export const dashboardRoute = {
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
};
