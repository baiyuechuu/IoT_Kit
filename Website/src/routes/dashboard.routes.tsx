import { lazy } from "react";
import MainLayout from "@/layouts/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const DashboardPage = lazy(() => import("@/pages/dashboard/Dashboard"));

export const dashboardRoute = {
	path: "/dashboard",
	element: <MainLayout />,
	children: [
		{
			index: true,
			element: (
				<ProtectedRoute>
					<DashboardPage />
				</ProtectedRoute>
			),
		},
	],
};
