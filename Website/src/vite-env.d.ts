/// <reference types="vite/client" />

declare module "*.mdx" {
	let MDXComponent: (props: any) => JSX.Element;
	export default MDXComponent;
}

declare module "@mdx-js/react" {
	export interface MDXProviderProps {
		children: React.ReactNode;
		components?: Record<string, React.ComponentType<any>>;
	}
	export const MDXProvider: React.ComponentType<MDXProviderProps>;
}
