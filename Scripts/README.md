# Documentation Auto-Generation System

This system automatically generates documentation entries for the Blog when MDX files are added or modified in the `Website/src/content/docs/` directory.

## How It Works

### MDX File Processing
The system scans all `.mdx` files in the docs directory and extracts:
- **Title**: From the first `# heading` in the file
- **Description**: From the first paragraph after the title
- **Keywords**: Generated from title, description, and filename

### URL Structure
The system now generates clean, SEO-friendly URLs:
- `/blog/filename` instead of `/blog?section=filename`
- All URLs are bookmarkable and shareable
- Proper browser history support

## Running the Script

### Local Development
```bash
# From the Website directory
npm run generate-docs

# Or directly from the scripts directory
node scripts/generate-docs.js
```

### What It Does
1. **Scans MDX files** in `Website/src/content/docs/`
2. **Updates `index.tsx`** with component sections
3. **Updates `searchItems.tsx`** with search entries
4. **Avoids duplicates** - only adds new files
5. **Provides feedback** with emojis and clear output

## GitHub Actions Workflow

The automation runs automatically when:
- MDX files are pushed to `main` or `develop` branches
- Pull requests modify MDX files in the docs directory
- Manual trigger via GitHub Actions UI

### Workflow Features
- [x] Automatically commits generated changes
- [x] Creates descriptive commit messages
- [x] Handles both direct pushes and pull requests
- [x] Only runs when MDX files change (path filtering)
- [x] Uses new URL-based routing structure

## Adding New MDX Files

1. Create your `.mdx` file in `Website/src/content/docs/`
2. Ensure it starts with a `# Title` heading
3. Add a descriptive first paragraph
4. Push to GitHub - automation handles the rest!

The system will automatically:
- Generate the appropriate imports
- Add search functionality with clean URLs
- Update both index and search files
- Commit changes with descriptive messages
- Create URLs like `/blog/your-filename`

## Example Output

```
🔍 Scanning MDX files...
📁 Found 2 MDX files
📝 Generating index.tsx...
✅ Updated index.tsx with component sections
🔍 Updating searchItems.tsx...
Added 2 new documentation items to search
  - Example Component (/blog/example-component)
  - Test Documentation Page (/blog/test)
🎉 Documentation generation complete!
📋 Generated entries for:
  - Example Component (example-component.mdx) → /blog/example-component
  - Test Documentation Page (test.mdx) → /blog/test
``` 
