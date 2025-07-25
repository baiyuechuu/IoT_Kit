import React from "react";
import * as runtime from "react/jsx-runtime";
import { highlight } from "sugar-high";

interface MDXProps {
	code: string;
	components?: Record<string, React.ComponentType>;
	[key: string]: any;
}

interface TableData {
	headers: string[];
	rows: string[][];
}

function Table({ data }: { data: TableData }) {
	let headers = data.headers.map((header: string, index: number) => (
		<th key={index}>{header}</th>
	));
	let rows = data.rows.map((row: string[], index: number) => (
		<tr key={index}>
			{row.map((cell: string, cellIndex: number) => (
				<td key={cellIndex}>{cell}</td>
			))}
		</tr>
	));

	return (
		<table>
			<thead>
				<tr>{headers}</tr>
			</thead>
			<tbody>{rows}</tbody>
		</table>
	);
}

function Callout(props: any) {
	return (
		<div className="mb-8 flex items-center rounded border border-neutral-200 bg-neutral-50 p-1 px-4 py-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
			<div className="mr-4 flex w-4 items-center">{props.emoji}</div>
			<div className="callout w-full">{props.children}</div>
		</div>
	);
}

function Code({ children, ...props }: { children: string; [key: string]: any }) {
	let codeHTML = highlight(children);
	return (
		<code
			className="mb-8"
			dangerouslySetInnerHTML={{ __html: codeHTML }}
			{...props}
		/>
	);
}

function slugify(str: string): string {
	return str
		.toString()
		.toLowerCase()
		.trim() // Remove whitespace from both ends of a string
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/&/g, "-and-") // Replace & with 'and'
		.replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
		.replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: number) {
	// eslint-disable-next-line react/display-name
	return ({ children }: { children: React.ReactNode }) => {
		let slug = slugify(children as string);
		return React.createElement(
			`h${level}`,
			{
				id: slug,
				className: "text-2xl text-text-primary font-semibold leading-8 mb-6",
			},
			[
				React.createElement("a", {
					href: `#${slug}`,
					key: `link-${slug}`,
					className: "anchor ",
				}),
			],
			children,
		);
	};
}

function paragraph({ children }: { children: React.ReactNode }) {
	return (
		<p className="mb-8 text-base leading-7 text-text-secondary">{children}</p>
	);
}

function OrderedList({ children }: { children: React.ReactNode }) {
	return <ol className="mb-8 list-inside list-decimal">{children}</ol>;
}

const sharedComponents = {
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	ol: OrderedList,
	ul: OrderedList,
	Callout,
	code: Code,
	Table,
	p: paragraph,
};

const useMDXComponent = (code: string) => {
	const fn = new Function(code);
	return fn({ ...runtime }).default;
};

export const MDXContent = ({ code, components, ...props }: MDXProps) => {
	const Component = useMDXComponent(code);
	return (
		<Component components={{ ...sharedComponents, ...components }} {...props} />
	);
};
