function StudentList({ students, onRemove }) {
  if (!students.length) {
    return <p className="bp-muted">No students enrolled yet.</p>;
  }

  return (
    <div className="bp-student-table-wrap">
      <table className="bp-student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.displayName}</td>
              <td>{student.email}</td>
              <td>{student.role ?? "STUDENT"}</td>
              <td>
                <button
                  type="button"
                  className="bp-btn bp-btn-outline-danger"
                  onClick={() => onRemove?.(student)}
                >
                  Remove Student
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
