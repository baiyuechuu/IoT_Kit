import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
	oneDark,
	oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { CodePreview } from "@/pages/uikit/components/CodePreview";
import { useEffect } from "react";

// MDX components that will be available in all MDX files
export const mdxComponents = {
	// Headings
	h1: (props: any) => (
		<h1
			className="text-4xl font-bold my-6 first:mt-0 text-foreground"
			{...props}
		/>
	),
	h2: (props: any) => (
		<h2
			className="text-3xl font-semibold my-6 first:mt-0 text-foreground"
			{...props}
		/>
	),
	h3: (props: any) => (
		<h3 className="text-2xl font-medium my-6 text-foreground" {...props} />
	),
	h4: (props: any) => (
		<h4 className="text-xl font-medium my-6 text-foreground" {...props} />
	),

	// Paragraphs and text
	p: (props: any) => (
		<p
			className="leading-8 text-left text-lg text-muted-foreground"
			{...props}
		/>
	),

	// Lists
	ul: (props: any) => (
		<ul
			className="list-disc pl-8 text-left text-lg text-muted-foreground"
			{...props}
		/>
	),
	ol: (props: any) => (
		<ol
			className="list-decimal pl-8 mb-6 text-left text-lg text-muted-foreground"
			{...props}
		/>
	),
	li: (props: any) => <li className="mt-3 leading-8 text-left" {...props} />,

	// Code blocks with matching theme background
	pre: (props: any) => {
		const [copied, setCopied] = useState(false);
		const [isDark, setIsDark] = useState(false);

		// Extract code content and language from props
		const codeElement = props.children;

		// Properly extract string content - handle both string and React element cases
		const getTextContent = (element: any): string => {
			if (typeof element === "string") {
				return element;
			}
			if (typeof element === "number") {
				return String(element);
			}
			if (Array.isArray(element)) {
				return element.map(getTextContent).join("");
			}
			if (element?.props?.children) {
				return getTextContent(element.props.children);
			}
			return "";
		};

		const code = getTextContent(
			codeElement?.props?.children || codeElement || "",
		).trim();
		const className = codeElement?.props?.className || "";
		const language = className.replace(/language-/, "") || "text";

		// Reactive theme detection
		useEffect(() => {
			const checkTheme = () => {
				setIsDark(document.documentElement.classList.contains("dark"));
			};

			checkTheme();

			// Watch for theme changes
			const observer = new MutationObserver(checkTheme);
			observer.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ["class"],
			});

			return () => observer.disconnect();
		}, []);

		const copyToClipboard = async () => {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		};

		// Enhanced dark theme style - using card background
		const enhancedDarkTheme = {
			...oneDark,
			'pre[class*="language-"]': {
				...oneDark['pre[class*="language-"]'],
				background: "transparent",
				fontFamily:
					'"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
				fontSize: "15px",
				lineHeight: "1.6",
				tabSize: 4,
				padding: "24px",
				color: "hsl(var(--foreground))",
			},
			'code[class*="language-"]': {
				...oneDark['code[class*="language-"]'],
				fontFamily:
					'"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
				fontSize: "15px",
				lineHeight: "1.6",
				tabSize: 4,
				background: "transparent",
				color: "hsl(var(--foreground))",
			},
		};

		// Enhanced light theme style - using card background
		const enhancedLightTheme = {
			...oneLight,
			'pre[class*="language-"]': {
				...oneLight['pre[class*="language-"]'],
				background: "transparent",
				fontFamily:
					'"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
				fontSize: "15px",
				lineHeight: "1.6",
				tabSize: 4,
				padding: "24px",
				color: "hsl(var(--foreground))",
			},
			'code[class*="language-"]': {
				...oneLight['code[class*="language-"]'],
				fontFamily:
					'"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
				fontSize: "15px",
				lineHeight: "1.6",
				tabSize: 4,
				background: "transparent",
				color: "hsl(var(--foreground))",
			},
		};

		return (
			<div className="my-8 space-y-6">
				<div className="rounded-xl overflow-hidden border-2 shadow-lg bg-card">
					{/* Code header */}
					<div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b">
						<div className="flex items-center gap-3">
							<div className="flex gap-2">
								<div className="w-3 h-3 rounded-full bg-red-500"></div>
								<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
								<div className="w-3 h-3 rounded-full bg-green-500"></div>
							</div>
							<span className="text-sm font-medium text-muted-foreground font-mono">
								{language.toUpperCase()}
							</span>
						</div>
						<Button
							size="sm"
							variant="ghost"
							onClick={copyToClipboard}
							className="h-8 px-3"
						>
							{copied ? (
								<Check className="w-4 h-4" />
							) : (
								<Copy className="w-4 h-4" />
							)}
						</Button>
					</div>

					{/* Code content with matching background */}
					<div className="relative bg-card">
						<SyntaxHighlighter
							language={language}
							style={isDark ? enhancedDarkTheme : enhancedLightTheme}
							customStyle={{
								margin: 0,
								borderRadius: 0,
								background: "hsl(var(--card))",
							}}
							showLineNumbers={false}
							wrapLines={true}
							wrapLongLines={true}
							tabSize={4}
						>
							{code}
						</SyntaxHighlighter>
					</div>
				</div>
			</div>
		);
	},
	code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<code
			className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
			{...props}
		/>
	),

	// Links
	a: (props: any) => (
		<a
			className="text-primary hover:text-blue-500 hover:underline font-medium transition-colors"
			{...props}
		/>
	),

	// Blockquotes
	blockquote: (props: any) => (
		<blockquote
			className="border-l-4 border-primary pl-6 italic mb-6 text-left text-lg bg-muted/20 py-4 rounded-r-lg"
			{...props}
		/>
	),

	// Tables
	table: (props: any) => (
		<div className="overflow-x-auto my-6 rounded-lg">
			<table className="w-full text-left bg-card" {...props} />
		</div>
	),
	th: (props: any) => (
		<th
			className="border-b border-border px-6 py-4 bg-muted/50 font-semibold text-left text-lg"
			{...props}
		/>
	),
	td: (props: any) => (
		<td className="border-b border-border px-6 py-4 text-left" {...props} />
	),

	// Enhanced callout component
	Callout: ({ type = "info", children, ...props }: any) => (
		<div
			className={`py-3 px-5 rounded-xl border-2 text-left shadow-sm my-6 ${
				type === "warning"
					? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
					: type === "error"
						? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
						: type === "success"
							? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
							: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
			}`}
			{...props}
		>
			<div className="text-lg leading-relaxed">{children}</div>
		</div>
	),

	// Code preview component
	CodePreview: (props: any) => <CodePreview {...props} />,
};
