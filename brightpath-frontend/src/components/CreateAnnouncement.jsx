import { useState } from "react";

function CreateAnnouncement({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({ title: title.trim(), content: content.trim() });
      setTitle("");
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="bp-form bp-announcement-form">
      <h3 className="bp-card-title">Create Announcement</h3>
      <input
        className="bp-input"
        placeholder="Announcement title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="bp-input"
        placeholder="What should learners know?"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="bp-btn bp-btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Announcement"}
      </button>
    </form>
  );
}

export default CreateAnnouncement;
