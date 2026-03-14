import { CheckCircle, Circle, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { CourseTask, CourseTaskInput, Role } from "../../types";

type CourseTasksPanelProps = {
  role: Role;
  tasks: CourseTask[];
  loading?: boolean;
  courseScoped?: boolean;
  showHeader?: boolean;
  onCreate?: (input: CourseTaskInput) => Promise<void>;
  onUpdate?: (taskId: string, input: CourseTaskInput) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  onToggleCompletion?: (task: CourseTask, completed: boolean) => Promise<void>;
};

type EditorState = {
  title: string;
  description: string;
  dueAt: string;
};

const emptyEditorState: EditorState = {
  title: "",
  description: "",
  dueAt: "",
};

function toEditorState(task?: CourseTask): EditorState {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    dueAt: task?.dueAt ? toDateTimeInputValue(task.dueAt) : "",
  };
}

function toDateTimeInputValue(value: string) {
  const date = new Date(value);
  const offsetMilliseconds = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMilliseconds).toISOString().slice(0, 16);
}

function formatDueDate(value?: string | null) {
  if (!value) {
    return "No due date";
  }

  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CourseTasksPanel({
  role,
  tasks,
  loading = false,
  courseScoped = false,
  showHeader = true,
  onCreate,
  onUpdate,
  onDelete,
  onToggleCompletion,
}: CourseTasksPanelProps) {
  const isInstructor = role === "INSTRUCTOR" || role === "ADMIN";
  const isStudent = role === "STUDENT";
  const [editorState, setEditorState] = useState<EditorState>(emptyEditorState);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);

  const summaryText = useMemo(() => {
    if (!tasks.length) {
      return isInstructor
        ? "Create your first reminder to guide students through the course."
        : "No course reminders yet.";
    }

    if (!isStudent) {
      const totalCompletions = tasks.reduce((count, task) => count + task.completionCount, 0);
      return `${tasks.length} task${tasks.length === 1 ? "" : "s"} active, ${totalCompletions} student completion${totalCompletions === 1 ? "" : "s"}.`;
    }

    const completedCount = tasks.filter((task) => task.completed).length;
    return `${completedCount}/${tasks.length} completed`;
  }, [isInstructor, isStudent, tasks]);

  const submit = async () => {
    if (submitting || !editorState.title.trim()) {
      return;
    }

    const payload: CourseTaskInput = {
      title: editorState.title.trim(),
      description: editorState.description.trim() || null,
      dueAt: editorState.dueAt ? new Date(editorState.dueAt).toISOString() : null,
    };

    setSubmitting(true);
    try {
      if (editingTaskId && onUpdate) {
        await onUpdate(editingTaskId, payload);
      } else if (!editingTaskId && onCreate) {
        await onCreate(payload);
      }

      setEditorState(emptyEditorState);
      setEditingTaskId(null);
    } finally {
      setSubmitting(false);
    }
  };

  const beginEdit = (task: CourseTask) => {
    setEditingTaskId(task.id);
    setEditorState(toEditorState(task));
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditorState(emptyEditorState);
  };

  const removeTask = async (taskId: string) => {
    if (!onDelete || pendingTaskId) {
      return;
    }

    setPendingTaskId(taskId);
    try {
      await onDelete(taskId);
      if (editingTaskId === taskId) {
        cancelEdit();
      }
    } finally {
      setPendingTaskId(null);
    }
  };

  const toggleCompletion = async (task: CourseTask) => {
    if (!isStudent || !onToggleCompletion || pendingTaskId) {
      return;
    }

    setPendingTaskId(task.id);
    try {
      await onToggleCompletion(task, !task.completed);
    } finally {
      setPendingTaskId(null);
    }
  };

  return (
    <section className="bg-white border border-[#e4e4e7] rounded-lg p-6 shadow-sm">
      {showHeader ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-medium text-[#18181b]">Assignments</h3>
            <p className="text-sm text-[#71717a]">
              {isInstructor
                ? "Simple course reminders and checklist tasks for students."
                : "Track reminders and mark them complete as you work through the course."}
            </p>
          </div>
          <p className="text-sm text-[#52525b]">{summaryText}</p>
        </div>
      ) : (
        <p className="text-sm text-[#52525b]">{summaryText}</p>
      )}

      {isInstructor && courseScoped ? (
        <div className="mt-5 rounded-lg border border-[#e4e4e7] bg-[#fafafa] p-4">
          <div className="flex items-center gap-2">
            {editingTaskId ? <Pencil className="h-4 w-4 text-blue-600" /> : <Plus className="h-4 w-4 text-blue-600" />}
            <h4 className="text-sm font-medium text-[#18181b]">
              {editingTaskId ? "Edit reminder" : "Add reminder"}
            </h4>
          </div>

          <div className="mt-4 grid gap-3">
            <input
              className="h-10 border border-[#e4e4e7] rounded-md px-3 bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Task title"
              value={editorState.title}
              onChange={(event) => setEditorState((prev) => ({ ...prev, title: event.target.value }))}
            />
            <textarea
              className="border border-[#e4e4e7] rounded-md px-3 py-2 bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Description (optional)"
              rows={3}
              value={editorState.description}
              onChange={(event) => setEditorState((prev) => ({ ...prev, description: event.target.value }))}
            />
            <input
              type="datetime-local"
              className="h-10 border border-[#e4e4e7] rounded-md px-3 bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={editorState.dueAt}
              onChange={(event) => setEditorState((prev) => ({ ...prev, dueAt: event.target.value }))}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={submitting || !editorState.title.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {submitting ? "Saving..." : editingTaskId ? "Save Changes" : "Create Task"}
            </button>
            {editingTaskId ? (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md border border-[#e4e4e7] bg-white px-4 py-2 text-sm font-medium text-[#18181b] hover:bg-[#f8f9fb]"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {loading ? <p className="mt-5 text-sm text-[#71717a]">Loading assignments...</p> : null}

      {!loading && !tasks.length ? (
        <div className="mt-5 rounded-lg border border-dashed border-[#d4d4d8] bg-[#fafafa] p-5 text-sm text-[#71717a]">
          {isInstructor
            ? "No reminders have been created for this course yet."
            : "Your instructor has not added any reminders yet."}
        </div>
      ) : null}

      {!loading && tasks.length ? (
        <div className="mt-5 space-y-3">
          {tasks.map((task) => (
            <article key={task.id} className="rounded-lg border border-[#e4e4e7] bg-white p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    {isStudent ? (
                      <button
                        type="button"
                        onClick={() => toggleCompletion(task)}
                        disabled={pendingTaskId === task.id}
                        className="mt-0.5 text-blue-600"
                        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                      >
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 fill-blue-600 text-blue-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-[#a1a1aa]" />
                        )}
                      </button>
                    ) : null}

                    <div>
                      <h4
                        className={`text-sm font-medium ${
                          task.completed && isStudent ? "text-[#71717a] line-through" : "text-[#18181b]"
                        }`}
                      >
                        {task.title}
                      </h4>
                      {!courseScoped ? (
                        <p className="mt-1 text-xs font-medium text-blue-600">{task.courseTitle}</p>
                      ) : null}
                      {task.description ? (
                        <p className="mt-2 text-sm leading-relaxed text-[#52525b]">{task.description}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-3 text-xs text-[#71717a] md:items-end">
                  <p>{formatDueDate(task.dueAt)}</p>
                  {isInstructor ? (
                    <p>{task.completionCount} completion{task.completionCount === 1 ? "" : "s"}</p>
                  ) : null}
                </div>
              </div>

              {isInstructor && courseScoped ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => beginEdit(task)}
                    className="inline-flex items-center gap-2 rounded-md border border-[#e4e4e7] bg-white px-3 py-2 text-sm font-medium text-[#18181b] hover:bg-[#f8f9fb]"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTask(task.id)}
                    disabled={pendingTaskId === task.id}
                    className="inline-flex items-center gap-2 rounded-md border border-[#fecaca] bg-white px-3 py-2 text-sm font-medium text-[#b91c1c] hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
