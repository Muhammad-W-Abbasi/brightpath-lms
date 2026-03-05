import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
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

const TOKEN_STORAGE_KEY = "token";

type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";
type AuthUser = {
  email: string;
  role: Role;
};
type CoursePageProps = {
  authUser: AuthUser | null;
  onAuthChange: (user: AuthUser | null) => void;
};

type Course = {
  id: string;
  title: string;
  description?: string;
};

type PostPayload = {
  title: string;
  content: string;
};

function CoursePage({ authUser, onAuthChange }: CoursePageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [course, setCourse] = useState<Course | null>((location.state as any)?.course ?? null);
  const [posts, setPosts] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [removingStudent, setRemovingStudent] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

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
        .catch(() => {
          alert("Failed to load course");
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

  useEffect(() => {
    if (!authEmail || !role) {
      return;
    }
    const load = async () => {
      const calls = [loadPosts()];
      if (isInstructor) {
        calls.push(loadStudents());
      }
      await Promise.allSettled(calls);
    };
    load();
  }, [authEmail, role, courseId, isInstructor]);

  const createAnnouncement = async (payload: PostPayload) => {
    await axiosClient.post(`/courses/${courseId}/posts`, payload);
    await loadPosts();
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
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to remove student.");
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
        localStorage.removeItem(TOKEN_STORAGE_KEY);
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
          <p className="bp-muted">Classroom announcements and updates</p>
        </Card>

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
