# Suggested Commands for Development

## Development Commands
```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run linting
bun run lint

# Generate documentation
bun run generate-docs
```

## System Commands (Linux)
```bash
# File operations
ls -la                    # List files with details
cd /path/to/directory     # Change directory
find . -name "*.tsx"      # Find TypeScript React files
grep -r "Widget" src/     # Search for "Widget" in src directory

# Git operations
git status                # Check git status
git add .                 # Stage all changes
git commit -m "message"   # Commit changes
git push                  # Push to remote

# Process management
ps aux | grep bun|ps aux | grep bun        # Find Node.js processes
kill -9 <pid>            # Kill process by PID

# Package management
bun install               # Install dependencies
bun update                # Update dependencies
bun audit                 # Security audit
```

## Development Workflow Commands
```bash
# Start development with hot reload
bun run dev

# Check for TypeScript errors
bunx tsc --noEmit

# Run linting and fix issues
bun run lint -- --fix

# Build and test production build
bun run build && bun run preview
```

## Useful Development Patterns
```bash
# Watch for file changes and restart dev server
bun run dev

# Check bundle size
bun run build && bunx vite-bundle-analyzer

# Run tests (if configured)
bun test

# Format code (if prettier is configured)
bunx prettier --write src/
```