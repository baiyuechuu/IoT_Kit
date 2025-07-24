import { lazy } from "react";
import MainLayout from "@/layouts/MainLayout";

const SignupPage = lazy(() => import("@/pages/signup/Sign"));

export const signupRoute = {
	path: "/sign",
	element: <MainLayout />,
	children: [
		{
			index: true,
			element: <SignupPage />,
		},
	],
};
