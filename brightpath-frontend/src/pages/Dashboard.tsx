import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient, { clearToken, setToken } from "../api/axiosClient";
import Card from "../components/Card";
import AppShell from "../components/app/AppShell";
import SectionHeader from "../components/app/SectionHeader";
import EmptyState from "../components/dashboard/EmptyState";
import Announcements from "../components/dashboard/Announcements";
import CourseGrid from "../components/dashboard/CourseGrid";
import UpcomingAssignments from "../components/dashboard/UpcomingAssignments";
import RecentActivity from "../components/dashboard/RecentActivity";
import type { AuthUser, Course, CourseTask, Role } from "../types";
import { getErrorMessage } from "../utils/api";

type DashboardRole = Role | "";
type NavKey = "dashboard" | "courses" | "students" | "assignments" | "reports" | "settings";

type DashboardProps = {
  authUser: AuthUser | null;
  onAuthChange: (user: AuthUser | null) => void;
};

const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL ?? "instructor@brightpath.com";
type DemoSelection = "" | "instructor" | "student";
const DEMO_PASSWORD_MASK = "••••••••••••";
const DEFAULT_DEMO_SELECTION: DemoSelection = DEMO_EMAIL === "student1@brightpath.com" ? "student" : "instructor";
const DEMO_ROLE_DETAILS: Record<Exclude<DemoSelection, "">, { title: string; description: string; bullets: string[] }> = {
  instructor: {
    title: "Instructor Demo",
    description: "Explore course setup, announcements, join codes, class lists, and reminder tasks.",
    bullets: ["Manage two seeded courses", "Post announcements", "Review enrolled students"],
  },
  student: {
    title: "Student Demo",
    description: "Explore enrolled courses, course announcements, and task completion tracking.",
    bullets: ["Open Math 101", "Track course reminders", "Mark tasks complete"],
  },
};

