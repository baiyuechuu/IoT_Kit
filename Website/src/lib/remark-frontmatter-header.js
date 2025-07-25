import { visit } from 'unist-util-visit';

export function remarkFrontmatterHeader() {
  return function transformer(tree, file) {
    let frontmatter = null;

    // Find YAML frontmatter in the tree (after remark-frontmatter has processed it)
    visit(tree, 'yaml', (node) => {
      try {
        // Simple YAML parsing for our needs
        const lines = node.value.split('\n');
        frontmatter = {};
        
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
      } catch (error) {
        console.warn('Failed to parse YAML frontmatter:', error);
      }
    });

    if (!frontmatter || !frontmatter.title) {
      return;
    }

    // Remove the first heading if it matches the frontmatter title
    let removedHeading = false;
    visit(tree, 'heading', (node, index, parent) => {
      if (!removedHeading && node.depth === 1 && parent) {
        const headingText = node.children
          .filter(child => child.type === 'text')
          .map(child => child.value)
          .join('');
        
        if (headingText.trim() === frontmatter.title?.trim()) {
          parent.children.splice(index, 1);
          removedHeading = true;
          return 'skip';
        }
      }
    });

    // Remove the first paragraph if it matches the description
    if (frontmatter.description) {
      let removedParagraph = false;
      visit(tree, 'paragraph', (node, index, parent) => {
        if (!removedParagraph && parent) {
          const paragraphText = node.children
            .filter(child => child.type === 'text')
            .map(child => child.value)
            .join('');
          
          if (paragraphText.trim() === frontmatter.description?.trim()) {
            parent.children.splice(index, 1);
            removedParagraph = true;
            return 'skip';
          }
        }
      });
    }

    return tree;
  };
} 