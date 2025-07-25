import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import { remarkFrontmatterHeader } from "./src/lib/remark-frontmatter-header.js";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		mdx({
			remarkPlugins: [
				remarkGfm,
				[remarkFrontmatter, ['yaml', 'toml']], // Hide frontmatter from rendering
				remarkFrontmatterHeader, // Remove duplicate content
			],
			// rehypePlugins: [
			// 	rehypeHighlight,
			//      rehypePrism,
			// ],
			providerImportSource: "@mdx-js/react",
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
