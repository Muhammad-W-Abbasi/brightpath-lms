import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CheckCircle, Circle, ExternalLink, Eye, FileText, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { ContentStatus, CourseModule, CourseOutline, LessonDetail, LessonInput, LessonSummary, ModuleInput, Role } from "../../types";

type CourseLessonsPanelProps = {
  role: Role;
  outline: CourseOutline | null;
  selectedLesson: LessonDetail | null;
  loading: boolean;
  loadingLesson: boolean;
  error?: string | null;
  lessonError?: string | null;
  onReload: () => Promise<void>;
  onOpenLesson: (lessonId: string) => Promise<void>;
  onCreateModule: (input: ModuleInput) => Promise<void>;
  onUpdateModule: (moduleId: string, input: ModuleInput) => Promise<void>;
  onDeleteModule: (moduleId: string) => Promise<void>;
  onReorderModules: (orderedIds: string[]) => Promise<void>;
  onCreateLesson: (moduleId: string, input: LessonInput) => Promise<void>;
  onUpdateLesson: (moduleId: string, lessonId: string, input: LessonInput) => Promise<void>;
  onDeleteLesson: (moduleId: string, lessonId: string) => Promise<void>;
  onReorderLessons: (moduleId: string, orderedIds: string[]) => Promise<void>;
  onToggleCompletion: (lessonId: string, completed: boolean) => Promise<void>;
};

type ModuleEditorState = ModuleInput & { id?: string };
type LessonEditorState = LessonInput & { id?: string; moduleId: string };

const emptyModule: ModuleEditorState = { title: "", description: "", status: "DRAFT" };
const statusOptions: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

