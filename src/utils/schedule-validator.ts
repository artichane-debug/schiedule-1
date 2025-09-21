/**
 * 📋 Schedule Validation System
 * Simple but important validation logic for course scheduling
 */

export interface Course {
  id: string;
  title: string;
  professor: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
  credits: number;
}

export class ScheduleValidator {
  
  /**
   * Check if course time is valid (not in the past, reasonable hours)
   */
  static validateCourseTime(course: Course): boolean {
    const start = parseInt(course.startTime.split(':')[0]);
    const end = parseInt(course.endTime.split(':')[0]);
    
    // Must be between 7 AM and 10 PM
    if (start < 7 || end > 22) return false;
    
    // End time must be after start time
    if (end <= start) return false;
    
    return true;
  }

  /**
   * Check if professor has scheduling conflicts
   */
  static checkProfessorConflicts(courses: Course[], newCourse: Course): boolean {
    return courses.some(course => 
      course.professor === newCourse.professor &&
      course.day === newCourse.day &&
      this.timeOverlaps(course, newCourse)
    );
  }

  /**
   * Check if room is available
   */
  static checkRoomAvailability(courses: Course[], newCourse: Course): boolean {
    return !courses.some(course =>
      course.room === newCourse.room &&
      course.day === newCourse.day &&
      this.timeOverlaps(course, newCourse)
    );
  }

  /**
   * Validate course credits (1-6 credits typical)
   */
  static validateCredits(course: Course): boolean {
    return course.credits >= 1 && course.credits <= 6;
  }

  /**
   * Check if course title is not empty and reasonable length
   */
  static validateCourseTitle(course: Course): boolean {
    return course.title.length >= 3 && course.title.length <= 100;
  }

  /**
   * Helper: Check if two courses have overlapping times
   */
  private static timeOverlaps(course1: Course, course2: Course): boolean {
    const start1 = this.timeToMinutes(course1.startTime);
    const end1 = this.timeToMinutes(course1.endTime);
    const start2 = this.timeToMinutes(course2.startTime);
    const end2 = this.timeToMinutes(course2.endTime);

    return start1 < end2 && start2 < end1;
  }

  /**
   * Helper: Convert time string to minutes since midnight
   */
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Run all validations on a course
   */
  static validateCourse(courses: Course[], newCourse: Course): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!this.validateCourseTime(newCourse)) {
      errors.push('Invalid course time - must be between 7 AM and 10 PM');
    }

    if (!this.validateCredits(newCourse)) {
      errors.push('Invalid credits - must be between 1 and 6');
    }

    if (!this.validateCourseTitle(newCourse)) {
      errors.push('Invalid course title - must be 3-100 characters');
    }

    if (this.checkProfessorConflicts(courses, newCourse)) {
      errors.push('Professor has scheduling conflict');
    }

    if (!this.checkRoomAvailability(courses, newCourse)) {
      errors.push('Room is not available at this time');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate total credits for a semester
   */
  static calculateTotalCredits(courses: Course[]): number {
    return courses.reduce((total, course) => total + course.credits, 0);
  }

  /**
   * Check if student is taking too many credits (over 18 is typically overload)
   */
  static checkCreditOverload(courses: Course[]): boolean {
    return this.calculateTotalCredits(courses) > 18;
  }

  /**
   * Find gaps in schedule (free time between classes)
   */
  static findScheduleGaps(courses: Course[], day: string): Array<{start: string, end: string}> {
    const dayCourses = courses
      .filter(course => course.day === day)
      .sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime));

    const gaps: Array<{start: string, end: string}> = [];
    
    for (let i = 0; i < dayCourses.length - 1; i++) {
      const currentEnd = dayCourses[i].endTime;
      const nextStart = dayCourses[i + 1].startTime;
      
      if (this.timeToMinutes(nextStart) - this.timeToMinutes(currentEnd) > 30) {
        gaps.push({ start: currentEnd, end: nextStart });
      }
    }

    return gaps;
  }
}
