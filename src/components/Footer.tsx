import { Heart, Code } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full mt-auto py-6 border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto mobile-padding">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
            <span>by</span>
            <span className="font-medium text-foreground">2m2i4c7h</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>Built with React & TypeScript</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span className="text-xs">© 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
