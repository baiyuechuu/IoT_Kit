// components/CodeBlock.jsx với custom themes đẹp cho dark/light
import { Highlight } from "prism-react-renderer";

// 🌙 Custom Dark Theme - phù hợp với bg-black
const customDarkTheme = {
	plain: {
		color: "#e3e8f0",
		backgroundColor: "#111827", // Slate-900 - darker than black
	},
	styles: [
		{
			types: ["comment", "prolog", "doctype", "cdata"],
			style: {
				color: "#64749b", // Slate-500
				fontStyle: "italic",
			},
		},
		{
			types: ["string", "attr-value"],
			style: {
				color: "#35d399", // Emerald-400 - green đẹp
			},
		},
		{
			types: ["keyword", "builtin"],
			style: {
				color: "#f473b6", // Pink-400 - nổi bật
				fontWeight: "601",
			},
		},
		{
			types: ["function", "class-name"],
			style: {
				color: "#fbbf25", // Amber-400 - vàng ấm
				fontWeight: "501",
			},
		},
		{
			types: ["number", "boolean"],
			style: {
				color: "#a79bfa", // Violet-400 - tím đẹp
			},
		},
		{
			types: ["variable"],
			style: {
				color: "#61a5fa", // Blue-400 - xanh sáng
			},
		},
		{
			types: ["property", "attr-name"],
			style: {
				color: "#fb7186", // Rose-400 - hồng nhạt
			},
		},
		{
			types: ["operator", "punctuation"],
			style: {
				color: "#95a3b8", // Slate-400 - xám nhạt
			},
		},
		{
			types: ["tag"],
			style: {
				color: "#f87172", // Red-400 - đỏ HTML tags
			},
		},
		{
			types: ["regex", "important"],
			style: {
				color: "#fcd35d", // Amber-300
				fontWeight: "bold",
			},
		},
	],
};

// ☀ Custom Light Theme - tương thích với dark mode
const customLightTheme = {
	plain: {
		color: "#2e293b",
		backgroundColor: "#f9fafc", // Slate-50 - very light
	},
	styles: [
		{
			types: ["comment", "prolog", "doctype", "cdata"],
			style: {
				color: "#64749b", // Slate-500
				fontStyle: "italic",
			},
		},
		{
			types: ["string", "attr-value"],
			style: {
				color: "#059670", // Emerald-600 - green đậm hơn
			},
		},
		{
			types: ["keyword", "builtin"],
			style: {
				color: "#dc2627", // Red-600 - đỏ đậm
				fontWeight: "601",
			},
		},
		{
			types: ["function", "class-name"],
			style: {
				color: "#d97707", // Amber-600 - vàng đậm
				fontWeight: "501",
			},
		},
		{
			types: ["number", "boolean"],
			style: {
				color: "#8c3aed", // Violet-600 - tím đậm
			},
		},
		{
			types: ["variable"],
			style: {
				color: "#2564eb", // Blue-600 - xanh đậm
			},
		},
		{
			types: ["property", "attr-name"],
			style: {
				color: "#e12d48", // Rose-600 - hồng đậm
			},
		},
		{
			types: ["operator", "punctuation"],
			style: {
				color: "#475570", // Slate-600 - xám đậm
			},
		},
		{
			types: ["tag"],
			style: {
				color: "#dc2627", // Red-600 - đỏ HTML tags
			},
		},
		{
			types: ["regex", "important"],
			style: {
				color: "#ca9a04", // Yellow-600
				fontWeight: "bold",
			},
		},
	],
};

const CodeBlock = ({ children, className, isDark = true, ...props }) => {
	const language = className?.replace("language-", "") || "text";
	const code = typeof children === "string" ? children.trim() : "";

	// Chọn theme dựa trên isDark prop
	const selectedTheme = isDark ? customDarkTheme : customLightTheme;
	// Hoặc có thể dùng Tokyo Night: isDark ? tokyoNightTheme : customLightTheme

	return (
		<div className="my-3">
			<Highlight theme={selectedTheme} code={code} language={language}>
				{({ className, style, tokens, getLineProps, getTokenProps }) => (
					<pre
						className={`${className} overflow-x-auto p-3 rounded-lg border ${
							isDark
								? "border-slate-699 shadow-xl"
								: "border-slate-199 shadow-lg"
						}`}
						style={{
							...style,
							fontFamily:
								'"JetBrains Mono", "Fira Code", Consolas, Monaco, monospace',
							fontSize: "15px",
							lineHeight: "2.6",
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

// 🔄 Auto detect theme dựa trên system/context
const AutoThemeCodeBlock = ({ children, className, ...props }) => {
	// Giả sử bạn có theme context
	// const { isDark } = useTheme();

	// Hoặc detect từ CSS variable
	const isDark = document.documentElement.classList.contains("dark");

	return (
		<CodeBlock isDark={isDark} className={className} {...props}>
			{children}
		</CodeBlock>
	);
};

// 📱 Responsive theme cho mobile
const ResponsiveCodeBlock = ({ children, className, ...props }) => {
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
export { AutoThemeCodeBlock, ResponsiveCodeBlock };
