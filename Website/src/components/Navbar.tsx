import { FaUikit } from "react-icons/fa";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { useLocation, Link } from "react-router-dom";

export function Navbar() {
	const location = useLocation();
	
	const navItems = [
		{ name: "Home", path: "/" },
		{ name: "About", path: "/about" },
		{ name: "Contact", path: "/contact" },
		{ name: "Services", path: "/services" },
	];

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700/50">
			<div className="flex items-center gap-8">
				<FaUikit size={32}/>
				<ul className="flex items-center gap-5">
					{navItems.map((item) => (
						<li key={item.name}>
							<Link
								to={item.path}
								className={`px-3 py-1.5 rounded-md transition-all duration-200 ${
									isActive(item.path)
										? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
										: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30 hover:text-gray-900 dark:hover:text-gray-100"
								}`}
							>
								{item.name}
							</Link>
						</li>
					))}
				</ul>
			</div>
			<div className="flex items-center gap-5">
				{/* Search button */}
				<button
					className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-700/30 border border-gray-300 dark:border-gray-700/60 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300"
					title="Search pages and posts (Ctrl+K)"
				>
					<IoSearchOutline className="h-4 w-4" />
					<span>Search</span>
					<div className="flex items-center gap-0.5 text-xs opacity-60">
						<span>⌘</span>
						<span>K</span>
					</div>
				</button>

				<FaGithub />
				<FaTwitter />
				<FaLinkedin />
			</div>
		</div>
	);
}
