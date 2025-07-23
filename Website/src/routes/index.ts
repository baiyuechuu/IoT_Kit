import { createBrowserRouter } from "react-router-dom";
import { homeRoute } from "./home.routes";
import { aboutRoute } from "./about.routes";
import { contactRoute } from "./contact.routes";
import { dashboardRoute } from "./dashboard.routes";
import { uikitRoute } from "./uikit.routes";

export const routes = [
	homeRoute,
	aboutRoute,
	contactRoute,
	dashboardRoute,
	uikitRoute,
];

export const router = createBrowserRouter(routes);

