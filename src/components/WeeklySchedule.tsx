import { useState, useEffect } from "react";
import { Course, DAYS } from "@/types/schedule";
import CourseCard from "@/components/CourseCard";

interface WeeklyScheduleProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

const WeeklySchedule = ({ courses, onEditCourse, onDeleteCourse }: WeeklyScheduleProps) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('schiedule-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
    return { showWeekends: true, compactView: false };
  });

  // Listen for settings changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('schiedule-settings');
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to load settings:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.day]) {
      acc[course.day] = [];
    }
    acc[course.day].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  // Sort courses by start time for each day
  Object.keys(groupedCourses).forEach(day => {
    groupedCourses[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  const dayNames = {
    monday: 'Mon',
    tuesday: 'Tue', 
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun'
  };

  const workDays = DAYS.slice(0, 5); // Monday to Friday

  return (
    <div className="w-full max-w-7xl mx-auto mobile-padding py-4 sm:py-6 md:py-8 animate-fade-in" aria-labelledby="schedule-heading">
      <h2 id="schedule-heading" className="sr-only">Weekly Schedule</h2>
      
      {/* Mobile: Horizontal scroll for days */}
      <div className="block sm:hidden mb-4">
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {workDays.map((day, index) => (
            <div key={day} className="flex-shrink-0 w-72 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}} role="region" aria-labelledby={`${day}-heading-mobile`}>
              {/* Day Header */}
              <div className="pb-3 border-b border-border/50">
                <h3 id={`${day}-heading-mobile`} className="text-responsive-base font-semibold capitalize text-foreground">
                  {dayNames[day]}
                </h3>
                <p className="text-responsive-xs text-muted-foreground">
                  {groupedCourses[day]?.length || 0} {groupedCourses[day]?.length === 1 ? 'class' : 'classes'}
                </p>
              </div>

              {/* Day's Courses */}
              <div className="space-y-3 min-h-[300px] pt-3">
                {groupedCourses[day]?.length > 0 ? (
                  <ul className="space-y-3" role="list" aria-label={`Courses for ${dayNames[day]}`}>
                    {groupedCourses[day].map((course) => (
                      <li key={course.id} role="listitem">
                        <CourseCard
                          course={course}
                          onEdit={onEditCourse}
                          onDelete={onDeleteCourse}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground text-responsive-xs bg-muted/20 rounded-xl border-2 border-dashed border-muted">
                    <p>No classes scheduled</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        {workDays.map((day, index) => (
          <div key={day} className="space-y-4 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}} role="region" aria-labelledby={`${day}-heading`}>
            {/* Day Header */}
            <div className="pb-3 border-b border-border/50">
              <h3 id={`${day}-heading`} className="text-responsive-base font-semibold capitalize text-foreground">
                {dayNames[day]}
              </h3>
              <p className="text-responsive-xs text-muted-foreground">
                {groupedCourses[day]?.length || 0} {groupedCourses[day]?.length === 1 ? 'class' : 'classes'}
              </p>
            </div>

            {/* Day's Courses */}
            <div className="space-y-3 min-h-[200px] md:min-h-[300px]">
              {groupedCourses[day]?.length > 0 ? (
                <ul className="space-y-3" role="list" aria-label={`Courses for ${dayNames[day]}`}>
                  {groupedCourses[day].map((course) => (
                    <li key={course.id} role="listitem">
                      <CourseCard
                        course={course}
                        onEdit={onEditCourse}
                        onDelete={onDeleteCourse}
                        className=""
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div 
                  className="h-24 md:h-32 rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center text-muted-foreground text-sm transition-colors hover:bg-muted/50"
                  role="status"
                  aria-label={`No classes scheduled for ${dayNames[day]}`}
                >
                  No classes
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Weekend Courses (if any) */}
      {settings.showWeekends && (groupedCourses.saturday?.length > 0 || groupedCourses.sunday?.length > 0) && (
        <div className="mt-16 pt-12 border-t-2 border-primary/20" role="region" aria-labelledby="weekend-heading">
          <h3 id="weekend-heading" className="text-2xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent text-center">
            Weekend Classes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
            {['saturday', 'sunday'].map((day) => (
              <div key={day} className="space-y-6" role="region" aria-labelledby={`weekend-${day}-heading`}>
                <div className="pb-4 border-b-2 border-primary/20">
                  <h4 id={`weekend-${day}-heading`} className="text-xl font-bold capitalize bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                    {dayNames[day as keyof typeof dayNames]}
                  </h4>
                </div>
                <div className="space-y-4">
                  {groupedCourses[day]?.length > 0 ? (
                    <ul className="space-y-4" role="list" aria-label={`Weekend courses for ${dayNames[day as keyof typeof dayNames]}`}>
                      {groupedCourses[day].map((course) => (
                        <li key={course.id} role="listitem">
                          <CourseCard
                            course={course}
                            onEdit={onEditCourse}
                            onDelete={onDeleteCourse}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div 
                      className="h-32 rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center text-muted-foreground text-sm font-medium transition-spring hover:border-primary/30"
                      role="status"
                      aria-label={`No classes scheduled for ${dayNames[day as keyof typeof dayNames]}`}
                    >
                      No classes
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklySchedule;