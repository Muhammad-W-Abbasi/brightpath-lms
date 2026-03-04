function ClassListSidebar({ students }) {
  return (
    <aside className="bp-classlist-sidebar">
      <h3 className="bp-card-title">Class List</h3>
      {!students.length ? (
        <p className="bp-muted">No students enrolled yet.</p>
      ) : (
        <ul className="bp-classlist">
          {students.map((student) => (
            <li key={student.id} className="bp-classlist-item">
              <p className="bp-student-name">{student.displayName}</p>
              <p className="bp-student-email">{student.email}</p>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default ClassListSidebar;
