import { FaUikit } from "react-icons/fa";
import { FaGithub} from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";

export function Navbar() {
	const location = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const navItems = [
		{ name: "Home", path: "/" },
		{ name: "About", path: "/about" },
		{ name: "UI Kit", path: "/uikit" },
		{ name: "Dashboard", path: "/dashboard" },
		{ name: "Contact", path: "/contact" },
	];

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<div className="w-full fixed top-0 z-50 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-700/50">
			<div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
				<div className="flex items-center gap-8">
					{/* Logo */}
					<div className="flex items-center">
						<FaUikit size={32} />
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-8">
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
					</nav>
				</div>
				{/* Desktop Right Side */}
				<div className="hidden md:flex items-center gap-4">
					{/* Search button */}
					<button
						className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-700/30 border border-gray-300 dark:border-gray-700/60 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300"
						title="Search pages and posts (Ctrl+K)"
					>
						<IoSearchOutline className="h-4 w-4" />
						<span className="hidden lg:block">Search</span>
						<div className="hidden lg:flex items-center gap-0.5 text-xs opacity-60">
							<span>⌘</span>
							<span>K</span>
						</div>
					</button>

					<div className="flex items-center gap-3">
						<Link to="https://github.com/baiyuechuu/IoT_Kit" target="_blank">
							<FaGithub className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer transition-colors" />
						</Link>
					</div>
				</div>

				{/* Mobile Menu Button */}
				<button
					onClick={toggleMenu}
					className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
					aria-label="Toggle menu"
				>
					{isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
				</button>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="md:hidden bg-white dark:bg-neutral-950">
					<nav className="px-4 py-4">
						<ul className="space-y-2">
							{navItems.map((item) => (
								<li key={item.name}>
									<Link
										to={item.path}
										onClick={closeMenu}
										className={`block px-3 py-2 rounded-md transition-all duration-200 ${
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

						{/* Mobile Search */}
						<div className="pt-4">
							<button
								className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-200/30 dark:hover:bg-gray-700/30 border border-gray-300 dark:border-gray-700/30 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300"
								title="Search"
							>
								<IoSearchOutline className="h-4 w-4" />
								<span>Search</span>
							</button>
						</div>
					</nav>
				</div>
			)}
		</div>
	);
}
