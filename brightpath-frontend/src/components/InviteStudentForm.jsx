import { useState } from "react";
import axiosClient from "../api/axiosClient";

function InviteStudentForm({ courseId, onInvited, onError }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || loading) {
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post(`/courses/${courseId}/invite`, {
        email: email.trim().toLowerCase(),
      });
      setEmail("");
      await onInvited?.();
    } catch (err) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bp-form" onSubmit={submit}>
      <label className="bp-label">
        Invite Student by Email
        <input
          className="bp-input"
          placeholder="student@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>
      <button type="submit" className="bp-btn bp-btn-primary" disabled={loading}>
        {loading ? "Inviting..." : "Invite Student"}
      </button>
    </form>
  );
}

export default InviteStudentForm;
