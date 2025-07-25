import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		mdx({
			remarkPlugins: [remarkGfm],
			rehypePlugins: [
				rehypeHighlight,
				rehypeSlug,
				[rehypeAutolinkHeadings, { behavior: "wrap" }]
			],
			providerImportSource: "@mdx-js/react",
		})
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
