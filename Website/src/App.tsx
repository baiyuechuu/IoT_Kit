import { ThemeProvider } from "@/components/ThemeProvider";
import { MDXProvider } from "@mdx-js/react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { Suspense } from "react";
import { mdxComponents } from "@/components/mdx/mdx";
import { ConfirmationProvider } from "@/hooks/useConfirmation";

function App() {
	return (
		<MDXProvider components={mdxComponents}>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<ConfirmationProvider>
					<Suspense fallback={<div className="p-4">Đang tải...</div>}>
						<RouterProvider router={router} />
					</Suspense>
				</ConfirmationProvider>
			</ThemeProvider>
		</MDXProvider>
	);
}

export default App;
