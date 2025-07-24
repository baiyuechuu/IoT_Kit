import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { RiRadioButtonLine } from "react-icons/ri";
import { BiCard } from "react-icons/bi";
import { FiEdit3 } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { FaHome, FaInfoCircle, FaUikit, FaTachometerAlt, FaEye, FaEnvelope, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import type { SearchItem, SearchComponentProps } from "@/types";

export function SearchComponent({ onClose, className = "" }: SearchComponentProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const navigate = useNavigate();
	const searchRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Define all searchable items
	const searchItems: SearchItem[] = [
		// Pages
		{
			id: "home",
			title: "Home",
			description: "Main landing page with overview",
			type: "page",
			path: "/",
			icon: <FaHome className="w-4 h-4" />,
			keywords: ["home", "main", "landing", "overview"]
		},
		{
			id: "about",
			title: "About",
			description: "Learn more about our IoT Kit project",
			type: "page",
			path: "/about",
			icon: <FaInfoCircle className="w-4 h-4" />,
			keywords: ["about", "info", "information", "project", "team"]
		},
		{
			id: "uikit",
			title: "UI Kit",
			description: "Collection of UI components and design system",
			type: "page",
			path: "/uikit",
			icon: <FaUikit className="w-4 h-4" />,
			keywords: ["ui", "components", "design", "system", "kit"]
		},
		{
			id: "dashboard",
			title: "Dashboard",
			description: "User dashboard with personalized content",
			type: "page",
			path: "/dashboard",
			icon: <FaTachometerAlt className="w-4 h-4" />,
			keywords: ["dashboard", "user", "personal", "profile"]
		},
		{
			id: "showcase",
			title: "Showcase",
			description: "Project showcase and portfolio",
			type: "page",
			path: "/showcase",
			icon: <FaEye className="w-4 h-4" />,
			keywords: ["showcase", "portfolio", "projects", "gallery"]
		},
		{
			id: "contact",
			title: "Contact",
			description: "Get in touch with us",
			type: "page",
			path: "/contact",
			icon: <FaEnvelope className="w-4 h-4" />,
			keywords: ["contact", "reach", "touch", "message", "email"]
		},
		{
			id: "login",
			title: "Sign In",
			description: "Login to your account",
			type: "page",
			path: "/login",
			icon: <FaSignInAlt className="w-4 h-4" />,
			keywords: ["login", "signin", "sign", "in", "authenticate", "auth"]
		},
		{
			id: "signup",
			title: "Sign Up",
			description: "Create a new account",
			type: "page",
			path: "/sign",
			icon: <FaUserPlus className="w-4 h-4" />,
			keywords: ["signup", "register", "create", "account", "join"]
		},
		// UI Kit Components
		{
			id: "buttons-component",
			title: "Buttons",
			description: "Various button components with different styles and variants",
			type: "component",
			path: "/uikit?section=buttons",
			icon: <RiRadioButtonLine className="w-4 h-4" />,
			keywords: ["button", "click", "action", "primary", "secondary", "destructive", "outline", "ghost", "rainbow", "shiny"]
		},
		{
			id: "cards-component",
			title: "Cards",
			description: "Card components for displaying content in containers",
			type: "component",
			path: "/uikit?section=cards",
			icon: <BiCard className="w-4 h-4" />,
			keywords: ["card", "container", "content", "box", "panel"]
		},
		{
			id: "inputs-component",
			title: "Form Inputs",
			description: "Input components for forms and user interaction",
			type: "component",
			path: "/uikit?section=inputs",
			icon: <FiEdit3 className="w-4 h-4" />,
			keywords: ["input", "form", "text", "email", "password", "number", "field"]
		},
		{
			id: "dropdowns-component",
			title: "Dropdown Menus",
			description: "Dropdown components for navigation and selection",
			type: "component",
			path: "/uikit?section=dropdowns",
			icon: <MdKeyboardArrowDown className="w-4 h-4" />,
			keywords: ["dropdown", "menu", "select", "navigation", "options"]
		},
		{
			id: "effects-component",
			title: "Magic Effects",
			description: "Special effect components with animations and styling",
			type: "component",
			path: "/uikit?section=effects",
			icon: <HiSparkles className="w-4 h-4" />,
			keywords: ["effects", "magic", "animation", "shine", "border", "rainbow", "special"]
		}
	];

	// Filter items based on search query
	const filteredItems = searchItems.filter(item => {
		if (!searchQuery.trim()) return false;
		
		const query = searchQuery.toLowerCase();
		return (
			item.title.toLowerCase().includes(query) ||
			item.description.toLowerCase().includes(query) ||
			item.keywords.some(keyword => keyword.toLowerCase().includes(query))
		);
	});

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) {
				// Open search with Ctrl+K or Cmd+K
				if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
					e.preventDefault();
					setIsOpen(true);
					setTimeout(() => inputRef.current?.focus(), 100);
				}
				return;
			}

			switch (e.key) {
				case 'Escape':
					e.preventDefault();
					handleClose();
					break;
				case 'ArrowDown':
					e.preventDefault();
					setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
					break;
				case 'ArrowUp':
					e.preventDefault();
					setSelectedIndex(prev => Math.max(prev - 1, 0));
					break;
				case 'Enter':
					e.preventDefault();
					if (filteredItems[selectedIndex]) {
						handleSelect(filteredItems[selectedIndex]);
					}
					break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, filteredItems, selectedIndex]);

	// Handle clicks outside to close
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				handleClose();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen]);

	// Reset selected index when search changes
	useEffect(() => {
		setSelectedIndex(0);
	}, [searchQuery]);

	const handleOpen = () => {
		setIsOpen(true);
		setTimeout(() => inputRef.current?.focus(), 100);
	};

	const handleClose = () => {
		setIsOpen(false);
		setSearchQuery("");
		setSelectedIndex(0);
		onClose?.();
	};

	const handleSelect = (item: SearchItem) => {
		if (item.path.includes('?section=')) {
			// For UI Kit components, navigate and scroll to section
			const [path, section] = item.path.split('?section=');
			navigate(path);
			setTimeout(() => {
				// You can add logic here to programmatically set the active section
				// This would require passing the section parameter to the UIKit component
				window.dispatchEvent(new CustomEvent('uikit-section-change', { detail: section }));
			}, 100);
		} else {
			navigate(item.path);
		}
		handleClose();
	};

	const getTypeColor = (type: string) => {
		return type === 'page' 
			? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
			: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
	};

	return (
		<div className={`relative ${className}`}>
			{/* Search Trigger */}
			<button
				onClick={handleOpen}
				className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-700/30 border border-gray-300 dark:border-gray-700/60 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300"
				title="Search pages and components (Ctrl+K)"
			>
				<IoSearchOutline className="h-4 w-4" />
				<span className="hidden lg:block">Search</span>
				<div className="hidden lg:flex items-center gap-0.5 text-xs opacity-60">
					<span>⌘</span>
					<span>K</span>
				</div>
			</button>

			{/* Search Modal */}
			{isOpen && (
				<div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[10vh]">
					<div
						ref={searchRef}
						className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700"
					>
						{/* Search Input */}
						<div className="p-4 border-b border-gray-200 dark:border-gray-700">
							<div className="flex items-center gap-3">
								<IoSearchOutline className="h-5 w-5 text-gray-400" />
								<input
									ref={inputRef}
									type="text"
									placeholder="Search pages and components..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
								/>
								<div className="text-xs text-gray-400">ESC to close</div>
							</div>
						</div>

						{/* Search Results */}
						<div className="max-h-96 overflow-y-auto">
							{filteredItems.length === 0 ? (
								<div className="p-8 text-center text-gray-500 dark:text-gray-400">
									{searchQuery.trim() ? 'No results found' : 'Start typing to search...'}
								</div>
							) : (
								<div className="p-2">
									{filteredItems.map((item, index) => (
										<button
											key={item.id}
											onClick={() => handleSelect(item)}
											className={`w-full p-3 rounded-lg text-left transition-colors ${
												index === selectedIndex
													? 'bg-gray-100 dark:bg-gray-800'
													: 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
											}`}
										>
											<div className="flex items-center gap-3">
												<div className="text-gray-600 dark:text-gray-400">
													{item.icon}
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<span className="font-medium text-gray-900 dark:text-gray-100">
															{item.title}
														</span>
														<span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
															{item.type}
														</span>
													</div>
													<p className="text-sm text-gray-600 dark:text-gray-400 truncate">
														{item.description}
													</p>
												</div>
											</div>
										</button>
									))}
								</div>
							)}
						</div>

						{/* Footer */}
						<div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-1">
									<kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">↑↓</kbd>
									<span>navigate</span>
								</div>
								<div className="flex items-center gap-1">
									<kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">↵</kbd>
									<span>select</span>
								</div>
								<div className="flex items-center gap-1">
									<kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">esc</kbd>
									<span>close</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// Mobile Search Component
export function MobileSearchComponent({ onClose }: { onClose?: () => void }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => {
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
		onClose?.();
	};

	return (
		<>
			<button
				onClick={handleOpen}
				className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-200/30 dark:hover:bg-gray-700/30 border border-gray-300 dark:border-gray-700/30 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300"
				title="Search"
			>
				<IoSearchOutline className="h-4 w-4" />
				<span>Search</span>
			</button>

			{isOpen && (
				<div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
					<div className="p-4">
						<SearchComponent onClose={handleClose} className="w-full" />
					</div>
				</div>
			)}
		</>
	);
} 