function formatStatus(status: ContentStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function firstLessonId(outline: CourseOutline | null) {
  const lessons = outline?.modules.flatMap((module) => module.lessons) ?? [];
  return lessons.length ? lessons[0].id : null;
}

function toLessonEditor(moduleId: string, lesson?: LessonSummary | LessonDetail): LessonEditorState {
  return {
    id: lesson?.id,
    moduleId,
    title: lesson?.title ?? "",
    description: lesson?.description ?? "",
    content: "content" in (lesson ?? {}) ? (lesson as LessonDetail).content : "",
    estimatedMinutes: lesson?.estimatedMinutes ?? null,
    resourceUrl: lesson?.resourceUrl ?? "",
    status: lesson?.status ?? "DRAFT",
  };
}

function toModuleInput(module: CourseModule): ModuleEditorState {
  return {
    id: module.id,
    title: module.title,
    description: module.description ?? "",
    status: module.status,
  };
}

function statusClass(status: ContentStatus) {
  if (status === "PUBLISHED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (status === "ARCHIVED") {
    return "border-zinc-200 bg-zinc-100 text-zinc-700";
  }
  return "border-amber-200 bg-amber-50 text-amber-800";
}

export default function CourseLessonsPanel({
  role,
  outline,
  selectedLesson,
  loading,
  loadingLesson,
  error,
  lessonError,
  onReload,
  onOpenLesson,
  onCreateModule,
  onUpdateModule,
  onDeleteModule,
  onReorderModules,
  onCreateLesson,
  onUpdateLesson,
  onDeleteLesson,
  onReorderLessons,
  onToggleCompletion,
}: CourseLessonsPanelProps) {
  const isInstructor = role === "INSTRUCTOR" || role === "ADMIN";
  const [moduleEditor, setModuleEditor] = useState<ModuleEditorState>(emptyModule);
  const [lessonEditor, setLessonEditor] = useState<LessonEditorState | null>(null);
  const [pending, setPending] = useState(false);

  const modules = outline?.modules ?? [];
  const allLessons = useMemo(() => modules.flatMap((module) => module.lessons), [modules]);
  const progress = outline?.progress ?? { completedLessons: 0, totalLessons: 0, percentComplete: 0 };

  const resetModuleEditor = () => setModuleEditor(emptyModule);
  const resetLessonEditor = () => setLessonEditor(null);

  const submitModule = async () => {
    if (pending || !moduleEditor.title.trim()) {
      return;
    }
    const payload: ModuleInput = {
      title: moduleEditor.title.trim(),
      description: moduleEditor.description?.trim() || null,
      status: moduleEditor.status,
    };
    setPending(true);
    try {
      if (moduleEditor.id) {
        await onUpdateModule(moduleEditor.id, payload);
      } else {
        await onCreateModule(payload);
      }
      resetModuleEditor();
    } finally {
      setPending(false);
    }
  };

  const submitLesson = async () => {
    if (pending || !lessonEditor || !lessonEditor.title.trim() || !lessonEditor.content.trim()) {
      return;
    }
    const payload: LessonInput = {
      title: lessonEditor.title.trim(),
      description: lessonEditor.description?.trim() || null,
      content: lessonEditor.content.trim(),
      estimatedMinutes: lessonEditor.estimatedMinutes || null,
      resourceUrl: lessonEditor.resourceUrl?.trim() || null,
      status: lessonEditor.status,
    };
    setPending(true);
    try {
      if (lessonEditor.id) {
        await onUpdateLesson(lessonEditor.moduleId, lessonEditor.id, payload);
      } else {
        await onCreateLesson(lessonEditor.moduleId, payload);
      }
      resetLessonEditor();
    } finally {
      setPending(false);
    }
  };

  const moveModule = async (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= modules.length || pending) {
      return;
    }
    const orderedIds = modules.map((module) => module.id);
    [orderedIds[index], orderedIds[nextIndex]] = [orderedIds[nextIndex], orderedIds[index]];
    setPending(true);
    try {
      await onReorderModules(orderedIds);
    } finally {
      setPending(false);
    }
  };

  const moveLesson = async (module: CourseModule, index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= module.lessons.length || pending) {
      return;
    }
    const orderedIds = module.lessons.map((lesson) => lesson.id);
    [orderedIds[index], orderedIds[nextIndex]] = [orderedIds[nextIndex], orderedIds[index]];
    setPending(true);
    try {
      await onReorderLessons(module.id, orderedIds);
    } finally {
      setPending(false);
    }
  };

  const updateModuleStatus = async (module: CourseModule, status: ContentStatus) => {
    await onUpdateModule(module.id, {
      title: module.title,
      description: module.description ?? null,
      status,
    });
  };

  const updateLessonStatus = async (module: CourseModule, lesson: LessonSummary, status: ContentStatus) => {
    const detail = selectedLesson?.id === lesson.id ? selectedLesson : null;
    await onUpdateLesson(module.id, lesson.id, {
      title: lesson.title,
      description: lesson.description ?? null,
      content: detail?.content ?? null,
      estimatedMinutes: lesson.estimatedMinutes ?? null,
      resourceUrl: lesson.resourceUrl ?? null,
      status,
    });
  };

  if (loading) {
    return (
      <section className="bp-card">
        <p className="bp-muted">Loading modules and lessons...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bp-card">
        <p className="text-sm text-red-700">{error}</p>
        <button type="button" className="bp-btn mt-3" onClick={onReload}>
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-[#dbeafe] bg-[#eff6ff] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-950">Course Progress</p>
            <p className="mt-1 text-sm text-blue-900">
              {progress.totalLessons
                ? `${progress.completedLessons}/${progress.totalLessons} published lessons complete`
                : isInstructor
                ? "Publish lessons to make student progress measurable."
                : "No published lessons are available yet."}
            </p>
          </div>
          <p className="text-2xl font-semibold text-blue-950">{progress.percentComplete}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress.percentComplete}%` }} />
        </div>
      </div>

      {isInstructor ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]">
          <div className="rounded-lg border border-[#e4e4e7] bg-white p-4">
            <div className="flex items-center gap-2">
              {moduleEditor.id ? <Pencil className="h-4 w-4 text-blue-600" /> : <Plus className="h-4 w-4 text-blue-600" />}
              <h3 className="text-base font-semibold text-[#18181b]">{moduleEditor.id ? "Edit module" : "Add module"}</h3>
            </div>
            <div className="mt-4 grid gap-3">
              <label className="bp-label">
                Module title
                <input className="bp-input" value={moduleEditor.title} onChange={(event) => setModuleEditor((prev) => ({ ...prev, title: event.target.value }))} />
              </label>
              <label className="bp-label">
                Description
                <textarea className="bp-input min-h-[92px]" value={moduleEditor.description ?? ""} onChange={(event) => setModuleEditor((prev) => ({ ...prev, description: event.target.value }))} />
              </label>
              <label className="bp-label">
                Status
                <select className="bp-input" value={moduleEditor.status} onChange={(event) => setModuleEditor((prev) => ({ ...prev, status: event.target.value as ContentStatus }))}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{formatStatus(status)}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="bp-btn bp-btn-primary inline-flex items-center gap-2" onClick={submitModule} disabled={pending || !moduleEditor.title.trim()}>
                <Save className="h-4 w-4" />
                {moduleEditor.id ? "Save Module" : "Create Module"}
              </button>
              {moduleEditor.id ? (
                <button type="button" className="bp-btn inline-flex items-center gap-2" onClick={resetModuleEditor} disabled={pending}>
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-[#e4e4e7] bg-white p-4">
            <div className="flex items-center gap-2">
              {lessonEditor?.id ? <Pencil className="h-4 w-4 text-blue-600" /> : <FileText className="h-4 w-4 text-blue-600" />}
              <h3 className="text-base font-semibold text-[#18181b]">{lessonEditor ? (lessonEditor.id ? "Edit lesson" : "Add lesson") : "Lesson editor"}</h3>
            </div>
            {lessonEditor ? (
              <>
                <div className="mt-4 grid gap-3">
                  <label className="bp-label">
                    Lesson title
                    <input className="bp-input" value={lessonEditor.title} onChange={(event) => setLessonEditor((prev) => prev ? { ...prev, title: event.target.value } : prev)} />
                  </label>
                  <label className="bp-label">
                    Description
                    <input className="bp-input" value={lessonEditor.description ?? ""} onChange={(event) => setLessonEditor((prev) => prev ? { ...prev, description: event.target.value } : prev)} />
                  </label>
                  <label className="bp-label">
                    Content
                    <textarea className="bp-input min-h-[170px]" value={lessonEditor.content} onChange={(event) => setLessonEditor((prev) => prev ? { ...prev, content: event.target.value } : prev)} />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="bp-label">
                      Minutes
                      <input type="number" min={1} className="bp-input" value={lessonEditor.estimatedMinutes ?? ""} onChange={(event) => setLessonEditor((prev) => prev ? { ...prev, estimatedMinutes: event.target.value ? Number(event.target.value) : null } : prev)} />
                    </label>
                    <label className="bp-label">
                      Status
                      <select className="bp-input" value={lessonEditor.status} onChange={(event) => setLessonEditor((prev) => prev ? { ...prev, status: event.target.value as ContentStatus } : prev)}>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{formatStatus(status)}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="bp-label">
                    Resource URL
                    <input className="bp-input" value={lessonEditor.resourceUrl ?? ""} onChange={(event) => setLessonEditor((prev) => prev ? { ...prev, resourceUrl: event.target.value } : prev)} />
                  </label>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="bp-btn bp-btn-primary inline-flex items-center gap-2" onClick={submitLesson} disabled={pending || !lessonEditor.title.trim() || !lessonEditor.content.trim()}>
                    <Save className="h-4 w-4" />
                    {lessonEditor.id ? "Save Lesson" : "Create Lesson"}
                  </button>
                  <button type="button" className="bp-btn inline-flex items-center gap-2" onClick={resetLessonEditor} disabled={pending}>
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-[#71717a]">Choose a module to add a lesson or edit an existing lesson.</p>
            )}
          </div>
        </div>
      ) : null}

      {!modules.length ? (
        <div className="rounded-lg border border-dashed border-[#d4d4d8] bg-white p-6 text-sm text-[#71717a]">
          {isInstructor ? "No modules yet. Create the first module to start building the course outline." : "This course does not have published lessons yet."}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.4fr)]">
          <div className="space-y-4">
            {modules.map((module, moduleIndex) => (
              <article key={module.id} className="rounded-lg border border-[#e4e4e7] bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-[#18181b]">{module.title}</h3>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClass(module.status)}`}>{formatStatus(module.status)}</span>
                    </div>
                    {module.description ? <p className="mt-1 text-sm text-[#52525b]">{module.description}</p> : null}
                  </div>
                  {isInstructor ? (
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="bp-btn h-9 px-3" onClick={() => moveModule(moduleIndex, -1)} disabled={pending || moduleIndex === 0} aria-label={`Move ${module.title} up`}>
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button type="button" className="bp-btn h-9 px-3" onClick={() => moveModule(moduleIndex, 1)} disabled={pending || moduleIndex === modules.length - 1} aria-label={`Move ${module.title} down`}>
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button type="button" className="bp-btn h-9 px-3" onClick={() => setModuleEditor(toModuleInput(module))} aria-label={`Edit ${module.title}`}>
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </div>

                {isInstructor ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className="bp-btn h-9" onClick={() => setLessonEditor(toLessonEditor(module.id))}>
                      Add Lesson
                    </button>
                    <button type="button" className="bp-btn h-9" onClick={() => updateModuleStatus(module, module.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED")}>
                      {module.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                    </button>
                    <button type="button" className="bp-btn h-9" onClick={() => updateModuleStatus(module, "ARCHIVED")}>
                      Archive
                    </button>
                    <button type="button" className="bp-btn bp-btn-outline-danger h-9" onClick={() => window.confirm(`Delete module "${module.title}" and its lessons?`) && onDeleteModule(module.id)}>
                      Delete
                    </button>
                  </div>
                ) : null}

                <div className="mt-4 space-y-2">
                  {module.lessons.length ? module.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className={`rounded-md border p-3 ${selectedLesson?.id === lesson.id ? "border-blue-300 bg-blue-50" : "border-[#e4e4e7] bg-[#fafafa]"}`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <button type="button" className="min-w-0 text-left" onClick={() => onOpenLesson(lesson.id)}>
                          <span className="flex items-center gap-2">
                            {lesson.completed ? <CheckCircle className="h-4 w-4 text-blue-600" /> : <Circle className="h-4 w-4 text-[#a1a1aa]" />}
                            <span className="font-medium text-[#18181b]">{lesson.title}</span>
                          </span>
                          <span className="mt-1 block text-xs text-[#71717a]">
                            {lesson.estimatedMinutes ? `${lesson.estimatedMinutes} min` : "Self paced"} · {formatStatus(lesson.status)}
                          </span>
                        </button>
                        {isInstructor ? (
                          <div className="flex flex-wrap gap-2">
                            <button type="button" className="bp-btn h-8 px-2" onClick={() => moveLesson(module, lessonIndex, -1)} disabled={pending || lessonIndex === 0} aria-label={`Move ${lesson.title} up`}>
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button type="button" className="bp-btn h-8 px-2" onClick={() => moveLesson(module, lessonIndex, 1)} disabled={pending || lessonIndex === module.lessons.length - 1} aria-label={`Move ${lesson.title} down`}>
                              <ArrowDown className="h-4 w-4" />
                            </button>
                            <button type="button" className="bp-btn h-8 px-2" onClick={() => setLessonEditor(toLessonEditor(module.id, selectedLesson?.id === lesson.id ? selectedLesson : lesson))} aria-label={`Edit ${lesson.title}`}>
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button type="button" className="bp-btn h-8 px-2" onClick={() => updateLessonStatus(module, lesson, lesson.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED")} aria-label={`${lesson.status === "PUBLISHED" ? "Unpublish" : "Publish"} ${lesson.title}`}>
                              <Eye className="h-4 w-4" />
                            </button>
                            <button type="button" className="bp-btn h-8 px-2" onClick={() => updateLessonStatus(module, lesson, "ARCHIVED")} aria-label={`Archive ${lesson.title}`}>
                              Archive
                            </button>
                            <button type="button" className="bp-btn bp-btn-outline-danger h-8 px-2" onClick={() => window.confirm(`Delete lesson "${lesson.title}"?`) && onDeleteLesson(module.id, lesson.id)} aria-label={`Delete ${lesson.title}`}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )) : (
                    <p className="rounded-md border border-dashed border-[#d4d4d8] bg-[#fafafa] p-3 text-sm text-[#71717a]">
                      {isInstructor ? "No lessons in this module yet." : "No published lessons in this module yet."}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <article className="rounded-lg border border-[#e4e4e7] bg-white p-5">
            {loadingLesson ? <p className="text-sm text-[#71717a]">Loading lesson...</p> : null}
            {!loadingLesson && lessonError ? <p className="text-sm text-red-700">{lessonError}</p> : null}
            {!loadingLesson && !lessonError && selectedLesson ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{selectedLesson.moduleTitle}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#18181b]">{selectedLesson.title}</h2>
                  {selectedLesson.description ? <p className="mt-2 text-sm leading-relaxed text-[#52525b]">{selectedLesson.description}</p> : null}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#71717a]">
                    <span>{selectedLesson.estimatedMinutes ? `${selectedLesson.estimatedMinutes} min` : "Self paced"}</span>
                    <span>·</span>
                    <span>{formatStatus(selectedLesson.status)}</span>
                  </div>
                </div>

                <div className="prose max-w-none whitespace-pre-wrap rounded-lg border border-[#e4e4e7] bg-[#fafafa] p-4 text-sm leading-7 text-[#27272a]">
                  {selectedLesson.content}
                </div>

                {selectedLesson.resourceUrl ? (
                  <a href={selectedLesson.resourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline">
                    Resource
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}

                <div className="flex flex-col gap-3 border-t border-[#e4e4e7] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-2">
                    <button type="button" className="bp-btn inline-flex items-center gap-2" disabled={!selectedLesson.previousLessonId} onClick={() => selectedLesson.previousLessonId && onOpenLesson(selectedLesson.previousLessonId)}>
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <button type="button" className="bp-btn inline-flex items-center gap-2" disabled={!selectedLesson.nextLessonId} onClick={() => selectedLesson.nextLessonId && onOpenLesson(selectedLesson.nextLessonId)}>
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  {!isInstructor ? (
                    <button type="button" className={`bp-btn inline-flex items-center gap-2 ${selectedLesson.completed ? "" : "bp-btn-primary"}`} onClick={() => onToggleCompletion(selectedLesson.id, !selectedLesson.completed)}>
                      {selectedLesson.completed ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      {selectedLesson.completed ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
            {!loadingLesson && !lessonError && !selectedLesson ? (
              <div className="rounded-lg border border-dashed border-[#d4d4d8] bg-[#fafafa] p-6 text-sm text-[#71717a]">
                {allLessons.length
                  ? (
                    <>
                      <p>Select a lesson from the outline to preview it.</p>
                      <button type="button" className="bp-btn mt-4" onClick={() => firstLessonId(outline) && onOpenLesson(firstLessonId(outline)!)}>
                        Open First Lesson
                      </button>
                    </>
                  )
                  : "Lessons will appear here once the course outline has content."}
              </div>
            ) : null}
          </article>
        </div>
      )}
    </section>
  );
}
