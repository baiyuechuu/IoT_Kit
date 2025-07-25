import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";

import type { SearchItem, SearchComponentProps } from "@/types";
import searchItems from "@/data/searchItems";

export function SearchComponent({
	onClose,
	className = "",
	isMobile = false,
}: SearchComponentProps & { isMobile?: boolean }) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const navigate = useNavigate();
	const searchRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Add refs for each result item
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

	// Filter search results
	const filteredItems = searchQuery.trim()
		? searchItems.filter((item) => {
				const query = searchQuery.toLowerCase();
				return (
					item.title.toLowerCase().includes(query) ||
					item.description.toLowerCase().includes(query) ||
					item.keywords.some((keyword) => keyword.toLowerCase().includes(query))
				);
			})
		: searchItems;

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) {
				if ((e.ctrlKey || e.metaKey) && e.key === "k") {
					e.preventDefault();
					handleOpen();
				}
				return;
			}

			// Only prevent default for navigation keys, not typing keys
			switch (e.key) {
				case "Escape":
					e.preventDefault();
					handleClose();
					break;
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
					break;
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex((prev) => Math.max(prev - 1, 0));
					break;
				case "Enter":
					e.preventDefault();
					if (filteredItems[selectedIndex]) {
						handleSelect(filteredItems[selectedIndex]);
					}
					break;
				// Don't prevent default for other keys (typing keys)
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, filteredItems, selectedIndex]);

	// Click outside to close
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				handleClose();
			}
		};

		if (isOpen) {
			// Add delay to prevent immediate closing when opening
			const timeoutId = setTimeout(() => {
				document.addEventListener("mousedown", handleClickOutside);
			}, 100);
			
			return () => {
				clearTimeout(timeoutId);
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}
	}, [isOpen]);

	// Reset selection when search changes
	useEffect(() => {
		setSelectedIndex(0);
	}, [searchQuery]);

	// Scroll selected item into view when selectedIndex changes
	useEffect(() => {
		if (isOpen && itemRefs.current[selectedIndex]) {
			itemRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
		}
	}, [selectedIndex, isOpen, filteredItems]);

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
		if (item.path.includes("?section=")) {
			const [path, section] = item.path.split("?section=");
			navigate(path);
			setTimeout(() => {
				window.dispatchEvent(new CustomEvent("uikit-section-change", { detail: section }));
			}, 100);
		} else {
			navigate(item.path);
		}
		handleClose();
	};

	const getTypeColor = (type: string) =>
		type === "page"
			? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
			: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300";

	return (
		<div className={`relative ${className}`}>
			{/* Search Trigger */}
			<button
				onClick={handleOpen}
				className={`flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-700/30 border border-gray-300 dark:border-gray-700/60 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 ${
					isMobile ? "w-full py-2" : ""
				}`}
				title={isMobile ? "Search" : "Search pages and components (Ctrl+K)"}
			>
				<IoSearchOutline className="h-4 w-4" />
				<span className={isMobile ? "" : "hidden lg:block"}>Search</span>
				{!isMobile && (
					<div className="hidden lg:flex items-center gap-0.5 text-xs opacity-60">
						<span>⌘</span>
						<span>K</span>
					</div>
				)}
			</button>

			{/* Search Modal */}
			{isOpen && (
				<div className="fixed inset-0 z-50 bg-white/40 dark:bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4">
					<div
						ref={searchRef}
						className="w-full max-w-2xl mx-4 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700/40"
					>
						{/* Search Input */}
						<div className="p-4 border-b border-gray-200 dark:border-gray-700/40 mb-1">
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
							</div>
						</div>

						{/* Search Results */}
						<div className="max-h-96 overflow-y-auto p-2 no-scrollbar">
							{filteredItems.map((item, index) => (
								<button
									key={item.id}
									onClick={() => handleSelect(item)}
									ref={el => { itemRefs.current[index] = el; }}
									className={`w-full p-3 rounded-lg text-left transition-colors mb-1 ${
										index === selectedIndex
											? "bg-gray-50/30 dark:bg-gray-800/30 border border-gray-300 dark:border-gray-700/60"
											: "hover:bg-gray-50/80 dark:hover:bg-gray-800/50"
									}`}
								>
									<div className="flex items-center gap-4">
										<div className="text-gray-600 dark:text-gray-400">{item.icon}</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<span className="font-medium text-gray-900 dark:text-gray-100">
													{item.title}
												</span>
												<span
													className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}
												>
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

						{/* Footer */}
						<div className="p-3 mt-1 border-t border-gray-200 dark:border-gray-700/40 text-xs text-gray-500 dark:text-gray-400">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-1">
									<kbd className="px-1.5 py-0.5 rounded text-xs">
										↑↓
									</kbd>
									<span>navigate</span>
								</div>
								<div className="flex items-center gap-1">
									<kbd className="px-1.5 py-0.5 rounded text-xs">
										↵
									</kbd>
									<span>select</span>
								</div>
								<div className="flex items-center gap-1">
									<kbd className="px-1.5 py-0.5 rounded text-xs">
										esc
									</kbd>
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

// Mobile Search Component (simplified wrapper)
export function MobileSearchComponent({ onClose }: { onClose?: () => void }) {
	return <SearchComponent onClose={onClose} isMobile={true} />;
}
