import { lazy } from "react";

const Dev_hwDocs = lazy(() => import("../docs/dev_hw.mdx"));
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
		id: "dev_hw",
		title: "Dev Hardware Documentation Page",
		description: "A test page demonstrating various markdown elements and formatting options",
		category: "components",
		documentation: Dev_hwDocs,
	},
	{
		id: "test",
		title: "Test Documentation Page",
		description: "A test page demonstrating various markdown elements and formatting options",
		category: "components",
		documentation: TestDocs,
	},
];
