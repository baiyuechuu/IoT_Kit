import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePreviewProps {
  children: React.ReactNode;
  code: string;
  title?: string;
  language?: string;
}

export const CodePreview = ({ children, code, title, language = "tsx" }: CodePreviewProps) => {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Reactive theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Enhanced dark theme style - using card background
  const enhancedDarkTheme = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: 'transparent',
      fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
      fontSize: '15px',
      lineHeight: '1.6',
      tabSize: 4,
      padding: '24px',
      color: 'hsl(var(--foreground))',
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
      fontSize: '15px',
      lineHeight: '1.6',
      tabSize: 4,
      background: 'transparent',
      color: 'hsl(var(--foreground))',
    }
  };

  // Enhanced light theme style - using card background
  const enhancedLightTheme = {
    ...oneLight,
    'pre[class*="language-"]': {
      ...oneLight['pre[class*="language-"]'],
      background: 'transparent',
      fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
      fontSize: '15px',
      lineHeight: '1.6',
      tabSize: 4,
      padding: '24px',
      color: 'hsl(var(--foreground))',
    },
    'code[class*="language-"]': {
      ...oneLight['code[class*="language-"]'],
      fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
      fontSize: '15px',
      lineHeight: '1.6',
      tabSize: 4,
      background: 'transparent',
      color: 'hsl(var(--foreground))',
    }
  };

  return (
    <div className="my-8 space-y-6">
      {title && (
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      )}
      
      {/* Preview */}
      <div className="relative border rounded-xl p-8 bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="pt-4">
          {children}
        </div>
      </div>
      
      {/* Code toggle and display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowCode(!showCode)}
            className="font-medium text-base px-6 py-3 h-auto"
          >
            {showCode ? "Hide Code" : "Show Code"}
          </Button>
        </div>
        
        {showCode && (
          <div className="rounded-xl overflow-hidden border-2 shadow-lg bg-card">
            {/* Code header */}
            <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm font-medium text-muted-foreground font-mono">
                  {language.toUpperCase()}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyToClipboard}
                className="h-8 px-3"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            
            {/* Code content with matching background */}
            <div className="relative bg-card">
              <SyntaxHighlighter
                language={language}
                style={isDark ? enhancedDarkTheme : enhancedLightTheme}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  background: 'hsl(var(--card))',
                }}
                showLineNumbers={false}
                wrapLines={true}
                wrapLongLines={true}
                tabSize={4}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
