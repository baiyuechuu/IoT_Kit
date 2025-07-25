import { RiRadioButtonLine, RiFileTextLine, RiCodeSSlashLine } from "react-icons/ri";
import { lazy } from "react";

const ExampleDocs = lazy(() => import("../docs/example.mdx"));
const MDXSetupDocs = lazy(() => import("../docs/mdx-setup.mdx"));

export interface ComponentSection {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    component?: React.ReactNode;
    documentation?: React.ComponentType;
}

export const componentSections: ComponentSection[] = [
    {
        id: "mdx-setup",
        title: "MDX Setup Guide",
        description: "Complete guide for setting up MDX with custom code blocks and syntax highlighting",
        icon: <RiCodeSSlashLine className="w-5 h-5" />,
        documentation: MDXSetupDocs,
    },
    {
        id: "example",
        title: "Example Article",
        description: "Example MDX article showing dynamic GitHub profile creation",
        icon: <RiFileTextLine className="w-5 h-5" />,
        documentation: ExampleDocs,
    },
    {
        id: "buttons",
        title: "Simple Button",
        description: "A versatile button component built with React and Tailwind CSS",
        icon: <RiRadioButtonLine className="w-5 h-5" />,
        documentation: undefined, // Will be added when the MDX file is created
    },
];