function Dashboard({ authUser, onAuthChange }: DashboardProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState(authUser?.email ?? DEMO_EMAIL);
  const [password, setPassword] = useState("");
  const [demoSelection, setDemoSelection] = useState<DemoSelection>(authUser ? "" : DEFAULT_DEMO_SELECTION);
  const [role, setRole] = useState<DashboardRole>(authUser?.role ?? "");
  const [loading, setLoading] = useState(false);

  const [activeSection, setActiveSection] = useState<NavKey>("dashboard");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [tasks, setTasks] = useState<CourseTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const isInstructor = role === "INSTRUCTOR" || role === "ADMIN";
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredCourses = normalizedSearchQuery
    ? courses.filter((course) =>
        [course.title, course.description]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedSearchQuery))
      )
    : courses;
  const filteredTasks = normalizedSearchQuery
    ? tasks.filter((task) =>
        [task.title, task.description, task.courseTitle]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedSearchQuery))
      )
    : tasks;

  const loadCourses = async (userRole: DashboardRole) => {
    if (!userRole) {
      return;
    }

    setLoadingCourses(true);
    try {
      const endpoint = userRole === "STUDENT" ? "/courses/enrolled" : "/courses/instructor";
      const res = await axiosClient.get(endpoint);
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to load courses"));
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await axiosClient.get("/tasks");
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to load assignments"));
    } finally {
      setLoadingTasks(false);
    }
  };

  const toggleTaskCompletion = async (task: CourseTask, completed: boolean) => {
    try {
      const response = await axiosClient.put(`/courses/${task.courseId}/tasks/${task.id}/completion`, { completed });
      const updatedTask = response.data as CourseTask;
      setTasks((previousTasks) =>
        previousTasks.map((existingTask) => (existingTask.id === updatedTask.id ? updatedTask : existingTask))
      );
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to update assignment status"));
    }
  };

  const finalizeLogin = async (token: string) => {
    setToken(token);

    const meResponse = await axiosClient.get("/auth/me");
    const nextRole = meResponse.data.role as DashboardRole;
    setRole(nextRole);
    if (meResponse.data.email) {
      setEmail(meResponse.data.email);
      onAuthChange({
        email: meResponse.data.email,
        role: nextRole as AuthUser["role"],
      });
    }

    setPassword("");
    setActiveSection("dashboard");
    await Promise.all([loadCourses(nextRole), loadTasks()]);
  };

  const login = async () => {
    if (loading) {
      return;
    }

    if (demoSelection && password === DEMO_PASSWORD_MASK) {
      await loginWithDemo();
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

      await finalizeLogin(token);
    } catch (error) {
      console.error(error);
      alert(`Login failed: ${getErrorMessage(error, "Unable to reach the backend")}`);
    } finally {
      setLoading(false);
    }
  };

  const loginWithDemo = async (selectionOverride?: DemoSelection) => {
    const selectedDemo = selectionOverride || demoSelection;
    if (loading || !selectedDemo) {
      return;
    }

    setLoading(true);
    try {
      const selectedRole = selectedDemo === "student" ? "STUDENT" : "INSTRUCTOR";
      const response = await axiosClient.post("/auth/demo-login", {
        role: selectedRole,
      });
      const token = response?.data?.token;
      if (!token) {
        throw new Error("Demo login response did not include a token.");
      }

      await finalizeLogin(token);
    } catch (error) {
      console.error(error);
      alert(`Demo login failed: ${getErrorMessage(error, "Unable to reach the backend")}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setRole("");
    setActiveSection("dashboard");
    setCourses([]);
    setTasks([]);
    clearToken();
    onAuthChange(null);
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
      await Promise.all([loadCourses(role), loadTasks()]);
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to create course"));
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
      await Promise.all([loadCourses(role), loadTasks()]);
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to join course"));
    }
  };

  const handleDemoSelection = (selection: DemoSelection) => {
    setDemoSelection(selection);
    if (selection === "instructor") {
      setEmail("instructor@brightpath.com");
      setPassword(DEMO_PASSWORD_MASK);
      return;
    }

    if (selection === "student") {
      setEmail("student1@brightpath.com");
      setPassword(DEMO_PASSWORD_MASK);
      return;
    }

    setPassword("");
  };

  const startQuickDemo = async (selection: Exclude<DemoSelection, "">) => {
    handleDemoSelection(selection);
    await loginWithDemo(selection);
  };

  useEffect(() => {
    if (!authUser?.role) {
      setRole("");
      setCourses([]);
      setTasks([]);
      if (!authUser) {
        setEmail(DEMO_EMAIL);
        setDemoSelection(DEFAULT_DEMO_SELECTION);
        setPassword(DEMO_PASSWORD_MASK);
      }
      return;
    }

    setRole(authUser.role);
    setEmail(authUser.email);
    void Promise.all([loadCourses(authUser.role), loadTasks()]);
  }, [authUser?.email, authUser?.role]);

  if (!role) {
    return (
      <div className="bp-login-wrapper">
        <Card className="bp-login-card" title="BrightPath LMS" subtitle="Sign in to continue">
          <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-950">Quick Demo</p>
            <p className="mt-1 text-sm leading-relaxed text-blue-900">
              Enter with seeded demo data. Demo records may reset between sessions.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(Object.keys(DEMO_ROLE_DETAILS) as Exclude<DemoSelection, "">[]).map((selection) => {
                const detail = DEMO_ROLE_DETAILS[selection];
                return (
                  <button
                    key={selection}
                    type="button"
                    onClick={() => startQuickDemo(selection)}
                    disabled={loading}
                    className="rounded-lg border border-blue-200 bg-white p-3 text-left shadow-sm transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="text-sm font-semibold text-[#18181b]">{detail.title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-[#52525b]">{detail.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form
            className="bp-form"
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <label className="bp-label">
              Try a demo account
              <select
                className="bp-input"
                value={demoSelection}
                onChange={(e) => handleDemoSelection(e.target.value as DemoSelection)}
              >
                <option value="">Select demo account</option>
                <option value="instructor">Instructor Demo</option>
                <option value="student">Student Demo</option>
              </select>
            </label>

            {demoSelection ? (
              <div className="rounded-lg border border-[#e4e4e7] bg-[#fafafa] p-4">
                <p className="text-sm font-medium text-[#18181b]">{DEMO_ROLE_DETAILS[demoSelection].title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#52525b]">
                  {DEMO_ROLE_DETAILS[demoSelection].description}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-[#52525b]">
                  {DEMO_ROLE_DETAILS[demoSelection].bullets.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

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
              <span>{loading ? (demoSelection && password === DEMO_PASSWORD_MASK ? "Opening demo..." : "Signing in...") : "Log In"}</span>
            </button>

            {loading ? (
              <div className="flex items-center justify-center py-2">
                <div className="text-center rounded-lg border border-[#e4e4e7] bg-white px-5 py-4 w-full">
                  <div
                    className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full mx-auto"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-gray-700 text-sm">Connecting to server...</p>
                  <p className="text-xs text-gray-400">
                    This may take a few seconds if the system is starting.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="bp-login-secondary-action">
              <Link
                to="/"
                className="dashboard-home-button"
                aria-label="Return to homepage"
              >
                <span className="dashboard-home-button__icon" aria-hidden="true">←</span>
                Back to Home
              </Link>
            </div>
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
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
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
                role={role as Role}
                courses={filteredCourses}
              />

              {loadingCourses ? (
                <p className="text-sm text-[#71717a]">Loading courses...</p>
              ) : filteredCourses.length ? (
                <CourseGrid
                  courses={filteredCourses}
                  role={role as Role}
                  onOpenCourse={openCourse}
                />
              ) : (
                <EmptyState
                  title={normalizedSearchQuery ? "No matching courses" : "No courses yet"}
                  description={
                    normalizedSearchQuery
                      ? "Try another search term or clear the search field."
                      : isInstructor
                      ? "Create your first course to start teaching students."
                      : "Join your first course to begin learning."
                  }
                />
              )}
            </div>

            <div className="space-y-8">
              <UpcomingAssignments
                role={role as Role}
                tasks={filteredTasks}
                loading={loadingTasks}
                onToggleCompletion={toggleTaskCompletion}
              />
              <RecentActivity role={role as Role} courses={filteredCourses} />
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
          ) : filteredCourses.length ? (
            <CourseGrid
              courses={filteredCourses}
              role={role as Role}
              onOpenCourse={openCourse}
            />
          ) : (
            <EmptyState
              title={normalizedSearchQuery ? "No matching courses" : "No courses yet"}
              description={
                normalizedSearchQuery
                  ? "Try another search term or clear the search field."
                  : "Create your first course to start teaching students."
              }
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
                ? "Manage live course reminders and keep students aligned."
                : "Track reminder tasks and mark them complete as you go."
            }
          />
          <UpcomingAssignments
            role={role as Role}
            tasks={filteredTasks}
            loading={loadingTasks}
            onToggleCompletion={toggleTaskCompletion}
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
          <RecentActivity role={role as Role} courses={filteredCourses} />
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
