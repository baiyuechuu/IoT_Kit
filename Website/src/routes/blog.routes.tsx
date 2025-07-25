import { lazy } from "react";
import MainLayout from "@/layouts/MainLayout";

const BlogPage = lazy(() => import("@/pages/blog/Blog"));

export const blogRoute = {
	path: "/blog",
	element: <MainLayout />,
	children: [
		{
			index: true,
			element: <BlogPage />,
		},
		{
			path: ":section",
			element: <BlogPage />,
		},
	],
};
