# 🎨 Component Library & Documentation System

A beautiful, modern component library with MDX-powered documentation system. Built with React, TypeScript, Tailwind CSS, and Vite.

## ✨ Features

- 🎯 **MDX Documentation** - Write rich documentation with live code examples
- 🎨 **Beautiful UI** - Professional design with syntax highlighting
- 🌙 **Dark/Light Mode** - Automatic theme switching
- 📱 **Responsive** - Works perfectly on all devices
- ⚡ **Fast** - Built with Vite for lightning-fast development
- 🔥 **Hot Reload** - Instant updates during development
- 📝 **TypeScript** - Full type safety
- 🎭 **Code Preview** - Interactive component previews with copy-to-clipboard

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

## 📚 Writing Documentation

### 1. Create MDX Files

Create your documentation in `src/pages/uikit/docs/`:

   ```bash
src/pages/uikit/docs/
├── your-component.mdx
├── another-component.mdx
└── ...
```

### 2. MDX Documentation Structure

```mdx
# Your Component Name

Brief description of what your component does.

## Basic Example

<CodePreview
  title="Basic Usage"
  code={`import { YourComponent } from "@/components/ui/your-component";

export function Example() {
    return (
        <YourComponent>
            Hello World
        </YourComponent>
    );
}`}
>
  <YourComponent>Hello World</YourComponent>
</CodePreview>

## Advanced Usage

<CodePreview
  title="With Props"
  code={`import { YourComponent } from "@/components/ui/your-component";

export function AdvancedExample() {
    return (
        <YourComponent 
            variant="primary" 
            size="lg"
            disabled={false}
        >
            Advanced Example
        </YourComponent>
    );
}`}
>
  <YourComponent variant="primary" size="lg">
    Advanced Example
  </YourComponent>
</CodePreview>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `"primary" \| "secondary"` | `"primary"` | Component style variant |
| size | `"sm" \| "md" \| "lg"` | `"md"` | Component size |
| disabled | `boolean` | `false` | Whether component is disabled |

## Callouts

<Callout type="info">
This is an info callout. Great for tips and additional information.
</Callout>

<Callout type="warning">
This is a warning callout. Use for important notes.
</Callout>

<Callout type="error">
This is an error callout. Use for critical information.
</Callout>

<Callout type="success">
This is a success callout. Perfect for positive reinforcement.
</Callout>
```

### 3. Available MDX Components

Your MDX files have access to:

- **`<CodePreview>`** - Interactive code preview with syntax highlighting
- **`<Callout>`** - Styled callout boxes (info, warning, error, success)
- **`<Button>`** - UI button component
- **`<Card>`** - Card components (Card, CardHeader, CardTitle, CardDescription, CardContent)
- **All HTML elements** - Styled headings, paragraphs, lists, tables, etc.

### 4. Register Your Documentation

Update `src/pages/uikit/components/index.tsx`:

```tsx
import { lazy } from "react";
import { MDXRenderer } from "./MDXRenderer";

// Import your MDX documentation
const YourComponentDocs = lazy(() => import("../docs/your-component.mdx"));

// Create wrapper component
const YourComponentDocumentation = () => (
    <MDXRenderer>
        <YourComponentDocs />
    </MDXRenderer>
);

// Add to componentSections array
export const componentSections: ComponentSection[] = [
    {
        id: "your-component",
        title: "Your Component",
        description: "Description of your component",
        icon: <YourIcon className="w-5 h-5" />,
        documentation: YourComponentDocumentation,
    },
    // ... other components
];
```

## 🔧 Creating Components

### 1. Component Structure

Create your components in `src/components/ui/`:

```tsx
// src/components/ui/your-component.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface YourComponentProps {
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
}

const YourComponent = React.forwardRef<
    HTMLDivElement,
    YourComponentProps
>(({ variant = "primary", size = "md", disabled = false, className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                // Base styles
                "inline-flex items-center justify-center rounded-md font-medium transition-colors",
                // Variants
                {
                    "bg-primary text-primary-foreground hover:bg-primary/90": variant === "primary",
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
                },
                // Sizes
                {
                    "h-8 px-3 text-sm": size === "sm",
                    "h-10 px-4": size === "md",
                    "h-12 px-6 text-lg": size === "lg",
                },
                // States
                {
                    "opacity-50 cursor-not-allowed": disabled,
                },
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

YourComponent.displayName = "YourComponent";

export { YourComponent };
```

### 2. Export Your Component

Update `src/components/mdx/MDXComponents.tsx` to make your component available in MDX:

```tsx
import { YourComponent } from "@/components/ui/your-component";

export const mdxComponents = {
    // ... existing components
    YourComponent,
    // ... rest of components
};
```

### 3. Component Best Practices

- ✅ Use `React.forwardRef` for proper ref forwarding
- ✅ Include TypeScript interfaces for all props
- ✅ Use `cn()` utility for conditional class names
- ✅ Follow consistent naming conventions
- ✅ Include proper `displayName` for debugging
- ✅ Support common variants (size, variant, disabled)
- ✅ Make components composable and flexible

## 🎨 Styling Guidelines

### Tailwind Classes

Use consistent Tailwind patterns:

