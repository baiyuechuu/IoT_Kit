import { RiRadioButtonLine, RiFileTextLine } from "react-icons/ri";
import { lazy } from "react";

const ExampleDocs = lazy(() => import("../docs/example.mdx"));

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
