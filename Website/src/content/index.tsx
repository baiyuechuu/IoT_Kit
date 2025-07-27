import { lazy } from "react";

const RTOS_Blog_1Docs = lazy(() => import("./docs/RTOS_Blog_1.mdx"));
const ExampleDocs = lazy(() => import("./docs/example.mdx"));

export interface ComponentSection {
	id: string;
	title: string;
	description: string;
	category: "components" | "docs" | "guide" | "tutorial" | "reference" | "example";
	component?: React.ReactNode;
	documentation?: React.ComponentType;
}

export const componentSections: ComponentSection[] = [
	{
		id: "freertos-set-up-environment-and-create-project-on-esp32",
		title: "[FreeRTOS] Set Up Environment and Create Project on ESP32",
		description: "Tutorial to setting up the environment and creating a FreeRTOS simulation project using PlatformIO (ESP-IDF Framework)",
		category: "tutorial",
		documentation: RTOS_Blog_1Docs,
	},
	{
		id: "render-example-for-markdown",
		title: "Render Example For Markdown",
		description: "A page demonstrating various markdown elements and formatting options for rendering",
		category: "example",
		documentation: ExampleDocs,
	},
];
