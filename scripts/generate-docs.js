const fs = require('fs');
const path = require('path');

// Paths
const DOCS_DIR = path.join(__dirname, '../Website/src/content/docs');
const INDEX_FILE = path.join(__dirname, '../Website/src/content/index.tsx');
const SEARCH_ITEMS_FILE = path.join(__dirname, '../Website/src/data/searchItems.tsx');

// Helper function to generate URL-friendly path from title
function generatePathFromTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

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

  const sections = mdxFiles.map(file => {
    const pathFromTitle = generatePathFromTitle(file.title);
    return `\t{
\t\tid: "${pathFromTitle}",
\t\ttitle: "${file.title}",
\t\tdescription: "${file.description}",
\t\tcategory: "${file.category}",
\t\tdocumentation: ${file.componentName},
\t}`;
  }).join(',\n');

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
  
  // Split content to separate page items from documentation items
  const parts = existingContent.split('\n\t// Documentation');
  const pageItems = parts[0].replace(/const searchItems: SearchItem\[\] = \[/, '').trim();
  
  // Get existing documentation items and extract metadata
  // Join all parts after the first split to handle multiple documentation sections
  const existingDocItems = parts.length > 1 ? parts.slice(1).join('\n\t// Documentation') : '';
  
  const existingDocPaths = new Set();
  const existingDocTitles = new Set();
  const existingDocDescriptions = new Set();
  
  // Extract existing documentation metadata
  const docPathRegex = /path: "\/blog\/([^"]+)"/g;
  const docTitleRegex = /title: "([^"]+)"/g;
  const docDescRegex = /description: "([^"]+)"/g;
  
  let match;
  while ((match = docPathRegex.exec(existingDocItems)) !== null) {
    existingDocPaths.add(match[1]);
  }
  
  while ((match = docTitleRegex.exec(existingDocItems)) !== null) {
    existingDocTitles.add(match[1]);
  }
  
  while ((match = docDescRegex.exec(existingDocItems)) !== null) {
    existingDocDescriptions.add(match[1]);
  }

  // Filter out MDX files that already exist in search items
  const newMdxFiles = [];
  const updatedMdxFiles = [];
  
  mdxFiles.forEach(file => {
    // Normalize text for comparison (remove punctuation, extra spaces, etc.)
    const normalizeText = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    
    const normalizedFileTitle = normalizeText(file.title);
    const normalizedFileDesc = normalizeText(file.description);
    const pathFromTitle = generatePathFromTitle(file.title);
    
    const isDuplicate = existingDocPaths.has(pathFromTitle) || 
                       Array.from(existingDocTitles).some(title => normalizeText(title) === normalizedFileTitle) ||
                       Array.from(existingDocDescriptions).some(desc => normalizeText(desc) === normalizedFileDesc);
    
    if (isDuplicate) {
      // Check if this is an update to an existing entry (same path but different content)
      if (existingDocPaths.has(pathFromTitle)) {
        console.log(`  🔄 Updating existing entry: ${file.title} (${pathFromTitle})`);
        updatedMdxFiles.push(file);
      } else {
        console.log(`  ⚠️  Skipping duplicate: ${file.title} (${file.filename}.mdx)`);
        if (Array.from(existingDocTitles).some(title => normalizeText(title) === normalizedFileTitle)) {
          console.log(`     - Duplicate title: ${file.title}`);
        }
        if (Array.from(existingDocDescriptions).some(desc => normalizeText(desc) === normalizedFileDesc)) {
          console.log(`     - Duplicate description: ${file.description}`);
        }
      }
    } else {
      newMdxFiles.push(file);
    }
  });

  if (newMdxFiles.length === 0 && updatedMdxFiles.length === 0) {
    console.log('No new or updated MDX files to process');
    return;
  }

  // Generate new documentation items with new URL structure
  const newDocItems = newMdxFiles.map(file => {
    const pathFromTitle = generatePathFromTitle(file.title);
    return `\t// Documentation - ${file.title}
\t{
\t\tid: "${pathFromTitle}-docs",
\t\ttitle: "${file.title}",
\t\tdescription: "${file.description}",
\t\ttype: "documentation",
\t\tpath: "/blog/${pathFromTitle}",
\t\ticon: <FaUikit className="w-6 h-6" />,
\t\tkeywords: [${file.keywords.map(k => `"${k}"`).join(', ')}],
\t}`;
  }).join(',\n');

  // Generate updated documentation items
  const updatedDocItems = updatedMdxFiles.map(file => {
    const pathFromTitle = generatePathFromTitle(file.title);
    return `\t// Documentation - ${file.title}
\t{
\t\tid: "${pathFromTitle}-docs",
\t\ttitle: "${file.title}",
\t\tdescription: "${file.description}",
\t\ttype: "documentation",
\t\tpath: "/blog/${pathFromTitle}",
\t\ticon: <FaUikit className="w-6 h-6" />,
\t\tkeywords: [${file.keywords.map(k => `"${k}"`).join(', ')}],
\t}`;
  }).join(',\n');

  // Clean up page items - remove trailing commas
  const cleanPageItems = pageItems.replace(/,\s*$/, '');
  
  // Combine everything with proper comma handling
  const hasPageItems = cleanPageItems && cleanPageItems.trim().length > 0;
  const hasExistingDocs = existingDocItems && existingDocItems.trim().length > 0;
  const hasNewDocs = newDocItems.length > 0;
  const hasUpdatedDocs = updatedDocItems.length > 0;
  
  let newContent = `${beforeArray}const searchItems: SearchItem[] = [
${hasPageItems ? cleanPageItems : ''}`;

  // Add comma after page items if we have docs
  if (hasPageItems && (hasExistingDocs || hasNewDocs || hasUpdatedDocs)) {
    newContent += ',';
  }

  if (hasExistingDocs) {
    // Instead of trying to replace individual entries, regenerate the entire documentation section
    // This ensures we don't have duplicates and everything is up to date
    const allDocFiles = [...newMdxFiles, ...updatedMdxFiles];
    const allDocItems = allDocFiles.map(file => {
      const pathFromTitle = generatePathFromTitle(file.title);
      return `\t// Documentation - ${file.title}
\t{
\t\tid: "${pathFromTitle}-docs",
\t\ttitle: "${file.title}",
\t\tdescription: "${file.description}",
\t\ttype: "documentation",
\t\tpath: "/blog/${pathFromTitle}",
\t\ticon: <FaUikit className="w-6 h-6" />,
\t\tkeywords: [${file.keywords.map(k => `"${k}"`).join(', ')}],
\t}`;
    }).join(',\n');
    
    newContent += `\n\t// Documentation\n${allDocItems}`;
  } else if (hasNewDocs) {
    newContent += `\n\t// Documentation\n${newDocItems}`;
  }

  newContent += `\n${afterArray}`;

  // Clean up any double commas that might have been created
  newContent = newContent.replace(/,\s*,/g, ',');
  newContent = newContent.replace(/,\s*\n\s*]/g, '\n]');

  fs.writeFileSync(SEARCH_ITEMS_FILE, newContent);
  
  if (newMdxFiles.length > 0) {
    console.log(`Added ${newMdxFiles.length} new documentation items to search`);
    newMdxFiles.forEach(file => {
      const pathFromTitle = generatePathFromTitle(file.title);
      console.log(`  - ${file.title} (/blog/${pathFromTitle})`);
    });
  }
  
  if (updatedMdxFiles.length > 0) {
    console.log(`Updated ${updatedMdxFiles.length} existing documentation items`);
    updatedMdxFiles.forEach(file => {
      const pathFromTitle = generatePathFromTitle(file.title);
      console.log(`  - ${file.title} (/blog/${pathFromTitle})`);
    });
  }
}

// Main function
function main() {
  console.log('🔍 Scanning MDX files...');
  const mdxFiles = scanMDXFiles();
  console.log(`📁 Found ${mdxFiles.length} MDX files`);

  if (mdxFiles.length === 0) {
    console.log('❌ No MDX files found, skipping generation');
    return;
  }

  console.log('📝 Generating index.tsx...');
  const indexContent = generateIndexContent(mdxFiles);
  fs.writeFileSync(INDEX_FILE, indexContent);
  console.log('✅ Updated index.tsx with component sections');

  console.log('🔍 Updating searchItems.tsx...');
  updateSearchItems(mdxFiles);

  console.log('🎉 Documentation generation complete!');
  console.log('📋 Generated entries for:');
  mdxFiles.forEach(file => {
    console.log(`  - ${file.title} (${file.filename}.mdx) → /blog/${file.filename}`);
  });
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, scanMDXFiles, generateIndexContent }; 
