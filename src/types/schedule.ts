export interface Course {
  id: string;
  title: string;
  professor: string;
  room: string;
  startTime: string;
  endTime: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  color: 'math' | 'science' | 'english' | 'history' | 'art' | 'cs';
  year: string;
  semester: 'ganjil' | 'genap';
  credits?: number;
}

export interface ScheduleData {
  courses: Course[];
  currentYear: string;
  currentSemester: 'ganjil' | 'genap';
}

export const COURSE_COLORS = {
  math: 'course-math',
  science: 'course-science', 
  english: 'course-english',
  history: 'course-history',
  art: 'course-art',
  cs: 'course-cs'
} as const;

export const DAYS = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const;

export const SEMESTERS = [
  'fall',
  'spring', 
  'summer'
] as const;