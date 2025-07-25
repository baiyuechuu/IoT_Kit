# Documentation Auto-Generation System

This system automatically generates documentation entries for the UI Kit when MDX files are added or modified in the `Website/src/pages/uikit/docs/` directory.

## How It Works

### MDX File Processing
The system scans all `.mdx` files in the docs directory and extracts:
- **Title**: From the first `# heading` in the file
- **Description**: From the first paragraph after the title
- **Keywords**: Generated from title, description, and filename

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
