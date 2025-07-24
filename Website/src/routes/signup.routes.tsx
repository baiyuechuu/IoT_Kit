import { lazy } from "react";
import LoginLayout from "@/layouts/LoginLayout";

const SignupPage = lazy(() => import("@/pages/signup/Sign"));

export const signupRoute = {
	path: "/sign",
	element: <LoginLayout />,
	children: [
		{
			index: true,
			element: <SignupPage />,
		},
	],
};
