import { visit } from "unist-util-visit";
import type { Node } from "unist";
import type { Parent } from "unist";

interface Frontmatter {
	title?: string;
	description?: string;
	[key: string]: string | undefined;
}

export function remarkFrontmatterHeader() {
	return function transformer(tree: Node) {
		let frontmatter: Frontmatter | null = null;

		// Find YAML frontmatter in the tree (after remark-frontmatter has processed it)
		visit(tree, "yaml", (node: any) => {
			try {
				// Simple YAML parsing for our needs
				const lines = node.value.split("\n");
				frontmatter = {} as Frontmatter;

				for (const line of lines) {
					const trimmed = line.trim();
					if (trimmed && trimmed.includes(":")) {
						const [key, ...valueParts] = trimmed.split(":");
						let value = valueParts.join(":").trim();

						// Remove quotes if present
						if (
							(value.startsWith('"') && value.endsWith('"')) ||
							(value.startsWith("'") && value.endsWith("'"))
						) {
							value = value.slice(1, -1);
						}

						(frontmatter as Frontmatter)[key.trim()] = value;
					}
				}
			} catch (error) {
				console.warn("Failed to parse YAML frontmatter:", error);
			}
		});

		// Ensure frontmatter is always an object for type safety
		if (!frontmatter || typeof frontmatter !== "object") {
			frontmatter = {} as Frontmatter;
		}

		if (!frontmatter.title) {
			return;
		}

		// Remove the first heading if it matches the frontmatter title
		let removedHeading = false;
		visit(tree, "heading", (node: any, index: number | null, parent: Parent | null) => {
			if (!removedHeading && node.depth === 1 && parent && typeof index === "number") {
				const headingText = node.children
					.filter((child: any) => child.type === "text")
					.map((child: any) => child.value)
					.join("");

				if (headingText.trim() === frontmatter!.title?.trim()) {
					parent.children.splice(index, 1);
					removedHeading = true;
					return "skip";
				}
			}
		});

		// Remove the first paragraph if it matches the description
		if ((frontmatter as Frontmatter).description) {
			let removedParagraph = false;
			visit(tree, "paragraph", (node: any, index: number | null, parent: Parent | null) => {
				if (!removedParagraph && parent && typeof index === "number") {
					const paragraphText = node.children
						.filter((child: any) => child.type === "text")
						.map((child: any) => child.value)
						.join("");

					if (paragraphText.trim() === (frontmatter as Frontmatter).description?.trim()) {
						parent.children.splice(index, 1);
						removedParagraph = true;
						return "skip";
					}
				}
			});
		}

		return tree;
	};
}
