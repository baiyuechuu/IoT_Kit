import { lazy } from "react";
import MainLayout from "@/layouts/MainLayout";

const LoginPage = lazy(() => import("@/pages/login/Login"));

export const loginRoute = {
	path: "/login",
	element: <MainLayout />,
	children: [
		{
			index: true,
			element: <LoginPage />,
		},
	],
};
