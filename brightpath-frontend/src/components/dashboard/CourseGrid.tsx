import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

type Course = {
  id: string;
  title: string;
  description?: string;
};

type CourseGridProps = {
  courses: Course[];
  role: Role;
  onOpenCourse: (courseId: string) => void;
};

function deriveMetadata(course: Course, index: number) {
  const seed = Array.from(course.id).reduce((acc, char) => acc + char.charCodeAt(0), 0) + index * 13;
  return {
    lastAccessed: index % 2 === 0 ? "Yesterday" : `${(index % 4) + 2} days ago`,
    modules: 6 + (seed % 6),
    assignmentsDue: seed % 3,
  };
}

export default function CourseGrid({ courses, role, onOpenCourse }: CourseGridProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-blue-600" />
        <h3 className="text-lg font-medium text-[#18181b]">My Courses</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => {
          const metadata = deriveMetadata(course, index);

          return (
            <motion.article
              key={course.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              whileHover={{ y: -2, boxShadow: "0 10px 20px rgba(24,24,27,0.06)" }}
              className="bg-white border border-[#e4e4e7] rounded-lg p-6 hover:shadow-md transition cursor-pointer"
              onClick={() => onOpenCourse(course.id)}
            >
              <p className="text-base font-medium text-[#18181b]">{course.title}</p>
              <p className="text-sm text-[#71717a] mt-1">
                Instructor: {role === "STUDENT" ? "Course Team" : "You"}
              </p>

              <div className="mt-5 space-y-1">
                <p className="text-sm text-[#52525b]">Last accessed: {metadata.lastAccessed}</p>
                <p className="text-sm text-[#52525b]">Modules: {metadata.modules}</p>
                <p className="text-sm text-[#52525b]">Assignments due: {metadata.assignmentsDue}</p>
              </div>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenCourse(course.id);
                }}
                className="mt-4 text-blue-600 text-sm hover:underline"
              >
                Open Course
              </button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