```tsx
// ✅ Good - using design tokens
"bg-primary text-primary-foreground"
"text-muted-foreground"
"border-border"

// ❌ Avoid - hardcoded colors
"bg-blue-500 text-white"
"text-gray-600"
"border-gray-200"
```

### Component Variants

Follow consistent variant patterns:

```tsx
// Size variants
"sm" | "md" | "lg" | "xl"

// Style variants  
"default" | "primary" | "secondary" | "destructive" | "outline" | "ghost"

// State variants
"active" | "inactive" | "loading" | "disabled"
```

## 🤝 Contributing on GitHub

### 1. Fork & Clone

   ```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME
   bun install
   ```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-component-name
# or
git checkout -b docs/your-documentation-update
# or  
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes

#### Adding a New Component:

1. **Create the component** in `src/components/ui/`
2. **Write documentation** in `src/pages/uikit/docs/`
3. **Register component** in `src/pages/uikit/components/index.tsx`
4. **Export in MDX** in `src/components/mdx/MDXComponents.tsx`
5. **Test thoroughly** in development mode

#### Improving Documentation:

1. **Update MDX files** with better examples
2. **Add missing props** documentation  
3. **Include more use cases** and examples
4. **Fix typos** and improve clarity

#### Fixing Bugs:

1. **Identify the issue** clearly
2. **Create minimal reproduction** if possible
3. **Fix the bug** without breaking existing functionality
4. **Test the fix** thoroughly

### 4. Commit Guidelines

Use conventional commit format:

   ```bash
# New features
git commit -m "feat: add new Button component with variants"
git commit -m "feat(docs): add comprehensive Button documentation"

# Bug fixes  
git commit -m "fix: resolve Button hover state issue"
git commit -m "fix(docs): correct CodePreview syntax highlighting"

# Documentation
git commit -m "docs: improve component installation guide"
git commit -m "docs: add contributing guidelines"

# Refactoring
git commit -m "refactor: move MDX components to separate file"
git commit -m "refactor: improve component prop types"
```

### 5. Pull Request Process

```bash
# Push your changes
git push origin feature/your-component-name

# Create Pull Request on GitHub with:
```

**PR Template:**

```markdown
## 📝 Description
Brief description of what this PR does.

## 🎯 Type of Change
- [ ] New component
- [ ] Documentation update  
- [ ] Bug fix
- [ ] Refactoring
- [ ] Performance improvement

## 🧪 Testing
- [ ] Component works in development
- [ ] Documentation renders correctly
- [ ] No TypeScript errors
- [ ] Responsive design tested
- [ ] Dark/light mode tested

## 📷 Screenshots
(If applicable, add screenshots of your changes)

## 📋 Checklist
- [ ] Code follows project conventions
- [ ] Documentation is complete
- [ ] Component is exported properly
- [ ] No console errors or warnings
- [ ] Tested on multiple browsers
```

### 6. Review Process

1. **Automated checks** will run (TypeScript, linting, build)
2. **Maintainers will review** your code and documentation
3. **Address feedback** if any changes are requested  
4. **Merge** once approved by maintainers

## 📁 Project Structure

```
src/
├── components/
│   ├── mdx/
│   │   └── MDXComponents.tsx     # MDX component registry
│   ├── ui/                       # Your UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── your-component.tsx
│   └── magicui/                  # Special effect components
├── pages/uikit/
│   ├── components/
│   │   ├── index.tsx             # Component registration
│   │   ├── CodePreview.tsx       # Code preview component
│   │   └── MDXRenderer.tsx       # MDX renderer
│   ├── docs/                     # Your MDX documentation
│   │   ├── your-component.mdx
│   │   └── another-component.mdx
│   └── UIKit.tsx                 # Main UIKit page
├── lib/
│   └── utils.ts                  # Utility functions
└── App.tsx                       # Main app
```

## 🎯 Best Practices

### Documentation
- ✅ Start with a clear, one-sentence description
- ✅ Show basic usage first, then advanced examples
- ✅ Include complete, runnable code examples
- ✅ Document all props with types and descriptions
- ✅ Use callouts for important information
- ✅ Test all examples actually work

### Components
- ✅ Follow existing component patterns
- ✅ Use TypeScript for all props and interfaces
- ✅ Support common variants (size, style, state)
- ✅ Include proper accessibility attributes
- ✅ Make components composable and flexible
- ✅ Use design system tokens (colors, spacing, etc.)

### Code Quality
- ✅ No TypeScript errors or warnings
- ✅ Consistent code formatting
- ✅ Proper component naming conventions
- ✅ Clean, readable code with comments when needed
- ✅ Test components in both light and dark themes

## 🆘 Getting Help

- 📖 **Documentation Issues**: Check existing MDX files for examples
- 🐛 **Bug Reports**: Create GitHub issue with reproduction steps  
- 💡 **Feature Requests**: Open GitHub discussion first
- ❓ **Questions**: Check README or ask in GitHub discussions

## 🚀 Deployment

The documentation site automatically deploys when changes are merged to main branch.

---

**Happy coding! 🎉** 

Built with ❤️ using React, TypeScript, Tailwind CSS, and MDX.