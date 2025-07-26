import { lazy } from "react";

const MyblogDocs = lazy(() => import("./docs/myblog.mdx"));
const TestDocs = lazy(() => import("./docs/test.mdx"));

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
		id: "test-blog",
		title: "test blog",
		description: "A test page demonstrating various markdown elements and formatting options",
		category: "components",
		documentation: MyblogDocs,
	},
	{
		id: "test-documentation-page",
		title: "Test Documentation Page",
		description: "A test page demonstrating various markdown elements and formatting options",
		category: "components",
		documentation: TestDocs,
	},
];
