const Footer = () => {
  return (
    <footer className="w-full py-4 sm:py-6 border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>by</span>
            <span className="font-medium text-foreground">2m2i4c7h</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>⚡</span>
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
