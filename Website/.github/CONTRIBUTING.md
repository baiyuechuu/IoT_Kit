# 🤝 Contributing to Component Library

Thank you for your interest in contributing! This guide will help you get started with adding components and documentation.

## 🚀 Quick Start

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
   cd REPO_NAME
   bun install
   ```

2. **Start Development**
   ```bash
   bun run dev
   ```

3. **Make Changes**
   - Add components in `src/components/ui/`
   - Write documentation in `src/pages/uikit/docs/`
   - Register components in `src/pages/uikit/components/index.tsx`

## 📝 Adding Components

### 1. Create Component File

```tsx
// src/components/ui/my-component.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface MyComponentProps {
    variant?: "primary" | "secondary";
    children: React.ReactNode;
    className?: string;
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
    ({ variant = "primary", className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "base-styles",
                    {
                        "primary-styles": variant === "primary",
                        "secondary-styles": variant === "secondary",
                    },
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

MyComponent.displayName = "MyComponent";
export { MyComponent };
```

### 2. Write Documentation

```mdx
<!-- src/pages/uikit/docs/my-component.mdx -->
# My Component

Description of what your component does.

<CodePreview
  title="Basic Usage"
  code={`import { MyComponent } from "@/components/ui/my-component";

export function Example() {
    return <MyComponent>Hello World</MyComponent>;
}`}
>
  <MyComponent>Hello World</MyComponent>
</CodePreview>
```

### 3. Register Component

```tsx
// src/pages/uikit/components/index.tsx
const MyComponentDocs = lazy(() => import("../docs/my-component.mdx"));

const MyComponentDocumentation = () => (
    <MDXRenderer>
        <MyComponentDocs />
    </MDXRenderer>
);

export const componentSections: ComponentSection[] = [
    // ... existing components
    {
        id: "my-component",
        title: "My Component",
        description: "Brief description",
        icon: <MyIcon className="w-5 h-5" />,
        documentation: MyComponentDocumentation,
    },
];
```

### 4. Export in MDX

```tsx
// src/components/mdx/MDXComponents.tsx
import { MyComponent } from "@/components/ui/my-component";

export const mdxComponents = {
    // ... existing components
    MyComponent,
};
```

## 📋 Pull Request Checklist

- [ ] Component follows existing patterns
- [ ] TypeScript types are complete
- [ ] Documentation includes examples
- [ ] Component is responsive
- [ ] Works in dark/light mode
- [ ] No console errors/warnings
- [ ] Code is properly formatted

## 🎯 Commit Guidelines

Use conventional commits:

- `feat: add new Button component`
- `docs: improve Button documentation`
- `fix: resolve hover state issue`
- `refactor: improve component structure`

## 🆘 Getting Help

- Check existing components for patterns
- Look at MDX files for documentation examples
- Open an issue if you're stuck
- Ask questions in discussions

## 🎉 Recognition

All contributors will be recognized in our contributors list. Thank you for helping make this library better! 