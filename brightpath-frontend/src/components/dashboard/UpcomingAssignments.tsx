import { CheckCircle, ClipboardCheck } from "lucide-react";
import { useMemo, useState } from "react";

type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

type Course = {
  id: string;
  title: string;
};

type UpcomingAssignmentsProps = {
  role: Role;
  courses: Course[];
};

type AssignmentItem = {
  id: string;
  name: string;
  course: string;
  due: string;
};

export default function UpcomingAssignments({ role, courses }: UpcomingAssignmentsProps) {
  const assignments = useMemo<AssignmentItem[]>(
    () =>
      courses.slice(0, 4).map((course, index) => ({
        id: `${course.id}-assignment`,
        name: role === "STUDENT" ? `Assignment ${index + 1}` : `Review Queue ${index + 1}`,
        course: course.title,
        due: index === 0 ? "Due Tomorrow" : index === 1 ? "Due Friday" : "Due Next Week",
      })),
    [courses, role]
  );

  const fallback: AssignmentItem[] = [
    {
      id: "fallback-assignment",
      name: role === "STUDENT" ? "No upcoming assignments" : "No pending reviews",
      course: "-",
      due: "-",
    },
  ];

  const displayAssignments = assignments.length ? assignments : fallback;

  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleCompleted = (assignmentId: string) => {
    setCompleted((prev) => ({ ...prev, [assignmentId]: !prev[assignmentId] }));
  };

  const completedCount = assignments.reduce(
    (count, item) => (completed[item.id] ? count + 1 : count),
    0
  );

  return (
    <section className="bg-white border border-[#e4e4e7] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <ClipboardCheck className="w-4 h-4 text-blue-600" />
        <h3 className="text-lg font-medium text-[#18181b]">
          {role === "STUDENT" ? "Upcoming Assignments" : "Upcoming Reviews"}
        </h3>
      </div>

      {role !== "STUDENT" ? (
        <p className="text-xs text-[#71717a] mb-3">
          Completed: {completedCount}/{assignments.length}
        </p>
      ) : null}

      <div>
        {displayAssignments.map((assignment, idx) => (
          <div
            key={assignment.id}
            className={`flex items-center justify-between py-3 cursor-pointer ${
              idx !== displayAssignments.length - 1 ? "border-b border-[#f1f1f1]" : ""
            }`}
            onClick={() => toggleCompleted(assignment.id)}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleCompleted(assignment.id);
                }}
                className="mt-0.5 text-blue-600"
              >
                <CheckCircle
                  className={`w-4 h-4 ${
                    completed[assignment.id] ? "fill-blue-600 text-blue-600" : "text-[#a1a1aa]"
                  }`}
                />
              </button>

              <div>
                <p
                  className={`text-sm font-medium ${
                    completed[assignment.id] ? "text-[#71717a] line-through" : "text-[#18181b]"
                  }`}
                >
                  {assignment.name}
                </p>
                <p className="text-sm text-[#71717a] mt-1">{assignment.course}</p>
              </div>
            </div>

            <p className="text-xs text-[#71717a]">{assignment.due}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
