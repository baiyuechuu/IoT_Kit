import { ThemeProvider } from "@/components/ThemeProvider";
import { MDXProvider } from "@mdx-js/react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { Suspense } from "react";
import { mdxComponents } from "@/components/mdx/mdx";

function App() {
    return (
        <MDXProvider components={mdxComponents}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Suspense fallback={<div className="p-4">Đang tải...</div>}>
                    <RouterProvider router={router} />
                </Suspense>
            </ThemeProvider>
        </MDXProvider>
    );
}

export default App;
