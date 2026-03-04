import { Activity, CheckCircle2, GraduationCap } from "lucide-react";

type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

type Course = {
  id: string;
  title: string;
};

type RecentActivityProps = {
  role: Role;
  courses: Course[];
};

const icons = [Activity, CheckCircle2, GraduationCap];

export default function RecentActivity({ role, courses }: RecentActivityProps) {
  const items =
    courses.slice(0, 3).map((course, index) => ({
      id: `${course.id}-activity`,
      text:
        role === "STUDENT"
          ? index === 0
            ? `You submitted Assignment ${index + 1} in ${course.title}`
            : index === 1
            ? `You completed Module ${index + 3} in ${course.title}`
            : `New grade posted in ${course.title}`
          : index === 0
          ? `Student submission received in ${course.title}`
          : index === 1
          ? `Module completion increased in ${course.title}`
          : `New enrollment in ${course.title}`,
    })) || [];

  return (
    <section className="bg-white border border-[#e4e4e7] rounded-lg p-6">
      <h3 className="text-lg font-medium text-[#18181b]">Recent Activity</h3>

      <div className="mt-3 space-y-1">
        {(items.length ? items : [{ id: "empty", text: "No recent activity." }]).map((item, idx) => {
          const Icon = icons[idx % icons.length];
          return (
            <div key={item.id} className="flex gap-3 items-start text-sm py-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                <Icon className="w-4 h-4" />
              </span>
              <p className="text-[#52525b] leading-relaxed">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
