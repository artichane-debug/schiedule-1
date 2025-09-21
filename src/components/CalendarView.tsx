import { useState, useEffect } from "react";
import { Course } from "@/types/schedule";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User, BookOpen } from "lucide-react";
import CourseCard from "@/components/CourseCard";

interface CalendarViewProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

interface DateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

const CalendarView = ({ courses, onEditCourse, onDeleteCourse }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDateDetails, setShowDateDetails] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getCoursesForDate = (date: Date | null) => {
    if (!date) return [];
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    
    // Check if the date falls within the semester period
    const isDateInSemester = (checkDate: Date, course: Course) => {
      const year = checkDate.getFullYear();
      const month = checkDate.getMonth(); // 0-based (0 = January, 8 = September, 1 = February)
      const day = checkDate.getDate();
      
      if (course.semester === 'ganjil') {
        // Odd semester starts September 15
        // If current date is before September 15, check previous year's semester
        if (month < 8 || (month === 8 && day < 15)) {
          // Before September 15, so this would be previous year's odd semester
          const prevYearCourse = parseInt(course.year) === year - 1;
          return prevYearCourse;
        } else {
          // After September 15, check current year's odd semester
          const currentYearCourse = parseInt(course.year) === year;
          return currentYearCourse;
        }
      } else if (course.semester === 'genap') {
        // Even semester starts February 23
        if (month < 1 || (month === 1 && day < 23)) {
          // Before February 23, so this would be previous year's even semester
          const prevYearCourse = parseInt(course.year) === year - 1;
          return prevYearCourse;
        } else {
          // After February 23, check current year's even semester
          const currentYearCourse = parseInt(course.year) === year;
          return currentYearCourse;
        }
      }
      
      return false;
    };
    
    const coursesForDay = courses.filter(course => {
      // First check if the date is within the semester period
      if (!isDateInSemester(date, course)) {
        return false;
      }
      
      // Then check if it matches the day of the week
      const courseDay = course.day?.toLowerCase();
      const targetDay = dayName.toLowerCase();
      
      return (
        courseDay === targetDay ||                    // exact match: "monday" === "monday"
        courseDay === targetDay.slice(0, 3) ||       // short match: "mon" === "monday"
        targetDay === courseDay.slice(0, 3) ||       // reverse short: "monday" === "mon"
        courseDay?.includes(targetDay) ||            // contains: "monday" in "monday-class"
        targetDay?.includes(courseDay)               // reverse contains
      );
    });
    
    return coursesForDay;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Swipe gesture handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navigateMonth('next');
    } else if (isRightSwipe) {
      navigateMonth('prev');
    }
  };

  const days = getDaysInMonth(currentDate);
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  
  // Ensure all months have exactly 42 cells (6 weeks) for consistency
  const paddedDays = [...days];
  while (paddedDays.length < 42) {
    paddedDays.push(null);
  }


  return (
    <div className="w-full max-w-7xl mx-auto mobile-padding py-4 sm:py-6 md:py-8 animate-fade-in">
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-muted/50 transition-all duration-200 touch-target mobile-interactive"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              {currentMonth}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              {currentYear}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('next')}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-muted/50 transition-all duration-200 touch-target mobile-interactive"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>

      <div 
        className="bg-card/80 backdrop-blur-sm rounded-xl select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="grid grid-cols-7 mb-4">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center py-3">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {day.slice(0, 3)}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {paddedDays.map((date, index) => {
            const coursesForDay = getCoursesForDate(date);
            const isToday = date && 
              date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && date &&
              date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`h-12 sm:h-14 flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                  date 
                    ? 'hover:bg-muted/30' 
                    : ''
                }`}
                onClick={() => {
                  if (date) {
                    setSelectedDate(date);
                    if (coursesForDay.length > 0) {
                      setShowDateDetails(true);
                    }
                  }
                }}
              >
                {date && (
                  <div className="relative">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm sm:text-base font-normal transition-colors ${
                      isSelected || isToday 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-foreground'
                    }`}>
                      {date.getDate()}
                    </div>
                    
                    {coursesForDay.length > 0 && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {getCoursesForDate(selectedDate || new Date()).length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No events
            </p>
          </div>
        )}
      </div>

      {selectedDate && getCoursesForDate(selectedDate).length > 0 && (
        <div className="mt-8">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground">
              {selectedDate.toDateString() === new Date().toDateString() 
                ? "Today's Schedule" 
                : `Schedule for ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
              }
            </h3>
          </div>
          
          <div className="block sm:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide touch-scroll">
              {getCoursesForDate(selectedDate).map((course, index) => (
                <div key={course.id} className="flex-shrink-0 w-80 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <CourseCard
                    course={course}
                    onEdit={onEditCourse}
                    onDelete={onDeleteCourse}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCoursesForDate(selectedDate).map((course, index) => (
              <div key={course.id} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CourseCard
                  course={course}
                  onEdit={onEditCourse}
                  onDelete={onDeleteCourse}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={showDateDetails} onOpenChange={setShowDateDetails}>
        <DialogContent className="w-[90vw] max-w-lg max-h-[80vh] overflow-y-auto mx-auto rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              {selectedDate && (
                <span>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedDate && getCoursesForDate(selectedDate).length > 0 ? (
              getCoursesForDate(selectedDate).map((course) => (
                <div
                  key={course.id}
                  className="bg-background/50 backdrop-blur-sm border border-border/30 rounded-xl p-4 space-y-3 hover:bg-background/70 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-base mb-1">
                        {course.title}
                      </h3>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${
                        course.color === 'math' ? 'bg-purple-500' :
                        course.color === 'science' ? 'bg-blue-500' :
                        course.color === 'english' ? 'bg-green-500' :
                        course.color === 'history' ? 'bg-orange-500' :
                        course.color === 'art' ? 'bg-pink-500' :
                        'bg-indigo-500'
                      }`}>
                        {course.color.charAt(0).toUpperCase() + course.color.slice(1)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{course.startTime} - {course.endTime}</span>
                    </div>
                    
                    {course.professor && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{course.professor}</span>
                      </div>
                    )}
                    
                    {course.room && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{course.room}</span>
                      </div>
                    )}
                    
                    {course.credits && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.credits} Credits</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No courses scheduled for this day</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
