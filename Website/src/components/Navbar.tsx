import { FaUikit } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { LogOut, User } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { SearchComponent, MobileSearchComponent } from "./SearchComponent";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Navbar() {
	const location = useLocation();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { isAuthenticated, user, signOut, loading } = useAuth();

	const navItems = [
		{ name: "Home", path: "/" },
		{ name: "About", path: "/about" },
		{ name: "Blog", path: "/uikit" },
		{ name: "Dashboard", path: "/dashboard" },
		// { name: "Showcase", path: "/showcase" },
		// { name: "Contact", path: "/contact" },
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

	const handleLogout = async () => {
		try {
			closeMenu(); // Close mobile menu if open
			// Navigate to home page immediately before signOut to prevent ProtectedRoute redirect
			navigate("/");
			// Then sign out
			await signOut();
		} catch (error) {
			console.error("Logout failed:", error);
			// If logout fails, still try to redirect to home
			navigate("/");  
		}
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
					<nav className="hidden md:flex items-center gap-3">
						<ul className="flex items-center gap-2">
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
					<div className="flex items-center gap-3">
						<Link to="https://github.com/baiyuechuu/IoT_Kit" target="_blank">
							<FaGithub className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer transition-colors" />
						</Link>
					</div>
					<div className="flex items-center gap-2">
						{/* Search Component */}
						<SearchComponent />
						
						{/* User Section - Show login/logout based on auth state */}
						{isAuthenticated ? (
							<div className="flex items-center gap-2">
								{/* User Info */}
								<div className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700/60 rounded-lg text-gray-600 dark:text-gray-300">
									<User className="h-4 w-4" />
									<span className="hidden lg:block">
										{user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User'}
									</span>
								</div>
								
								{/* Logout Button */}
								<Button
									variant="outline"
									size="sm"
									onClick={handleLogout}
									disabled={loading}
									className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 border-gray-300 dark:border-gray-700/60"
									title="Logout"
								>
									<LogOut className="h-4 w-4" />
									<span className="hidden lg:block">Logout</span>
								</Button>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<Link to="/login">
									<Button variant="outline" size="sm" className="text-sm">
										Sign In
									</Button>
								</Link>
								<Link to="/sign">
									<Button size="sm" className="text-sm">
										Sign Up
									</Button>
								</Link>
							</div>
						)}
						
						{/* Mode Toggle */}
						<ModeToggle />
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
							<MobileSearchComponent onClose={closeMenu} />
						</div>

						{/* Mobile User Section */}
						<div className="pt-4 border-t border-gray-200 dark:border-gray-700/50 mt-4">
							{isAuthenticated ? (
								<div className="space-y-2">
									{/* User Info */}
									<div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
										<User className="h-4 w-4" />
										<span>
											{user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User'}
										</span>
									</div>
									
									{/* Logout Button */}
									<Button
										variant="outline"
										size="sm"
										onClick={handleLogout}
										disabled={loading}
										className="w-full flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 border-gray-300 dark:border-gray-700/60"
									>
										<LogOut className="h-4 w-4" />
										<span>Logout</span>
									</Button>
								</div>
							) : (
								<div className="space-y-2">
									<Link to="/login" onClick={closeMenu} className="block">
										<Button variant="outline" size="sm" className="w-full">
											Sign In
										</Button>
									</Link>
									<Link to="/sign" onClick={closeMenu} className="block">
										<Button size="sm" className="w-full">
											Sign Up
										</Button>
									</Link>
								</div>
							)}
						</div>
					</nav>
				</div>
			)}
		</div>
	);
}
