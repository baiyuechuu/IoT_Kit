import { createBrowserRouter } from "react-router-dom";
import { homeRoute } from "./home.routes";
import { aboutRoute } from "./about.routes";
import { contactRoute } from "./contact.routes";
import { dashboardRoute } from "./dashboard.routes";
import { uikitRoute } from "./uikit.routes";
import { loginRoute } from "./login.routes";  
import { signupRoute } from "./signup.routes";
import { showcaseRoute } from "./showcase.routes";
import { notFoundRoute } from "./notfound.routes";

export const routes = [
	homeRoute,
	aboutRoute,
	contactRoute,
	dashboardRoute,
	uikitRoute,
  loginRoute,
  signupRoute,
  showcaseRoute,
  notFoundRoute, // This should be last to catch all unmatched routes
];

export const router = createBrowserRouter(routes);

