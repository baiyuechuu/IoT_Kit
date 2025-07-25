export interface SearchItem {
	id: string;
	title: string;
	description: string;
	type: "page" | "component" | "documentation";
	path: string;
	icon: React.ReactNode;
	keywords: string[];
}

export interface SearchComponentProps {
	onClose?: () => void;
	className?: string;
}

export interface ComponentSection {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
	component: React.ReactNode;
} 
