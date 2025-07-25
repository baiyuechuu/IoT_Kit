const fs = require('fs');
const path = require('path');

// Paths
const DOCS_DIR = path.join(__dirname, '../Website/src/content/docs');
const INDEX_FILE = path.join(__dirname, '../Website/src/content/index.tsx');
const SEARCH_ITEMS_FILE = path.join(__dirname, '../Website/src/data/searchItems.tsx');

// Helper function to parse YAML frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: null, content: content };
  }

  const frontmatterText = match[1];
  const remainingContent = content.replace(frontmatterRegex, '');
  
  // Simple YAML parser for our specific needs
  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.includes(':')) {
      const [key, ...valueParts] = trimmed.split(':');
      let value = valueParts.join(':').trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      frontmatter[key.trim()] = value;
    }
  }
  
  return { frontmatter, content: remainingContent };
}

// Helper function to extract title from MDX content (fallback)
function extractTitleFromMDX(content) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : 'Untitled';
}

// Helper function to extract description from MDX content (fallback)
function extractDescriptionFromMDX(content) {
  const lines = content.split('\n');
  let description = '';

  // Look for the first paragraph after the title
  let foundTitle = false;
  for (const line of lines) {
    if (line.match(/^#\s+/)) {
      foundTitle = true;
      continue;
    }
    if (foundTitle && line.trim() && !line.match(/^#+\s+/) && !line.match(/^```/)) {
      description = line.trim();
      break;
    }
  }

  return description || 'Documentation page';
}

// Helper function to generate keywords from title and description
function generateKeywords(title, description, filename) {
  const words = [
    ...title.toLowerCase().split(/\s+/),
    ...description.toLowerCase().split(/\s+/),
    filename.replace('.mdx', '').toLowerCase()
  ];

  // Filter out common words and duplicates
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);

  return [...new Set(words.filter(word => word.length > 2 && !commonWords.has(word)))];
}

// Function to scan MDX files and extract metadata
function scanMDXFiles() {
  const mdxFiles = fs.readdirSync(DOCS_DIR)
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const filePath = path.join(DOCS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const filename = path.basename(file, '.mdx');

      // Parse frontmatter
      const { frontmatter, content: markdownContent } = parseFrontmatter(content);
      
      // Extract metadata from frontmatter or fallback to content parsing
      const title = frontmatter?.title || extractTitleFromMDX(markdownContent);
      const description = frontmatter?.description || extractDescriptionFromMDX(markdownContent);
      const type = frontmatter?.type || 'docs'; // Default to 'docs'
      const category = type === 'component' ? 'components' : 'docs';
      
      const keywords = generateKeywords(title, description, filename);

      return {
        filename,
        title,
        description,
        type,
        category,
        keywords,
        componentName: filename.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('') + 'Docs'
      };
    });

  return mdxFiles;
}

// Function to generate index.tsx content
function generateIndexContent(mdxFiles) {
  const imports = mdxFiles.map(file =>
    `const ${file.componentName} = lazy(() => import("./docs/${file.filename}.mdx"));`
  ).join('\n');

  const sections = mdxFiles.map(file => `\t{
\t\tid: "${file.filename}",
\t\ttitle: "${file.title}",
\t\tdescription: "${file.description}",
\t\tcategory: "${file.category}",
\t\tdocumentation: ${file.componentName},
\t}`).join(',\n');

  return `import { lazy } from "react";

${imports}

export interface ComponentSection {
\tid: string;
\ttitle: string;
\tdescription: string;
\tcategory: "components" | "docs";
\tcomponent?: React.ReactNode;
\tdocumentation?: React.ComponentType;
}

export const componentSections: ComponentSection[] = [
${sections},
];
`;
}

// Function to update searchItems.tsx
function updateSearchItems(mdxFiles) {
  const searchItemsContent = fs.readFileSync(SEARCH_ITEMS_FILE, 'utf-8');

  // Find the existing searchItems array
  const arrayStartRegex = /const searchItems: SearchItem\[\] = \[/;
  const arrayEndRegex = /\];\s*export default searchItems;/;

  const startMatch = searchItemsContent.search(arrayStartRegex);
  const endMatch = searchItemsContent.search(arrayEndRegex);

  if (startMatch === -1 || endMatch === -1) {
    console.error('Could not find searchItems array in the file');
    return;
  }

  // Extract existing items (everything before documentation items)
  const beforeArray = searchItemsContent.substring(0, startMatch);
  const afterArray = searchItemsContent.substring(endMatch);

  // Parse existing items and filter out documentation items
  const existingContent = searchItemsContent.substring(startMatch, endMatch);
  const existingItems = existingContent.split('\n\t// Documentation')[0].replace(/,\s*$/, ''); // Keep everything before docs and remove trailing comma

  // Generate new documentation items
  const docItems = mdxFiles.map(file => `\t// Documentation - ${file.title}
\t{
\t\tid: "${file.filename}-docs",
\t\ttitle: "${file.title}",
\t\tdescription: "${file.description}",
\t\ttype: "documentation",
\t\tpath: "/blog?section=${file.filename}",
\t\ticon: <FaUikit className="w-6 h-6" />,
\t\tkeywords: [${file.keywords.map(k => `"${k}"`).join(', ')}],
\t}`).join(',\n');

  // Combine everything
  const existingItemsClean = existingItems.replace(/const searchItems: SearchItem\[\] = \[/, '').trim();
  const needsComma = existingItemsClean && docItems.length > 0;
  
  const newContent = `${beforeArray}const searchItems: SearchItem[] = [
${existingItemsClean}${needsComma ? ',' : ''}
${docItems.length > 0 ? '\t// Documentation\n' + docItems : ''}
${afterArray}`;

  fs.writeFileSync(SEARCH_ITEMS_FILE, newContent);
}

// Main function
function main() {
  console.log('Scanning MDX files...');
  const mdxFiles = scanMDXFiles();
  console.log(`Found ${mdxFiles.length} MDX files`);

  if (mdxFiles.length === 0) {
    console.log('No MDX files found, skipping generation');
    return;
  }

  console.log('Generating index.tsx...');
  const indexContent = generateIndexContent(mdxFiles);
  fs.writeFileSync(INDEX_FILE, indexContent);

  console.log('Updating searchItems.tsx...');
  updateSearchItems(mdxFiles);

  console.log('Documentation generation complete!');
  console.log('Generated entries for:');
  mdxFiles.forEach(file => {
    console.log(`  - ${file.title} (${file.filename}.mdx)`);
  });
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, scanMDXFiles, generateIndexContent }; 
