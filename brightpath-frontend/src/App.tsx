import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import axiosClient from "./api/axiosClient";
import LoadingScreen from "./components/LoadingScreen";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CoursePage from "./pages/CoursePage";
import "./App.css";

type AuthUser = {
  email: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
};

const TOKEN_STORAGE_KEY = "token";

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    console.log("Warmup: pinging backend...");

    fetch("https://brightpath-lms.onrender.com/actuator/health", {
      method: "GET",
      signal: controller.signal,
    })
      .then((res) => {
        console.log("Warmup: backend responded", res.status);
      })
      .catch(() => {
        console.log("Warmup: backend unreachable (likely cold start)");
      })
      .finally(() => {
        clearTimeout(timeout);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    axiosClient
      .get("/auth/me")
      .then((res) => {
        if (res.data?.email && res.data?.role) {
          setUser({
            email: res.data.email,
            role: res.data.role as AuthUser["role"],
          });
          return;
        }
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard authUser={user} onAuthChange={setUser} />} />
        <Route
          path="/course/:id"
          element={user?.role ? <CoursePage authUser={user} onAuthChange={setUser} /> : <Navigate to="/dashboard" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
