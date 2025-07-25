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
};
