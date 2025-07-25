import { lazy } from "react";

const MDXSetupDocs = lazy(() => import("../docs/mdx-setup.mdx"));
const TestDocs = lazy(() => import("../docs/test.mdx"));

export interface ComponentSection {
	id: string;
	title: string;
	description: string;
	component?: React.ReactNode;
	documentation?: React.ComponentType;
}

export const componentSections: ComponentSection[] = [
	{
		id: "mdx-setup",
		title: "MDX Setup Guide",
		description:
			"Complete guide for setting up MDX with custom code blocks and syntax highlighting",
		documentation: MDXSetupDocs,
	},
	{
		id: "test",
		title: "Test",
		description: "Test",
		documentation: TestDocs,
	},
	{
		id: "buttons",
		title: "Simple Button",
		description:
			"A versatile button component built with React and Tailwind CSS",
		documentation: undefined,
	},
];
