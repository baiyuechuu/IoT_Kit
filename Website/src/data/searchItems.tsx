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
		id: "uikit",
		title: "UI Kit",
		description: "Collection of UI components and design system",
		type: "page",
		path: "/uikit",
		icon: <FaUikit className="w-6 h-6" />,
		keywords: ["ui", "components", "design", "system", "kit"],
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
	// Documentation - MDX and Custom Code Blocks Setup Guide
	{
		id: "mdx-setup-docs",
		title: "MDX and Custom Code Blocks Setup Guide",
		description: "Comprehensive guide for setting up MDX (Markdown + JSX) with custom code blocks in your React + Vite project",
		type: "documentation",
		path: "/uikit?section=mdx-setup",
		icon: <FaUikit className="w-6 h-6" />,
		keywords: ["mdx", "custom", "code", "blocks", "setup", "guide", "comprehensive", "setting", "(markdown", "jsx)", "your", "react", "vite", "project", "mdx-setup"],
	},
	// Documentation - Test Documentation Page
	{
		id: "test-docs",
		title: "Test Documentation Page",
		description: "A test page demonstrating various markdown elements and formatting options",
		type: "documentation",
		path: "/uikit?section=test",
		icon: <FaUikit className="w-6 h-6" />,
		keywords: ["test", "documentation", "page", "demonstrating", "various", "markdown", "elements", "formatting", "options"],
	}
];

export default searchItems;
