import { ClipboardCheck } from "lucide-react";
import CourseTasksPanel from "../tasks/CourseTasksPanel";
import type { CourseTask, Role } from "../../types";

type UpcomingAssignmentsProps = {
  role: Role;
  tasks: CourseTask[];
  loading?: boolean;
  onToggleCompletion?: (task: CourseTask, completed: boolean) => Promise<void>;
};

export default function UpcomingAssignments({ role, tasks, loading = false, onToggleCompletion }: UpcomingAssignmentsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardCheck className="w-4 h-4 text-blue-600" />
        <h3 className="text-lg font-medium text-[#18181b]">
          {role === "STUDENT" ? "Upcoming Assignments" : "Course Tasks"}
        </h3>
      </div>
      <CourseTasksPanel
        role={role}
        tasks={tasks}
        loading={loading}
        showHeader={false}
        onToggleCompletion={onToggleCompletion}
      />
    </section>
  );
}
