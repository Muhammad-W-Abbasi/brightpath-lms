import { useState } from "react";
import axiosClient from "../api/axiosClient";

function JoinCodePanel({ courseId, onCodeUpdated, onError }) {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  const regenerate = async () => {
    if (!courseId || loading) {
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post(`/courses/${courseId}/join-code`);
      const newCode = res?.data?.joinCode ?? "";
      setJoinCode(newCode);
      onCodeUpdated?.(newCode);
    } catch (err) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!joinCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(joinCode);
      onCodeUpdated?.(joinCode, { copied: true });
    } catch {
      onError?.(new Error("Failed to copy join code"));
    }
  };

  return (
    <section className="bp-join-code-panel">
      <p className="bp-join-code-label">Course Join Code</p>
      <p className="bp-join-code-value">{joinCode || "Not generated yet"}</p>
      <div className="bp-card-actions">
        <button
          type="button"
          className="bp-btn bp-btn-primary"
          onClick={regenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Regenerate Code"}
        </button>
        <button type="button" className="bp-btn" onClick={copyCode} disabled={!joinCode}>
          Copy Code
        </button>
      </div>
    </section>
  );
}

export default JoinCodePanel;
