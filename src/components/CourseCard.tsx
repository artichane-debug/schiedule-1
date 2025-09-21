import { useState, useEffect } from "react";
import { Clock, MapPin, User, Edit, Trash2 } from "lucide-react";
import { Course, COURSE_COLORS } from "@/types/schedule";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  className?: string;
}

const CourseCard = ({ course, onEdit, onDelete, className }: CourseCardProps) => {
  const [timeFormat, setTimeFormat] = useState('12');
  const colorClass = COURSE_COLORS[course.color];

  useEffect(() => {
    const saved = localStorage.getItem('schiedule-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setTimeFormat(settings.timeFormat || '12');
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    
    if (timeFormat === '24') {
      return `${hours}:${minutes}`;
    }
    
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Card 
      className={`group bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer mobile-interactive ${className}`}
      role="article"
      aria-labelledby={`course-title-${course.id}`}
      tabIndex={0}
    >
      <div className={`h-3 w-full ${colorClass} rounded-t-xl`} aria-hidden="true" />

      <div className="p-4 md:p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 space-y-1">
            <h4 id={`course-title-${course.id}`} className="text-sm md:text-base font-semibold leading-tight truncate text-foreground">
              {course.title}
            </h4>
            {course.credits && (
              <p className="text-xs text-muted-foreground">
                {course.credits} credits
              </p>
            )}
          </div>
          
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-3" role="group" aria-label="Course actions">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(course)}
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-xl focus:opacity-100 transition-all duration-200"
              aria-label={`Edit ${course.title}`}
            >
              <Edit className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(course.id)}
              className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400 rounded-xl focus:opacity-100 transition-all duration-200"
              aria-label={`Delete ${course.title}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="space-y-2" role="list" aria-label="Course details">
          <div className="flex items-center text-muted-foreground text-xs" role="listitem">
            <User className="h-3 w-3 mr-2 flex-shrink-0" aria-hidden="true" />
            <span className="truncate" aria-label={`Professor: ${course.professor}`}>{course.professor}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground text-xs" role="listitem">
            <MapPin className="h-3 w-3 mr-2 flex-shrink-0" aria-hidden="true" />
            <span className="truncate" aria-label={`Room: ${course.room}`}>{course.room}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground text-xs" role="listitem">
            <Clock className="h-3 w-3 mr-2 flex-shrink-0" aria-hidden="true" />
            <span aria-label={`Time: ${formatTime(course.startTime)} to ${formatTime(course.endTime)}`}>
              {formatTime(course.startTime)} - {formatTime(course.endTime)}
            </span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <span 
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${colorClass} text-white shadow-sm`}
            aria-label={`Category: ${course.color}`}
          >
            {course.color.charAt(0).toUpperCase() + course.color.slice(1)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;