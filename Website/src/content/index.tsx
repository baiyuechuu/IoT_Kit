import { lazy } from "react";

const ExampleDocs = lazy(() => import("./docs/example.mdx"));

export interface ComponentSection {
	id: string;
	title: string;
	description: string;
	category: "components" | "docs";
	component?: React.ReactNode;
	documentation?: React.ComponentType;
}

export const componentSections: ComponentSection[] = [
	{
		id: "render-example-for-markdown",
		title: "Render Example For Markdown",
		description: "A page demonstrating various markdown elements and formatting options for rendering",
		category: "components",
		documentation: ExampleDocs,
	},
];
