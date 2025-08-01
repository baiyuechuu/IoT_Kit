import { ThemeProvider } from "@/components/ThemeProvider";
import { MDXProvider } from "@mdx-js/react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { Suspense } from "react";
import { mdxComponents } from "@/components/mdx/mdx";
import { ConfirmationProvider } from "@/hooks/useConfirmation";
import { FirebaseProvider } from "@/contexts/FirebaseContext";

function App() {
	return (
		<MDXProvider components={mdxComponents}>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<ConfirmationProvider>
					<FirebaseProvider>
						<Suspense fallback={<div className="p-4">Loading...</div>}>
							<RouterProvider router={router} />
						</Suspense>
					</FirebaseProvider>
				</ConfirmationProvider>
			</ThemeProvider>
		</MDXProvider>
	);	
}

export default App;
