import {
	FaHome,
	FaInfoCircle,
	FaUikit,
	FaTachometerAlt,
	FaSignInAlt,
	FaUserPlus,
} from "react-icons/fa";

import type { SearchItem } from "@/types";
// Define all searchable items
const searchItems: SearchItem[] = [
// Pages
	{
		id: "home",
		title: "Home",
		description: "Main landing page with overview",
		type: "page",
		path: "/",
		icon: <FaHome className="w-6 h-6" />,
		keywords: ["home", "main", "landing", "overview"],
	},
	{
		id: "about",
		title: "About",
		description: "Learn more about our IoT Kit project",
		type: "page",
		path: "/about",
		icon: <FaInfoCircle className="w-6 h-6" />,
		keywords: ["about", "info", "information", "project", "team"],
	},
	{
		id: "blog",
		title: "Blog",
		description: "Documentation and blog posts",
		type: "page",
		path: "/blog",
		icon: <FaUikit className="w-6 h-6" />,
		keywords: ["blog", "docs", "documentation", "posts"],
	},
	{
		id: "dashboard",
		title: "Dashboard",
		description: "User dashboard with personalized content",
		type: "page",
		path: "/dashboard",
		icon: <FaTachometerAlt className="w-6 h-6" />,
		keywords: ["dashboard", "user", "personal", "profile"],
	},
	{
		id: "login",
		title: "Sign In",
		description: "Login to your account",
		type: "page",
		path: "/login",
		icon: <FaSignInAlt className="w-6 h-6" />,
		keywords: ["login", "signin", "sign", "in", "authenticate", "auth"],
	},
	{
		id: "signup",
		title: "Sign Up",
		description: "Create a new account",
		type: "page",
		path: "/sign",
		icon: <FaUserPlus className="w-6 h-6" />,
		keywords: ["signup", "register", "create", "account", "join"],
	},
	// Documentation
	// Documentation - Render Example For Markdown
	{
		id: "render-example-for-markdown-docs",
		title: "Render Example For Markdown",
		description: "A page demonstrating various markdown elements and formatting options for rendering",
		type: "documentation",
		path: "/blog/render-example-for-markdown",
		icon: <FaUikit className="w-6 h-6" />,
		keywords: ["render", "example", "markdown", "page", "demonstrating", "various", "elements", "formatting", "options", "rendering"],
	}
];

export default searchItems;
