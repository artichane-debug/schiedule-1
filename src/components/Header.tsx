import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeaderProps {
  currentYear: string;
  currentSemester: string;
  onYearChange: (year: string) => void;
  onSemesterChange: (semester: string) => void;
  onAddCourse: () => void;
}

const Header = ({ currentYear, currentSemester, onYearChange, onSemesterChange, onAddCourse }: HeaderProps) => {
  const currentYearNum = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => (currentYearNum - 2 + i).toString());

  return (
    <header className="w-full mobile-padding py-3 sm:py-4 bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm animate-fade-in" role="banner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <div className="flex items-center min-w-0">
          <img 
            src="/github-logo.jpeg" 
            alt="Schiedule" 
            className="h-12 w-auto sm:h-14 object-contain"
          />
        </div>

        {/* Controls */}
        <nav className="flex items-center space-x-2 md:space-x-3" role="navigation" aria-label="Schedule controls">
          {/* Year Selector */}
          <Select value={currentYear} onValueChange={onYearChange}>
            <SelectTrigger 
              className="w-[70px] sm:w-[90px] md:w-[100px] rounded-xl border bg-background/50 hover:bg-muted/50 touch-target text-responsive-xs transition-all duration-200"
              aria-label="Select academic year"
            >
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border bg-background/95 backdrop-blur-md shadow-xl animate-slide-up">
              {years.map((year) => (
                <SelectItem key={year} value={year} className="text-responsive-xs hover:bg-muted/50 rounded-lg">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Semester Selector */}
          <Select value={currentSemester} onValueChange={onSemesterChange}>
            <SelectTrigger 
              className="w-[80px] sm:w-[100px] md:w-[110px] rounded-xl border bg-background/50 hover:bg-muted/50 touch-target text-responsive-xs transition-all duration-200"
              aria-label="Select semester"
            >
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border bg-background/95 backdrop-blur-md shadow-xl animate-slide-up">
              <SelectItem value="ganjil" className="text-responsive-xs hover:bg-muted/50 rounded-lg">Ganjil</SelectItem>
              <SelectItem value="genap" className="text-responsive-xs hover:bg-muted/50 rounded-lg">Genap</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Course Button */}
          <Button 
            onClick={onAddCourse}
            className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl px-3 sm:px-4 py-2 font-medium touch-target text-responsive-xs shadow-lg hover:shadow-xl transition-all duration-200 animate-scale-in"
            size="sm"
            aria-label="Add new course"
          >
            <Plus className="h-4 w-4 sm:mr-2" aria-hidden="true" />
            <span className="hidden sm:inline">Add Course</span>
            <span className="sm:hidden sr-only">Add</span>
          </Button>

        </nav>
      </div>
    </header>
  );
};

export default Header;