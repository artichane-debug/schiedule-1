import { useState, useEffect } from "react";
import { Course } from "@/types/schedule";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, MapPin, User, BookOpen } from "lucide-react";
import CourseCard from "@/components/CourseCard";

interface DayViewProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

const DayView = ({ courses, onEditCourse, onDeleteCourse }: DayViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Generate hours from 6 AM to 10 PM
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 to 22 (6 AM to 10 PM)

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  const getCoursesForDate = (date: Date) => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    
    // Check if the date falls within the semester period (same logic as CalendarView)
    const isDateInSemester = (checkDate: Date, course: Course) => {
      const year = checkDate.getFullYear();
      const month = checkDate.getMonth();
      const day = checkDate.getDate();
      
      if (course.semester === 'ganjil') {
        if (month < 8 || (month === 8 && day < 15)) {
          const prevYearCourse = parseInt(course.year) === year - 1;
          return prevYearCourse;
        } else {
          const currentYearCourse = parseInt(course.year) === year;
          return currentYearCourse;
        }
      } else if (course.semester === 'genap') {
        if (month < 1 || (month === 1 && day < 23)) {
          const prevYearCourse = parseInt(course.year) === year - 1;
          return prevYearCourse;
        } else {
          const currentYearCourse = parseInt(course.year) === year;
          return currentYearCourse;
        }
      }
      
      return false;
    };
    
    return courses.filter(course => {
      if (!isDateInSemester(date, course)) return false;
      
      const courseDay = course.day?.toLowerCase();
      const targetDay = dayName.toLowerCase();
      
      return (
        courseDay === targetDay ||
        courseDay === targetDay.slice(0, 3) ||
        targetDay === courseDay.slice(0, 3) ||
        courseDay?.includes(targetDay) ||
        targetDay?.includes(courseDay)
      );
    });
  };

  const getCoursesForHour = (hour: number) => {
    const coursesForDay = getCoursesForDate(currentDate);
    
    return coursesForDay.filter(course => {
      const startTime = course.startTime;
      const endTime = course.endTime;
      
      if (!startTime || !endTime) return false;
      
      // Parse time strings (assuming format like "09:00" or "9:00 AM")
      const parseTime = (timeStr: string) => {
        // Remove AM/PM and clean up
        const cleanTime = timeStr.replace(/[^\d:]/g, '');
        const [hourStr, minuteStr] = cleanTime.split(':');
        let parsedHour = parseInt(hourStr);
        
        // Handle AM/PM
        if (timeStr.toLowerCase().includes('pm') && parsedHour !== 12) {
          parsedHour += 12;
        } else if (timeStr.toLowerCase().includes('am') && parsedHour === 12) {
          parsedHour = 0;
        }
        
        return parsedHour;
      };
      
      const courseStartHour = parseTime(startTime);
      const courseEndHour = parseTime(endTime);
      
      // Check if the current hour falls within the course time
      return hour >= courseStartHour && hour < courseEndHour;
    });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 1);
      } else {
        newDate.setDate(prev.getDate() + 1);
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
      navigateDay('next');
    } else if (isRightSwipe) {
      navigateDay('prev');
    }
  };

  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <div className="w-full max-w-4xl mx-auto mobile-padding py-4 sm:py-6 md:py-8 animate-fade-in">
      {/* Day Header */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDay('prev')}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-muted/50 transition-all duration-200 touch-target mobile-interactive"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              {currentDate.getFullYear()}
              {isToday && <span className="ml-2 text-primary font-semibold">Today</span>}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDay('next')}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-muted/50 transition-all duration-200 touch-target mobile-interactive"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>

      {/* Hour by Hour Schedule */}
      <div 
        className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 shadow-lg select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="space-y-2">
          {hours.map(hour => {
            const coursesForHour = getCoursesForHour(hour);
            const hasClasses = coursesForHour.length > 0;
            
            return (
              <div 
                key={hour}
                className={`flex border-b border-border/30 last:border-b-0 pb-4 last:pb-0 ${
                  hasClasses ? 'min-h-[80px]' : 'min-h-[60px]'
                }`}
              >
                {/* Time Column */}
                <div className="w-20 sm:w-24 flex-shrink-0 pt-2">
                  <div className="text-sm sm:text-base font-medium text-muted-foreground">
                    {formatHour(hour)}
                  </div>
                  <div className="text-xs text-muted-foreground/70">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                </div>
                
                {/* Content Column */}
                <div className="flex-1 pl-4 space-y-2">
                  {hasClasses ? (
                    coursesForHour.map(course => (
                      <div
                        key={course.id}
                        className={`p-3 rounded-lg border-l-4 bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-colors cursor-pointer ${
                          course.color === 'math' ? 'border-l-purple-500 bg-purple-500/10' :
                          course.color === 'science' ? 'border-l-blue-500 bg-blue-500/10' :
                          course.color === 'english' ? 'border-l-green-500 bg-green-500/10' :
                          course.color === 'history' ? 'border-l-orange-500 bg-orange-500/10' :
                          course.color === 'art' ? 'border-l-pink-500 bg-pink-500/10' :
                          'border-l-indigo-500 bg-indigo-500/10'
                        }`}
                        onClick={() => onEditCourse(course)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-foreground text-sm sm:text-base">
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
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{course.startTime} - {course.endTime}</span>
                          </div>
                          
                          {course.room && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{course.room}</span>
                            </div>
                          )}
                          
                          {course.professor && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{course.professor}</span>
                            </div>
                          )}
                          
                          {course.credits && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{course.credits} Credits</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-muted-foreground/50 text-sm">
                      No classes scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayView;
