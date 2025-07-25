export interface ComponentSection {
	id: string;
	title: string;
	description: string;
	category: "components" | "docs";
	component?: React.ReactNode;
	documentation?: React.ComponentType;
}

export const componentSections: ComponentSection[] = [];
