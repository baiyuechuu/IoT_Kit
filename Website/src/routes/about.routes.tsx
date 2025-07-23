import { lazy } from "react";
import MainLayout from "@/layouts/MainLayout";

const AboutPage = lazy(() => import("@/pages/about/About"));

export const aboutRoute = {
	path: "/about",
	element: <MainLayout />,
	children: [
		{
			index: true,
			element: <AboutPage />,
		},
	],
};
