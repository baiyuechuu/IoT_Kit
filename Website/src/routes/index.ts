import { createBrowserRouter } from "react-router-dom";
import { homeRoute } from "./home.routes";
import { aboutRoute } from "./about.routes";
// import { contactRoute } from "./contact.routes";
import { dashboardRoute } from "./dashboard.routes";
import { blogRoute } from "./blog.routes";
import { loginRoute } from "./login.routes";
import { signupRoute } from "./signup.routes";
// import { showcaseRoute } from "./showcase.routes";
import { notFoundRoute } from "./notfound.routes";

export const routes = [
	homeRoute,
	aboutRoute,
	// contactRoute,
	dashboardRoute,
	blogRoute,
	loginRoute,
	signupRoute,
	// showcaseRoute,
	notFoundRoute,
];

export const router = createBrowserRouter(routes);
