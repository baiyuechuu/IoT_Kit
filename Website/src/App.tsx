import { ThemeProvider } from "@/components/ThemeProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { Suspense } from "react";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Suspense fallback={<div className="p-4">Đang tải...</div>}>
				<RouterProvider router={router} />
			</Suspense>
		</ThemeProvider>
	);
}

export default App;
