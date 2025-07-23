import { lazy } from "react";
import MainLayout from "@/layouts/MainLayout";

const UIKitPage = lazy(() => import("@/pages/uikit/UIKit"));

export const uikitRoute = {
	path: "/uikit",
	element: <MainLayout />,
	children: [
		{
			index: true,
			element: <UIKitPage />,
		},
	],
};
