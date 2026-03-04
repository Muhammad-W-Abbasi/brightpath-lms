import { Megaphone } from "lucide-react";

type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";
type Course = {
  id: string;
  title: string;
  description?: string;
};

type AnnouncementsProps = {
  role: Role;
  courses: Course[];
};

export default function Announcements({ role, courses }: AnnouncementsProps) {
  const now = new Date();
  const items = courses.slice(0, 4).map((course, index) => ({
    id: `${course.id}-announcement-${index}`,
    title: course.title,
    message:
      role === "STUDENT"
        ? index % 2 === 0
          ? "New lecture uploaded for Module 3."
          : "Assignment instructions have been updated."
        : index % 2 === 0
        ? "New lecture uploaded for Module 3."
        : "Reminder: review submissions before Friday.",
    courseName: course.title,
    createdAt: new Date(now.getTime() - index * 1000 * 60 * 60 * 8).toLocaleDateString(),
  }));

  const fallback = [
    {
      id: "announcement-fallback",
      title: "Welcome to BrightPath LMS",
      message: "Announcements will appear here as your courses become active.",
      courseName: "System",
      createdAt: now.toLocaleDateString(),
    },
  ];

  return (
    <section className="bg-white border border-[#e4e4e7] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <Megaphone className="w-4 h-4 text-blue-600" />
        <h3 className="text-lg font-medium text-[#18181b]">Announcements</h3>
      </div>

      <div className="space-y-3">
        {(items.length ? items : fallback).map((item, idx, arr) => (
          <div
            key={item.id}
            className={`bg-white border border-[#e4e4e7] rounded-lg p-4 ${idx !== arr.length - 1 ? "" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-[#18181b]">{item.title}</p>
              <p className="text-xs text-[#a1a1aa]">{item.createdAt}</p>
            </div>
            <p className="text-xs text-blue-600 mt-1">{item.courseName}</p>
            <p className="text-sm text-[#71717a] mt-2">{item.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
