import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Card from "../components/Card";
import AppShell from "../components/app/AppShell";
import SectionHeader from "../components/app/SectionHeader";
import EmptyState from "../components/dashboard/EmptyState";
import Announcements from "../components/dashboard/Announcements";
import CourseGrid from "../components/dashboard/CourseGrid";
import UpcomingAssignments from "../components/dashboard/UpcomingAssignments";
import RecentActivity from "../components/dashboard/RecentActivity";

type Role = "" | "ADMIN" | "INSTRUCTOR" | "STUDENT";
type NavKey = "dashboard" | "courses" | "students" | "assignments" | "reports" | "settings";

type Course = {
  id: string;
  title: string;
  description?: string;
};

const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL ?? "instructor@brightpath.com";
const TOKEN_STORAGE_KEY = "token";

function Dashboard() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("");
  const [loading, setLoading] = useState(false);

  const [activeSection, setActiveSection] = useState<NavKey>("dashboard");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const isInstructor = role === "INSTRUCTOR" || role === "ADMIN";

  const loadCourses = async (userRole: Role) => {
    if (!userRole) {
      return;
    }

    setLoadingCourses(true);
    try {
      const endpoint = userRole === "STUDENT" ? "/courses/enrolled" : "/courses/instructor";
      const res = await axiosClient.get(endpoint);
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  const login = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const loginResponse = await axiosClient.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const token = loginResponse?.data?.token;
      if (!token) {
        throw new Error("Login response did not include a token.");
      }

      localStorage.setItem(TOKEN_STORAGE_KEY, token);

      const meResponse = await axiosClient.get("/auth/me");
      const nextRole = meResponse.data.role as Role;
      setRole(nextRole);
      if (meResponse.data.email) {
        setEmail(meResponse.data.email);
      }

      setPassword("");
      setActiveSection("dashboard");
      await loadCourses(nextRole);
    } catch (err: any) {
      console.error(err);
      alert(
        "Login failed: " +
          (err.response ? `${err.response.status} ${JSON.stringify(err.response.data)}` : err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setRole("");
    setActiveSection("dashboard");
    setCourses([]);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const openCourse = (courseId: string) => {
    const course = courses.find((item) => item.id === courseId);
    navigate(`/course/${courseId}`, { state: { course } });
  };

  const createCourse = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) {
      return;
    }

    try {
      await axiosClient.post("/courses", {
        title: newCourseTitle.trim(),
        description: newCourseDescription.trim(),
      });
      setNewCourseTitle("");
      setNewCourseDescription("");
      await loadCourses(role);
    } catch (err) {
      console.error(err);
      alert("Failed to create course");
    }
  };

  const joinCourse = async (e: FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      return;
    }

    try {
      await axiosClient.post("/courses/join", { joinCode: joinCode.trim() });
      setJoinCode("");
      await loadCourses(role);
    } catch (err) {
      console.error(err);
      alert("Failed to join course");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      return;
    }

    axiosClient
      .get("/auth/me")
      .then(async (res) => {
        const nextRole = res.data.role as Role;
        setRole(nextRole);
        if (res.data.email) {
          setEmail(res.data.email);
        }
        await loadCourses(nextRole);
      })
      .catch(() => localStorage.removeItem(TOKEN_STORAGE_KEY));
  }, []);

  if (!role) {
    return (
      <div className="bp-login-wrapper">
        <Card className="bp-login-card" title="BrightPath LMS" subtitle="Sign in to continue">
          <form
            className="bp-form"
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <label className="bp-label">
              Email
              <input
                placeholder="instructor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="bp-input"
              />
            </label>

            <label className="bp-label">
              Password
              <input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="bp-input"
              />
            </label>

            <button
              type="submit"
              className="bp-btn bp-btn-primary inline-flex items-center justify-center gap-2 min-w-[120px]"
              disabled={loading}
              aria-busy={loading}
              aria-disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                    aria-hidden="true"
                  />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>
        </Card>
      </div>
    );
  }

  const pageTitle =
    activeSection === "dashboard"
      ? "Dashboard"
      : activeSection === "courses"
      ? "Courses"
      : activeSection === "students"
      ? "Students"
      : activeSection === "assignments"
      ? "Assignments"
      : activeSection === "reports"
      ? "Reports"
      : "Settings";

  return (
    <AppShell
      activeSection={activeSection}
      onNavigate={(section) => setActiveSection(section)}
      title={pageTitle}
      email={email}
      onLogout={logout}
    >
      {activeSection === "dashboard" ? (
        <>
          <SectionHeader
            title="Dashboard"
            subtitle="Your courses, announcements, and upcoming work."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Announcements
                role={role as "ADMIN" | "INSTRUCTOR" | "STUDENT"}
                courses={courses}
              />

              {loadingCourses ? (
                <p className="text-sm text-[#71717a]">Loading courses...</p>
              ) : courses.length ? (
                <CourseGrid
                  courses={courses}
                  role={role as "ADMIN" | "INSTRUCTOR" | "STUDENT"}
                  onOpenCourse={openCourse}
                />
              ) : (
                <EmptyState
                  title="No courses yet"
                  description={
                    isInstructor
                      ? "Create your first course to start teaching students."
                      : "Join your first course to begin learning."
                  }
                />
              )}
            </div>

            <div className="space-y-8">
              <UpcomingAssignments
                role={role as "ADMIN" | "INSTRUCTOR" | "STUDENT"}
                courses={courses}
              />
              <RecentActivity role={role as "ADMIN" | "INSTRUCTOR" | "STUDENT"} courses={courses} />
            </div>
          </div>
        </>
      ) : null}

      {activeSection === "courses" ? (
        <>
          <SectionHeader
            title="Courses"
            subtitle={isInstructor ? "Create and manage your courses." : "Join and browse your course list."}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {isInstructor ? (
              <form
                onSubmit={createCourse}
                className="bg-white border border-[#e4e4e7] rounded-lg p-6 shadow-sm space-y-3"
              >
                <h3 className="text-lg font-medium text-[#18181b]">Create Course</h3>
                <input
                  className="h-10 border border-[#e4e4e7] rounded-md px-3 bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Course title"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                />
                <input
                  className="h-10 border border-[#e4e4e7] rounded-md px-3 bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Description"
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 px-4">
                  Create Course
                </button>
              </form>
            ) : null}

            <form onSubmit={joinCourse} className="bg-white border border-[#e4e4e7] rounded-lg p-6 shadow-sm space-y-3">
              <h3 className="text-lg font-medium text-[#18181b]">Join Course</h3>
              <input
                className="h-10 border border-[#e4e4e7] rounded-md px-3 bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Enter join code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 px-4">
                Join Course
              </button>
            </form>
          </div>

          {loadingCourses ? (
            <p className="text-sm text-[#71717a]">Loading courses...</p>
          ) : courses.length ? (
            <CourseGrid
              courses={courses}
              role={role as "ADMIN" | "INSTRUCTOR" | "STUDENT"}
              onOpenCourse={openCourse}
            />
          ) : (
            <EmptyState
              title="No courses yet"
              description="Create your first course to start teaching students."
            />
          )}
        </>
      ) : null}

      {activeSection === "students" ? (
        <>
          <SectionHeader
            title="Students"
            subtitle={
              isInstructor
                ? "Manage enrollment and monitor classroom participation."
                : "View your class peers and participation updates."
            }
          />
          <EmptyState
            title={isInstructor ? "Student management" : "Student directory"}
            description={
              isInstructor
                ? "Open a course to view and manage enrolled students in detail."
                : "Open a course to see classmates and collaborative activity."
            }
          />
        </>
      ) : null}

      {activeSection === "assignments" ? (
        <>
          <SectionHeader
            title="Assignments"
            subtitle={
              isInstructor
                ? "Review assignment pipeline and grading workload."
                : "Track deadlines, submissions, and grading status."
            }
          />
          <UpcomingAssignments
            role={role as "ADMIN" | "INSTRUCTOR" | "STUDENT"}
            courses={courses}
          />
        </>
      ) : null}

      {activeSection === "reports" ? (
        <>
          <SectionHeader
            title="Reports"
            subtitle={
              isInstructor
                ? "Analyze course engagement and progression."
                : "View your learning progress across courses."
            }
          />
          <RecentActivity role={role as "ADMIN" | "INSTRUCTOR" | "STUDENT"} courses={courses} />
        </>
      ) : null}

      {activeSection === "settings" ? (
        <>
          <SectionHeader title="Settings" subtitle="Manage account preferences and platform options." />
          <div className="bg-white border border-[#e4e4e7] rounded-lg p-6 shadow-sm">
            <p className="text-sm text-[#52525b]">Signed in as {email}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-4 border border-[#e4e4e7] bg-white hover:bg-gray-50 rounded-md h-10 px-4 text-sm text-[#18181b]"
            >
              Logout
            </button>
          </div>
        </>
      ) : null}
    </AppShell>
  );
}

export default Dashboard;
