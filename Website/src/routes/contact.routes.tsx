import { lazy } from "react";
import MainLayout from "@/layouts/MainLayout";

const ContactPage = lazy(() => import("@/pages/contact/Contact"));

export const contactRoute = {
	path: "/contact",
	element: <MainLayout />,
	children: [
		{
			index: true,
			element: <ContactPage />,
		},
	],
};
