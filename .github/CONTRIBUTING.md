# Contributing Guide

Thank you for your interest in contributing to this project. This guide will help you get started.

## Getting Started

1. **Fork and Clone**

```bash
git clone https://github.com/baiyuechuu/IoT_Kit.git
cd IoT_Kit
bun install
```

2. **Start Development**

```bash
bun run dev
```

## Making Changes

### Adding Components

1. **Create Component File**
   - Add components in `src/components/ui/`
   - Follow existing component patterns
   - Include proper TypeScript types

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

2. **Write Documentation**
   - Create documentation in `src/pages/uikit/docs/`
   - Include usage examples

```mdx
<!-- src/pages/uikit/docs/my-component.mdx -->
# My Component

Description of the component.
```

3. **Register Component**
   - Add to `src/pages/uikit/components/index.tsx`
   - Export in `src/components/mdx/MDXComponents.tsx`

## Code Standards

- Follow existing code patterns and structure
- Use TypeScript for type safety
- Ensure components are responsive
- Test in both dark and light modes
- No console errors or warnings
- Follow the project's formatting conventions

## Commit Guidelines

Use conventional commits format:

- `feat: add new Button component`
- `docs: improve Button documentation`
- `fix: resolve hover state issue`
- `refactor: improve component structure`

## Pull Request Process

1. Create a feature branch from main
2. Make your changes following the guidelines above
3. Test your changes thoroughly
4. Submit a pull request with a clear description
5. Address any feedback from reviewers

## Getting Help

- Review existing components for patterns
- Check documentation examples in MDX files
- Open an issue if you need assistance
- Use discussions for questions

Thank you for contributing to this project! 