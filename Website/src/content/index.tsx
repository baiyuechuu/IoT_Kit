import { lazy } from "react";

const TestDocs = lazy(() => import("./docs/test.mdx"));
const Test_genDocs = lazy(() => import("./docs/test_gen.mdx"));

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
		id: "test",
		title: "Test Documentation Page",
		description: "A test page demonstrating various markdown elements and formatting options",
		category: "components",
		documentation: TestDocs,
	},
	{
		id: "test_gen",
		title: "Test Documentation Page",
		description: "A test page demonstrating various markdown elements and formatting options",
		category: "components",
		documentation: Test_genDocs,
	},
];
