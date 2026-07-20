import { useEffect, useState } from "react";
import axiosClient, { clearToken } from "../api/axiosClient";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import AnnouncementFeed from "../components/AnnouncementFeed";
import CreateAnnouncement from "../components/CreateAnnouncement";
import JoinCodePanel from "../components/JoinCodePanel";
import InviteStudentForm from "../components/InviteStudentForm";
import StudentList from "../components/StudentList";
import ConfirmActionModal from "../components/ConfirmActionModal";
import Toast from "../components/Toast";
import CourseTasksPanel from "../components/tasks/CourseTasksPanel";
import CourseLessonsPanel from "../components/lessons/CourseLessonsPanel";
import type { AuthUser, Course, CourseOutline, CourseTask, CourseTaskInput, LessonDetail, LessonInput, ModuleInput, Post, Student, ToastState } from "../types";
import { getErrorMessage } from "../utils/api";

type CoursePageProps = {
  authUser: AuthUser | null;
  onAuthChange: (user: AuthUser | null) => void;
};

type PostPayload = {
  title: string;
  content: string;
};

type CourseTab = "lessons" | "announcements" | "assignments";

function CoursePage({ authUser, onAuthChange }: CoursePageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const navigationState = location.state as { course?: Course } | null;
  const [course, setCourse] = useState<Course | null>(navigationState?.course ?? null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tasks, setTasks] = useState<CourseTask[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [removingStudent, setRemovingStudent] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [activeTab, setActiveTab] = useState<CourseTab>("lessons");
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonDetail | null>(null);
  const [loadingOutline, setLoadingOutline] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [outlineError, setOutlineError] = useState<string | null>(null);
  const [lessonError, setLessonError] = useState<string | null>(null);

  const courseId = params.id ?? "";
  const role = authUser?.role ?? null;
  const authEmail = authUser?.email ?? "";
  const isInstructor = role === "INSTRUCTOR" || role === "ADMIN";

  useEffect(() => {
    if (!authUser?.role) {
      navigate("/dashboard");
      return;
    }

    if (!courseId) {
      return;
    }

    if (!course) {
      axiosClient
        .get(`/courses/${courseId}`)
        .then((res) => setCourse(res.data))
        .catch((error) => {
          alert(getErrorMessage(error, "Failed to load course"));
          navigate("/dashboard");
        });
    }
  }, [authUser?.role, courseId, course, navigate]);

  const loadPosts = async () => {
    if (!authEmail || !courseId) {
      return;
    }
    const res = await axiosClient.get(`/courses/${courseId}/posts`);
    setPosts(res.data);
  };

  const loadStudents = async () => {
    if (!authEmail || !courseId || !isInstructor) {
      return;
    }
    const res = await axiosClient.get(`/courses/${courseId}/students`);
    setStudents(res.data);
  };

  const loadTasks = async () => {
    if (!courseId) {
      return;
    }

    setLoadingTasks(true);
    try {
      const response = await axiosClient.get(`/courses/${courseId}/tasks`);
      setTasks(Array.isArray(response.data) ? response.data : []);
    } finally {
      setLoadingTasks(false);
    }
  };

  const loadOutline = async () => {
    if (!courseId) {
      return;
    }

    setLoadingOutline(true);
    setOutlineError(null);
    try {
      const response = await axiosClient.get(`/courses/${courseId}/modules`);
      setOutline(response.data as CourseOutline);
    } catch (error) {
      console.error(error);
      setOutlineError(getErrorMessage(error, "Failed to load course modules."));
    } finally {
      setLoadingOutline(false);
    }
  };

  const openLesson = async (lessonId: string) => {
    if (!lessonId) {
      return;
    }

    setLoadingLesson(true);
    setLessonError(null);
    try {
      const response = await axiosClient.get(`/courses/${courseId}/lessons/${lessonId}`);
      setSelectedLesson(response.data as LessonDetail);
    } catch (error) {
      console.error(error);
      setLessonError(getErrorMessage(error, "Failed to open lesson."));
    } finally {
      setLoadingLesson(false);
    }
  };

  useEffect(() => {
    if (!authEmail || !role) {
      return;
    }
    const load = async () => {
      const calls = [loadPosts(), loadTasks(), loadOutline()];
      if (isInstructor) {
        calls.push(loadStudents());
      }
      await Promise.allSettled(calls);
    };
    load();
  }, [authEmail, role, courseId, isInstructor]);

  useEffect(() => {
    if (!outline || selectedLesson || loadingLesson) {
      return;
    }

    const lessons = outline.modules.flatMap((module) => module.lessons);
    const nextLessonId = outline.nextLessonId ?? (lessons.length ? lessons[0].id : null);
    if (nextLessonId) {
      void openLesson(nextLessonId);
    }
  }, [outline, selectedLesson, loadingLesson]);

  const createAnnouncement = async (payload: PostPayload) => {
    await axiosClient.post(`/courses/${courseId}/posts`, payload);
    await loadPosts();
  };

  const createTask = async (input: CourseTaskInput) => {
    try {
      await axiosClient.post(`/courses/${courseId}/tasks`, input);
      await loadTasks();
      showToast("success", "Task created successfully.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to create task."));
      throw error;
    }
  };

  const updateTask = async (taskId: string, input: CourseTaskInput) => {
    try {
      await axiosClient.put(`/courses/${courseId}/tasks/${taskId}`, input);
      await loadTasks();
      showToast("success", "Task updated successfully.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to update task."));
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await axiosClient.delete(`/courses/${courseId}/tasks/${taskId}`);
      await loadTasks();
      showToast("success", "Task deleted successfully.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to delete task."));
      throw error;
    }
  };

  const toggleTaskCompletion = async (task: CourseTask, completed: boolean) => {
    try {
      const response = await axiosClient.put(`/courses/${courseId}/tasks/${task.id}/completion`, { completed });
      const updatedTask = response.data as CourseTask;
      setTasks((previousTasks) =>
        previousTasks.map((existingTask) => (existingTask.id === updatedTask.id ? updatedTask : existingTask))
      );
      showToast("success", completed ? "Task marked complete." : "Task marked incomplete.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to update task status."));
      throw error;
    }
  };

  const createModule = async (input: ModuleInput) => {
    try {
      await axiosClient.post(`/courses/${courseId}/modules`, input);
      await loadOutline();
      showToast("success", "Module created successfully.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to create module."));
      throw error;
    }
  };

  const updateModule = async (moduleId: string, input: ModuleInput) => {
    try {
      await axiosClient.put(`/courses/${courseId}/modules/${moduleId}`, input);
      await loadOutline();
      showToast("success", "Module updated successfully.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to update module."));
      throw error;
    }
  };

  const deleteModule = async (moduleId: string) => {
    try {
      await axiosClient.delete(`/courses/${courseId}/modules/${moduleId}`);
      setSelectedLesson((lesson) => {
        const deletedModule = outline?.modules.find((module) => module.id === moduleId);
        return deletedModule?.lessons.some((moduleLesson) => moduleLesson.id === lesson?.id) ? null : lesson;
      });
      await loadOutline();
      showToast("success", "Module deleted successfully.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to delete module."));
      throw error;
    }
  };

  const reorderModules = async (orderedIds: string[]) => {
    try {
      const response = await axiosClient.put(`/courses/${courseId}/modules/order`, { orderedIds });
      setOutline(response.data as CourseOutline);
      showToast("success", "Module order updated.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to reorder modules."));
      throw error;
    }
  };

  const createLesson = async (moduleId: string, input: LessonInput) => {
    try {
      await axiosClient.post(`/courses/${courseId}/modules/${moduleId}/lessons`, input);
      await loadOutline();
      showToast("success", "Lesson created successfully.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to create lesson."));
      throw error;
    }
  };

  const updateLesson = async (moduleId: string, lessonId: string, input: LessonInput) => {
    try {
      await axiosClient.put(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, input);
      await loadOutline();
      if (selectedLesson?.id === lessonId) {
        await openLesson(lessonId);
      }
      showToast("success", "Lesson updated successfully.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to update lesson."));
      throw error;
    }
  };

  const deleteLesson = async (moduleId: string, lessonId: string) => {
    try {
      await axiosClient.delete(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
      if (selectedLesson?.id === lessonId) {
        setSelectedLesson(null);
      }
      await loadOutline();
      showToast("success", "Lesson deleted successfully.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to delete lesson."));
      throw error;
    }
  };

  const reorderLessons = async (moduleId: string, orderedIds: string[]) => {
    try {
      const response = await axiosClient.put(`/courses/${courseId}/modules/${moduleId}/lessons/order`, { orderedIds });
      setOutline(response.data as CourseOutline);
      showToast("success", "Lesson order updated.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to reorder lessons."));
      throw error;
    }
  };

  const toggleLessonCompletion = async (lessonId: string, completed: boolean) => {
    try {
      const response = await axiosClient.put(`/courses/${courseId}/lessons/${lessonId}/completion`, { completed });
      setSelectedLesson(response.data as LessonDetail);
      await loadOutline();
      showToast("success", completed ? "Lesson marked complete." : "Lesson marked incomplete.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to update lesson progress."));
      throw error;
    }
  };

  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleRemoveStudent = async () => {
    if (!selectedStudent || removingStudent) {
      return;
    }

    setRemovingStudent(true);
    try {
      await axiosClient.delete(`/courses/${courseId}/students/${selectedStudent.id}`);
      setSelectedStudent(null);
      await loadStudents();
      showToast("success", "Student removed successfully.");
    } catch (error) {
      console.error(error);
      showToast("error", getErrorMessage(error, "Failed to remove student."));
    } finally {
      setRemovingStudent(false);
    }
  };

  if (!authUser?.role || !course) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center">
        <p className="text-sm text-[var(--muted)]">Loading classroom...</p>
      </div>
    );
  }

  return (
      <Layout
      role={role}
      email={authEmail}
      activeSection="my-courses"
      onNavigate={() => navigate("/dashboard")}
      onLogout={() => {
        clearToken();
        onAuthChange(null);
        navigate("/dashboard");
      }}
      title={course.title}
      subtitle="Course classroom"
    >
      <div className="bp-page">
        <div className="bp-actions-row">
          <button className="bp-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>

        <Card
          title={course.title}
          subtitle={course.description || "No course description"}
          className="bp-course-header-card"
        >
          <div className="grid gap-3">
            <p className="bp-muted">Structured lessons, classroom announcements, and course tasks.</p>
            {outline ? (
              <div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-[#18181b]">Lesson progress</span>
                  <span className="text-[#52525b]">
                    {outline.progress.completedLessons}/{outline.progress.totalLessons} complete
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e4e4e7]">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${outline.progress.percentComplete}%` }} />
                </div>
              </div>
            ) : null}
          </div>
        </Card>

        <div className="flex flex-wrap gap-2">
          {[
            { key: "lessons", label: "Lessons" },
            { key: "announcements", label: "Announcements" },
            { key: "assignments", label: "Assignments" },
          ].map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as CourseTab)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-blue-600 text-white" : "border border-[#e4e4e7] bg-white text-[#18181b] hover:bg-[#f8f9fb]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "lessons" ? (
          <CourseLessonsPanel
            role={role}
            outline={outline}
            selectedLesson={selectedLesson}
            loading={loadingOutline}
            loadingLesson={loadingLesson}
            error={outlineError}
            lessonError={lessonError}
            onReload={loadOutline}
            onOpenLesson={openLesson}
            onCreateModule={createModule}
            onUpdateModule={updateModule}
            onDeleteModule={deleteModule}
            onReorderModules={reorderModules}
            onCreateLesson={createLesson}
            onUpdateLesson={updateLesson}
            onDeleteLesson={deleteLesson}
            onReorderLessons={reorderLessons}
            onToggleCompletion={toggleLessonCompletion}
          />
        ) : activeTab === "announcements" ? (
          <section className="bp-classroom-layout">
            <div className="bp-feed-column">
              {isInstructor && (
                <Card>
                  <CreateAnnouncement onCreate={createAnnouncement} />
                </Card>
              )}
              <Card title="Announcements Feed" subtitle="Recent classroom updates">
                <AnnouncementFeed posts={posts} />
              </Card>
            </div>
            {isInstructor && (
              <div className="bp-feed-column">
                <Card className="bp-sidebar-card">
                  <JoinCodePanel
                    courseId={courseId}
                    onCodeUpdated={(_, meta) =>
                      showToast(meta?.copied ? "info" : "success", meta?.copied ? "Join code copied." : "New join code generated.")
                    }
                    onError={() => showToast("error", "Failed to update join code.")}
                  />
                </Card>

                <Card className="bp-sidebar-card">
                  <InviteStudentForm
                    courseId={courseId}
                    onInvited={async () => {
                      await loadStudents();
                      showToast("success", "Student invited successfully.");
                    }}
                    onError={() => showToast("error", "Failed to invite student.")}
                  />
                </Card>

                <Card className="bp-sidebar-card" title="Class List" subtitle="Manage enrolled students">
                  <StudentList students={students} onRemove={setSelectedStudent} />
                </Card>
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-6">
            <CourseTasksPanel
              role={role}
              tasks={tasks}
              loading={loadingTasks}
              courseScoped
              onCreate={isInstructor ? createTask : undefined}
              onUpdate={isInstructor ? updateTask : undefined}
              onDelete={isInstructor ? deleteTask : undefined}
              onToggleCompletion={!isInstructor ? toggleTaskCompletion : undefined}
            />
            {isInstructor ? (
              <Card
                title="Instructor Note"
                subtitle="These are lightweight reminders, not graded submissions."
              >
                <p className="text-sm text-[#52525b]">
                  Use this tab for reading reminders, prep work, and checklist-style tasks that students can mark complete for themselves.
                </p>
              </Card>
            ) : null}
          </section>
        )}
      </div>

      <ConfirmActionModal
        isOpen={Boolean(selectedStudent)}
        title="Remove student?"
        message={
          selectedStudent
            ? `This will remove ${selectedStudent.displayName || selectedStudent.email} from the course.`
            : ""
        }
        confirmLabel="Remove"
        loading={removingStudent}
        onConfirm={handleRemoveStudent}
        onCancel={() => setSelectedStudent(null)}
      />

      <Toast visible={Boolean(toast)} type={toast?.type} message={toast?.message} onClose={hideToast} />
    </Layout>
  );
}

export default CoursePage;
