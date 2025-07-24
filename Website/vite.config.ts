import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		sourcemap: false,
		// Ensure proper handling of dynamic imports
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					router: ['react-router-dom'],
					ui: ['@radix-ui/react-dropdown-menu', '@radix-ui/react-label', '@radix-ui/react-slot'],
				},
			},
		},
	},
	// Configure dev server for SPA routing during development
	server: {
		historyApiFallback: true,
	},
	// Configure preview server for SPA routing
	preview: {
		port: 4173,
		host: true,
		cors: true,
	},
});
