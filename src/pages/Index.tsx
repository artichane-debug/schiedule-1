import { useState, useEffect } from "react";
import { Course, ScheduleData } from "@/types/schedule";
import Header from '../components/Header';
import WeeklySchedule from '../components/WeeklySchedule';
import CalendarView from '../components/CalendarView';
import DayView from '../components/DayView';
import CourseModal from '../components/CourseModal';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar, Grid3X3, Clock } from "lucide-react";
// Temporarily comment out to test deployment
// import { handleVersionUpdate, clearAppCache } from "@/utils/version-manager";

const Index = () => {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear().toString();

  // Debug logging for deployment
  console.log('Index component loaded successfully');
  console.log('Current year:', currentYear);
  
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    courses: [],
    currentYear,
    currentSemester: 'ganjil'
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [viewMode, setViewMode] = useState<'weekly' | 'calendar' | 'day'>('weekly');

  // Load data from localStorage on mount (simplified for deployment debug)
  useEffect(() => {
    const saved = localStorage.getItem('schiedule-data');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setScheduleData(parsedData);
      } catch (error) {
        console.error('Failed to load saved data:', error);
        toast({
          title: "Data Load Error",
          description: "Failed to load your saved courses. Starting fresh.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  }, [toast]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('schiedule-data', JSON.stringify(scheduleData));
  }, [scheduleData]);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleSaveCourse = (courseData: Partial<Course>) => {
    if (editingCourse) {
      // Update existing course
      setScheduleData(prev => ({
        ...prev,
        courses: prev.courses.map(c => 
          c.id === editingCourse.id 
            ? { ...c, ...courseData } as Course
            : c
        )
      }));
      toast({
        title: "Course Updated! ✨",
        description: `${courseData.title} has been successfully updated.`,
      });
    } else {
      // Add new course
      const newCourse: Course = {
        id: Date.now().toString(),
        title: courseData.title || '',
        professor: courseData.professor || '',
        room: courseData.room || '',
        startTime: courseData.startTime || '',
        endTime: courseData.endTime || '',
        day: courseData.day || 'monday',
        color: courseData.color || 'math',
        year: courseData.year || scheduleData.currentYear,
        semester: courseData.semester || scheduleData.currentSemester,
        credits: courseData.credits || 3,
      };
      
      setScheduleData(prev => ({
        ...prev,
        courses: [...prev.courses, newCourse]
      }));
      
      toast({
        title: "Course Added! 🎉", 
        description: `${newCourse.title} has been added to your schedule.`,
      });
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    const course = scheduleData.courses.find(c => c.id === courseId);
    setScheduleData(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c.id !== courseId)
    }));
    
    toast({
      title: "Course Removed",
      description: `${course?.title} has been removed from your schedule.`,
      variant: "destructive"
    });
  };

  const handleYearChange = (year: string) => {
    setScheduleData(prev => ({ ...prev, currentYear: year }));
  };

  const handleSemesterChange = (semester: string) => {
    setScheduleData(prev => ({ 
      ...prev, 
      currentSemester: semester as 'ganjil' | 'genap' 
    }));
  };

  // Filter courses for current year and semester
  const currentCourses = scheduleData.courses.filter(
    course => course.year === scheduleData.currentYear && 
               course.semester === scheduleData.currentSemester
  );

  const totalCredits = currentCourses.reduce((sum, course) => sum + (course.credits || 0), 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Lovable.dev-style animated background */}
      <div className="fixed inset-0 lovable-background-subtle"></div>
      
      {/* Floating orbs for visual appeal */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10">
        <Header
          currentYear={scheduleData.currentYear}
          currentSemester={scheduleData.currentSemester}
          onYearChange={handleYearChange}
          onSemesterChange={handleSemesterChange}
          onAddCourse={handleAddCourse}
        />
        
        <main className="mobile-padding py-6 sm:py-8">
          {/* Stats Cards */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 max-w-2xl w-full">
              <div className="grid grid-cols-3 divide-x divide-border/50">
                <div className="text-center px-3 sm:px-4 animate-slide-up">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1">{currentCourses.length}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">Courses</div>
                </div>
                <div className="text-center px-3 sm:px-4 animate-slide-up" style={{animationDelay: '0.1s'}}>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1">{totalCredits}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">Credits</div>
                </div>
                <div className="text-center px-3 sm:px-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-pink-600 mb-1 capitalize">{scheduleData.currentSemester}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">{scheduleData.currentYear}</div>
                </div>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-1.5 shadow-lg">
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('weekly')}
                  className={`rounded-xl px-4 py-2 font-medium transition-all duration-200 ${
                    viewMode === 'weekly' 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Weekly
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className={`rounded-xl px-4 py-2 font-medium transition-all duration-200 ${
                    viewMode === 'day' 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Day
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className={`rounded-xl px-4 py-2 font-medium transition-all duration-200 ${
                    viewMode === 'calendar' 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
              </div>
            </div>
          </div>
      
          {/* Show schedule always */}
          <div className="mt-8 sm:mt-12">
            {viewMode === 'weekly' ? (
              <WeeklySchedule
                courses={currentCourses}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleDeleteCourse}
              />
            ) : viewMode === 'day' ? (
              <DayView
                courses={currentCourses}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleDeleteCourse}
              />
            ) : (
              <CalendarView
                courses={currentCourses}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleDeleteCourse}
              />
            )}
          </div>
        </main>
        
        {/* Course Modal */}
        <CourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCourse}
          editingCourse={editingCourse}
          currentYear={scheduleData.currentYear}
          currentSemester={scheduleData.currentSemester}
        />
      </div>
    </div>
  );
};

export default Index;