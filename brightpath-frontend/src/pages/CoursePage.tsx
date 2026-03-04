import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import AnnouncementFeed from "../components/AnnouncementFeed";
import CreateAnnouncement from "../components/CreateAnnouncement";
import ClassListSidebar from "../components/ClassListSidebar";

const TOKEN_STORAGE_KEY = "token";

type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

type Course = {
  id: string;
  title: string;
  description?: string;
};

type PostPayload = {
  title: string;
  content: string;
};

function CoursePage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [authEmail, setAuthEmail] = useState<string>("");
  const [role, setRole] = useState<Role | null>(null);
  const [course, setCourse] = useState<Course | null>((location.state as any)?.course ?? null);
  const [posts, setPosts] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const courseId = params.id ?? "";
  const isInstructor = role === "INSTRUCTOR" || role === "ADMIN";

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      navigate("/dashboard");
      return;
    }

    axiosClient
      .get("/auth/me")
      .then((res) => {
        if (!res.data?.email || !res.data?.role) {
          navigate("/dashboard");
          return;
        }
        setAuthEmail(res.data.email);
        setRole(res.data.role as Role);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        navigate("/dashboard");
      });
  }, [navigate]);

  useEffect(() => {
    if (!authEmail || !courseId) {
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
  }, [authEmail, courseId, course, navigate]);

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

  if (!authEmail || !role || !course) {
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
            <Card className="bp-sidebar-card">
              <ClassListSidebar students={students} />
            </Card>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default CoursePage;
