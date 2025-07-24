import { lazy } from "react";
import LoginLayout from "@/layouts/LoginLayout";

const LoginPage = lazy(() => import("@/pages/login/Login"));

export const loginRoute = {
	path: "/login",
	element: <LoginLayout />,
	children: [
		{
			index: true,
			element: <LoginPage />,
		},
	],
};
