import { lazy } from "react";
import MainLayout from "@/layouts/MainLayout";

const ShowCasePage = lazy(() => import("@/pages/showcase/ShowCase"));

export const showcaseRoute = {
	path: "/showcase",
	element: <MainLayout />,
	children: [
		{
			index: true,
			element: <ShowCasePage />,
		},
	],
};
