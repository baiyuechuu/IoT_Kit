import { lazy } from "react";

const NotFoundPage = lazy(() => import("@/pages/404/NotFound"));

export const notFoundRoute = {
	path: "*",
	element: <NotFoundPage />,
}; 