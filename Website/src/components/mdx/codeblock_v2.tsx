// components/CodeBlock.jsx với Shiki
import { codeToHtml } from "shiki";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type CodeBlockProps = {
	children: ReactNode;
	className?: string;
	[key: string]: any;
};

const CodeBlock = ({ children, className }: CodeBlockProps) => {
	const [highlightedCode, setHighlightedCode] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);

	const language = className?.replace("language-", "") || "text";
	const code = typeof children === "string" ? children.trim() : "";

	useEffect(() => {
		const highlightCode = async () => {
			try {
				setIsLoading(true);
				const html = await codeToHtml(code, {
					lang: language,
					// theme: "github-dark", // hoặc 'vs-dark', 'material-theme-darker'
					theme: "vitesse-black",
					transformers: [
						{
							pre(node) {
								// Custom styling cho pre element
								node.properties.style = `
                  font-family: "JetBrains Mono", "Fira Code", Consolas, Monaco, monospace;
                  font-size: 15px;
                  line-height: 1.8;
                  font-weight: 300;
                  padding: 12px;
                  border-radius: 8px;
                  border: 1px solid #374151;
                  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                  overflow-x: auto;
                `;
							},
						},
					],
				});
				setHighlightedCode(html);
			} catch (error) {
				console.error("Shiki highlighting error:", error);
				// Fallback to plain text
				setHighlightedCode(`<pre style="
          font-family: 'JetBrains Mono', monospace;
          background: #111827;
          color: #ffffff;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #374151;
          overflow-x: auto;
        "><code>${code}</code></pre>`);
			} finally {
				setIsLoading(false);
			}
		};

		if (code) {
			highlightCode();
		}
	}, [code, language]);

	if (isLoading) {
		return (
			<div className="my-3">
				<div className="bg-slate-800 border border-slate-600 rounded-lg p-3 animate-pulse">
					<div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
					<div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
					<div className="h-4 bg-slate-700 rounded w-2/3"></div>
				</div>
			</div>
		);
	}

	return (
		<div
			className="my-3"
			dangerouslySetInnerHTML={{ __html: highlightedCode }}
		/>
	);
};

const ResponsiveCodeBlock = ({ children, className }: CodeBlockProps) => {
	const [highlightedCode, setHighlightedCode] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);

	const language = className?.replace("language-", "") || "text";
	const code = typeof children === "string" ? children.trim() : "";

	useEffect(() => {
		const highlightCode = async () => {
			try {
				setIsLoading(true);
				const html = await codeToHtml(code, {
					lang: language,
					// theme: "github-dark",
					theme: "vitesse-black",
					transformers: [
						{
							pre(node) {
								// Responsive styling
								node.properties.style = `
                  font-family: "JetBrains Mono", monospace;
                  line-height: 1.8;
                  font-weight: 400;
                  border-radius: 8px;
                  border: 1px solid #374151;
                  overflow-x: auto;
                  padding: 8px;
                  background: transparent !important;
                  font-size: 12px;
                `;

								// Add responsive classes
								node.properties.class = `
                  scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent
                  md:text-sm md:p-4
                `.trim();
							},
						},
					],
				});
				setHighlightedCode(html);
			} catch (error) {
				console.error("Shiki highlighting error:", error);
				setHighlightedCode(`<pre style="
          font-family: 'JetBrains Mono', monospace;
          background: #111827;
          color: #ffffff;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #374151;
          overflow-x: auto;
          font-size: 12px;
        "><code>${code}</code></pre>`);
			} finally {
				setIsLoading(false);
			}
		};

		if (code) {
			highlightCode();
		}
	}, [code, language]);

	if (isLoading) {
		return (
			<div className="my-3">
				<div className="bg-slate-800 border border-slate-600 rounded-lg p-2 md:p-4 animate-pulse">
					<div className="h-3 md:h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
					<div className="h-3 md:h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
					<div className="h-3 md:h-4 bg-slate-700 rounded w-2/3"></div>
				</div>
			</div>
		);
	}

	return (
		<div
			className="my-3"
			dangerouslySetInnerHTML={{ __html: highlightedCode }}
		/>
	);
};

export default CodeBlock;
export { ResponsiveCodeBlock };
