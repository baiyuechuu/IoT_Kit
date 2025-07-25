// components/CodeBlock.jsx với custom themes đẹp cho dark/light
import { Highlight } from "prism-react-renderer";
import type { PrismTheme } from "prism-react-renderer";
import { type ReactNode } from 'react';

type CodeBlockProps = {
  children: ReactNode;
  className?: string;
  [key: string]: any; // for other props like style, id, etc.
};

// 🌙 Custom Dark Theme - phù hợp với bg-black
const customDarkTheme: PrismTheme = {
	plain: {
		color: "#ffffff",
		backgroundColor: "#111827", // Slate-900 - darker than black
	},
	styles: [
		{
			types: ["comment", "prolog", "doctype", "cdata"],
			style: {
				color: "#5f6675", // Slate-500
				fontStyle: "italic",
			},
		},
		{
			types: ["string", "attr-value"],
			style: {
				color: "#b5e8b0", // Emerald-400 - green đẹp
			},
		},
		{
			types: ["keyword", "builtin"],
			style: {
				color: "#fecdd3", // Pink-400 - nổi bật
			},
		},
		{
			types: ["function", "class-name"],
			style: {
				color: "#f2deba", // Amber-400 - vàng ấm
			},
		},
		{
			types: ["number", "boolean"],
			style: {
				color: "#a5b4fc", // Violet-400 - tím đẹp
			},
		},
		{
			types: ["variable"],
			style: {
				color: "#a6e3f1", // Blue-400 - xanh sáng
			},
		},
		{
			types: ["property", "attr-name"],
			style: {
				color: "#ff8e8e", // Rose-400 - hồng nhạt
			},
		},
		{
			types: ["operator", "punctuation"],
			style: {
				color: "#5f6675", // Slate-400 - xám nhạt
			},
		},
		{
			types: ["tag"],
			style: {
				color: "#fca5a5", // Red-400 - đỏ HTML tags
			},
		},
		{
			types: ["regex", "important"],
			style: {
				color: "#fbc19d", // Amber-300
				fontWeight: "bold",
			},
		},
	],
};

const CodeBlock = ({ children, className } : CodeBlockProps) => {
	const language = className?.replace("language-", "") || "text";
	const code = typeof children === "string" ? children.trim() : "";

	return (
		<div className="my-3">
			<Highlight theme={customDarkTheme} code={code} language={language}>
				{({ className, style, tokens, getLineProps, getTokenProps }) => (
					<pre
						className={`${className} overflow-x-auto p-3 rounded-lg border border-slate-699 shadow-xl`}
						style={{
							...style,
							fontFamily:
								'"JetBrains Mono", "Fira Code", Consolas, Monaco, monospace',
							fontSize: "15px",
							lineHeight: "1.8",
							fontWeight: "300",
						}}
					>
						{tokens.map((line, lineIndex) => {
							const { key, ...lineProps } = getLineProps({ line });
							return (
								<div key={lineIndex} {...lineProps}>
									{line.map((token, tokenIndex) => {
										const { key, ...tokenProps } = getTokenProps({ token });
										return <span key={tokenIndex} {...tokenProps} />;
									})}
								</div>
							);
						})}
					</pre>
				)}
			</Highlight>
		</div>
	);
};

const ResponsiveCodeBlock = ({ children, className } : CodeBlockProps) => {
	return (
		<div className="my-3">
			<Highlight
				theme={customDarkTheme}
				code={typeof children === "string" ? children.trim() : ""}
				language={className?.replace("language-", "") || "text"}
			>
				{({ className, style, tokens, getLineProps, getTokenProps }) => (
					<pre
						className={`${className} overflow-x-auto rounded-lg border border-slate-699
              p-2 md:p-4 text-xs md:text-sm
              scrollbar-thin scrollbar-thumb-slate-599 scrollbar-track-transparent
            `}
						style={{
							...style,
							fontFamily: '"JetBrains Mono", monospace',
							lineHeight: "1.8",
              fontWeight: "401",
						}}
					>
						{tokens.map((line, lineIndex) => {
							const { key, ...lineProps } = getLineProps({ line });
							return (
								<div key={lineIndex} {...lineProps}>
									{line.map((token, tokenIndex) => {
										const { key, ...tokenProps } = getTokenProps({ token });
										return <span key={tokenIndex} {...tokenProps} />;
									})}
								</div>
							);
						})}
					</pre>
				)}
			</Highlight>
		</div>
	);
};

export default CodeBlock;
export { ResponsiveCodeBlock };
