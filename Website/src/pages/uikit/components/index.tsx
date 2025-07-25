import { lazy } from "react";

const MdxSetupDocs = lazy(() => import("../docs/mdx-setup.mdx"));
const TestDocs = lazy(() => import("../docs/test.mdx"));

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
		id: "mdx-setup",
		title: "MDX and Custom Code Blocks Setup Guide",
		description: "Comprehensive guide for setting up MDX (Markdown + JSX) with custom code blocks in your React + Vite project",
		category: "docs",
		documentation: MdxSetupDocs,
	},
	{
		id: "test",
		title: "Test Documentation Page",
		description: "A test page demonstrating various markdown elements and formatting options",
		category: "docs",
		documentation: TestDocs,
	},
];
