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

export type ToastState = {
  type: "success" | "error" | "info";
  message: string;
};
