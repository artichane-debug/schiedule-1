import { useState, useEffect } from "react";
import { Course, DAYS, SEMESTERS } from "@/types/schedule";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Partial<Course>) => void;
  editingCourse?: Course | null;
  currentYear: string;
  currentSemester: string;
}

const CourseModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingCourse,
  currentYear,
  currentSemester 
}: CourseModalProps) => {
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    professor: '',
    room: '',
    startTime: '',
    endTime: '',
    day: 'monday',
    color: 'math',
    year: currentYear,
    semester: currentSemester as 'ganjil' | 'genap',
    credits: 3,
  });

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        ...editingCourse,
        year: currentYear,
        semester: currentSemester as 'ganjil' | 'genap',
      });
    } else {
      setFormData({
        title: '',
        professor: '',
        room: '',
        startTime: '',
        endTime: '',
        day: 'monday',
        color: 'math',
        year: currentYear,
        semester: currentSemester as 'ganjil' | 'genap',
        credits: 3,
      });
    }
  }, [editingCourse, currentYear, currentSemester]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.professor && formData.room && formData.startTime && formData.endTime) {
      onSave(formData);
      onClose();
    }
  };

  const updateField = (field: keyof Course, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const colorOptions = [
    { value: 'math', label: 'Math', color: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600' },
    { value: 'science', label: 'Science', color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600' },
    { value: 'english', label: 'English', color: 'bg-green-500', gradient: 'from-green-500 to-green-600' },
    { value: 'history', label: 'History', color: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600' },
    { value: 'art', label: 'Art', color: 'bg-pink-500', gradient: 'from-pink-500 to-pink-600' },
    { value: 'cs', label: 'Computer Science', color: 'bg-indigo-500', gradient: 'from-indigo-500 to-indigo-600' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] mx-auto rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl animate-scale-in overflow-y-auto modal-scroll">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-responsive-lg font-bold text-foreground flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
              <Save className="h-4 w-4 text-white" />
            </div>
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-foreground">Course Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. Introduction to Computer Science"
              className="rounded-xl border border-border/50 bg-background/50 hover:bg-background focus:bg-background focus:border-primary/50 transition-all duration-200 touch-target text-responsive-sm backdrop-blur-sm"
              required
            />
          </div>

          {/* Professor and Room */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professor" className="text-sm font-medium text-foreground">Professor</Label>
              <Input
                id="professor"
                value={formData.professor}
                onChange={(e) => updateField('professor', e.target.value)}
                placeholder="Dr. Smith"
                className="rounded-xl border border-border/50 bg-background/50 hover:bg-background focus:bg-background focus:border-primary/50 transition-all duration-200 touch-target text-responsive-sm backdrop-blur-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room" className="text-sm font-medium text-foreground">Room</Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) => updateField('room', e.target.value)}
                placeholder="Room 101"
                className="rounded-xl border border-border/50 bg-background/50 hover:bg-background focus:bg-background focus:border-primary/50 transition-all duration-200 touch-target text-responsive-sm backdrop-blur-sm"
                required
              />
            </div>
          </div>

          {/* Time and Day */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-xs md:text-sm font-medium">Start</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => updateField('startTime', e.target.value)}
                className="rounded-md md:rounded-lg border transition-smooth focus:shadow-soft h-9 md:h-10 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-xs md:text-sm font-medium">End</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => updateField('endTime', e.target.value)}
                className="rounded-md md:rounded-lg border transition-smooth focus:shadow-soft h-9 md:h-10 text-sm"
                required
              />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="day" className="text-xs md:text-sm font-medium">Day</Label>
              <Select value={formData.day} onValueChange={(value) => updateField('day', value)}>
                <SelectTrigger className="rounded-md md:rounded-lg border transition-smooth h-9 md:h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-md md:rounded-lg border">
                  {DAYS.map((day) => (
                    <SelectItem key={day} value={day} className="rounded-sm md:rounded-md capitalize text-sm">
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color and Credits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="color" className="text-xs md:text-sm font-medium">Category</Label>
              <Select value={formData.color} onValueChange={(value) => updateField('color', value)}>
                <SelectTrigger className="rounded-md md:rounded-lg border transition-smooth h-9 md:h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-md shadow-xl">
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="rounded-lg text-sm hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${option.color} shadow-sm`} />
                        <span className="text-sm text-foreground">{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits" className="text-xs md:text-sm font-medium">Credits</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => updateField('credits', parseInt(e.target.value))}
                className="rounded-md md:rounded-lg border transition-smooth focus:shadow-soft h-9 md:h-10 text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-border/50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="rounded-xl border border-border/50 bg-background/50 hover:bg-muted/50 text-foreground transition-all duration-200 touch-target"
              size="default"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl touch-target"
              size="default"
            >
              {editingCourse ? 'Update' : 'Add'} Course
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseModal;