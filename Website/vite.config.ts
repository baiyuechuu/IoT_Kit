import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mdx from "@mdx-js/rollup";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		mdx({
			// remarkPlugins: [remarkGfm],
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
