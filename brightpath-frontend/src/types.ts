export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export type AuthUser = {
  email: string;
  role: Role;
};

export type Course = {
  id: string;
  title: string;
  description?: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
};

export type Student = {
  id: string;
  email: string;
  displayName: string;
  role: Role;
};

export type CourseTask = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description?: string | null;
  dueAt?: string | null;
  createdAt: string;
  completed: boolean;
  completionCount: number;
};

export type CourseTaskInput = {
  title: string;
  description?: string | null;
  dueAt?: string | null;
};

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type LessonSummary = {
  id: string;
  moduleId: string;
  title: string;
  description?: string | null;
  estimatedMinutes?: number | null;
  resourceUrl?: string | null;
  sortOrder: number;
  status: ContentStatus;
  completed: boolean;
  updatedAt: string;
};

export type CourseModule = {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  sortOrder: number;
  status: ContentStatus;
  lessons: LessonSummary[];
  updatedAt: string;
};

export type CourseProgress = {
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
};

export type CourseOutline = {
  courseId: string;
  progress: CourseProgress;
  nextLessonId?: string | null;
  modules: CourseModule[];
};

export type LessonDetail = {
  id: string;
  courseId: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  description?: string | null;
  content: string;
  estimatedMinutes?: number | null;
  resourceUrl?: string | null;
  sortOrder: number;
  status: ContentStatus;
  completed: boolean;
  previousLessonId?: string | null;
  nextLessonId?: string | null;
  updatedAt: string;
};

export type ModuleInput = {
  title: string;
  description?: string | null;
  status: ContentStatus;
};

export type LessonInput = {
  title: string;
  description?: string | null;
  content?: string | null;
  estimatedMinutes?: number | null;
  resourceUrl?: string | null;
  status: ContentStatus;
};

export type ToastState = {
  type: "success" | "error" | "info";
  message: string;
};
