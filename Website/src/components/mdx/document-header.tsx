import { FaGithub, FaClock, FaUser } from "react-icons/fa";

interface DocumentHeaderProps {
  title: string;
  description: string;
  author?: string;
  time?: string;
  git?: string;
}

export function DocumentHeader({ title, description, author, time, git }: DocumentHeaderProps) {
  return (
    <div className="mb-8 pb-6 border-b border-border">
      <h1 className="text-3xl font-bold tracking-tight mb-4">{title}</h1>
      <p className="text-lg text-muted-foreground mb-4">{description}</p>
      
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {author && (
          <div className="flex items-center gap-2">
            <FaUser className="w-4 h-4" />
            <span>{author}</span>
          </div>
        )}
        
        {time && (
          <div className="flex items-center gap-2">
            <FaClock className="w-4 h-4" />
            <span>{time}</span>
          </div>
        )}
        
        {git && (
          <a 
            href={git} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <FaGithub className="w-4 h-4" />
            <span>View Source</span>
          </a>
        )}
      </div>
    </div>
  );
} 