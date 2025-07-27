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
	// Documentation - [FreeRTOS] Set Up Environment and Create Project on ESP32
	{
		id: "freertos-set-up-environment-and-create-project-on-esp32-docs",
		title: "[FreeRTOS] Set Up Environment and Create Project on ESP32",
		description: "Tutorial to setting up the environment and creating a FreeRTOS simulation project using PlatformIO (ESP-IDF Framework)",
		type: "tutorial",
		path: "/blog/freertos-set-up-environment-and-create-project-on-esp32",
		icon: <FaUikit className="w-6 h-6" />,
		keywords: ["[freertos]", "set", "environment", "create", "project", "esp32", "tutorial", "setting", "creating", "freertos", "simulation", "using", "platformio", "(esp-idf", "framework)", "rtos_blog_1"],
	},
	// Documentation - Render Example For Markdown
	{
		id: "render-example-for-markdown-docs",
		title: "Render Example For Markdown",
		description: "A page demonstrating various markdown elements and formatting options for rendering",
		type: "example",
		path: "/blog/render-example-for-markdown",
		icon: <FaUikit className="w-6 h-6" />,
		keywords: ["render", "example", "markdown", "page", "demonstrating", "various", "elements", "formatting", "options", "rendering"],
	}
];

export default searchItems;
