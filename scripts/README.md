# Documentation Auto-Generation System

This system automatically generates documentation entries for the UI Kit when MDX files are added or modified in the `Website/src/pages/uikit/docs/` directory.

## How It Works

### 1. MDX File Processing
The system scans all `.mdx` files in the docs directory and extracts:
- **Title**: From the first `# heading` in the file
- **Description**: From the first paragraph after the title
- **Keywords**: Generated from title, description, and filename

### 2. File Generation
Two files are automatically updated:

#### `Website/src/pages/uikit/components/index.tsx`
- Generates lazy imports for each MDX file
- Creates `ComponentSection` entries with proper component names
- Maintains TypeScript compatibility

#### `Website/src/data/searchItems.tsx`
- Adds documentation entries to the search system
- Preserves existing search items (pages, components)
- Generates relevant keywords for search functionality

## GitHub Actions Workflow

The automation runs automatically when:
- MDX files are pushed to `main` or `develop` branches
- Pull requests modify MDX files in the docs directory
- Manual trigger via GitHub Actions UI

### Workflow Features
- ✅ Automatically commits generated changes
- ✅ Creates descriptive commit messages
- ✅ Handles both direct pushes and pull requests
- ✅ Only runs when MDX files change (path filtering)

## Local Development

### Running the Generator Manually
```bash
# From project root
npm run generate-docs

# Or directly
node scripts/generate-docs.js
```

### Testing Changes
```bash
# Test the generation process
npm run test-docs
```

## File Structure Requirements

### MDX File Format
```markdown
# Your Documentation Title

First paragraph becomes the description.

## More content...
```

### Generated Output Example

**index.tsx entry:**
```typescript
{
  id: "your-doc",
  title: "Your Documentation Title", 
  description: "First paragraph becomes the description.",
  documentation: YourDocDocs,
}
```

**searchItems.tsx entry:**
```typescript
{
  id: "your-doc-docs",
  title: "Your Documentation Title",
  description: "First paragraph becomes the description.", 
  type: "documentation",
  path: "/uikit?section=your-doc",
  icon: <FaUikit className="w-6 h-6" />,
  keywords: ["your", "documentation", "title", "first", "paragraph", "becomes", "description"],
}
```

## Troubleshooting

### Common Issues
1. **Missing titles**: Ensure MDX files start with `# Title`
2. **No description**: Add a paragraph after the title
3. **Build errors**: Check generated TypeScript syntax

### Manual Fixes
If the generator produces incorrect output:
1. Fix the issue in `scripts/generate-docs.js`
2. Run `npm run generate-docs` locally
3. Commit the fixed generator and regenerated files

## Adding New MDX Files

1. Create your `.mdx` file in `Website/src/pages/uikit/docs/`
2. Ensure it starts with a `# Title` heading
3. Add a descriptive first paragraph
4. Push to GitHub - automation handles the rest!

The system will automatically:
- Generate the appropriate imports
- Add search functionality
- Update both index and search files
- Commit changes with descriptive messages 