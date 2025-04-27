import React, { useState } from 'react';

function Dashboard({ username }) {
  const [activeMenu, setActiveMenu] = useState('upcoming');
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    name: '',
    course: '',
    dueDate: '',
  });
  const [selectedCourse, setSelectedCourse] = useState('All');

  const handleAddAssignment = () => {
    if (newAssignment.name && newAssignment.course && newAssignment.dueDate) {
      setAssignments(prev => [
        ...prev,
        { ...newAssignment, completed: false }
      ]);
      setNewAssignment({ name: '', course: '', dueDate: '' });
      setActiveMenu('upcoming');
    }
  };

  const markAsCompleted = (index) => {
    const confirmComplete = window.confirm('Are you sure you want to mark this assignment as completed?');
    if (!confirmComplete) return;

    setAssignments(prev => {
      const updated = [...prev];
      updated[index].completed = true;
      return updated;
    });
  };

  const today = new Date().toISOString().split('T')[0];

  const renderAssignments = (filterFn, sortByDate = false) => {
    let filtered = assignments.filter(filterFn);

    if (sortByDate) {
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    if (filtered.length === 0) {
      return <p>No assignments found.</p>;
    }

    return filtered.map((assignment, idx) => {
      const isOverdue = assignment.dueDate < today && !assignment.completed;

      return (
        <div
          key={idx}
          style={{
            border: '1px solid #ccc',
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: isOverdue ? '#ffcccc' : 'white'
          }}
        >
          <h3>{assignment.name}</h3>
          <p>Course: {assignment.course}</p>
          <p>Due Date: {assignment.dueDate}</p>
          {!assignment.completed && (
            <button onClick={() => markAsCompleted(assignments.indexOf(assignment))}>
              Mark as Completed
            </button>
          )}
        </div>
      );
    });
  };

  const renderGroupedByCourse = () => {
    const activeAssignments = assignments.filter(a => !a.completed);
    const grouped = {};

    activeAssignments.forEach(a => {
      if (!grouped[a.course]) {
        grouped[a.course] = [];
      }
      grouped[a.course].push(a);
    });

    const courses = Object.keys(grouped);

    if (courses.length === 0) {
      return <p>No assignments found.</p>;
    }

    // Filter based on selected course
    const filteredCourses = selectedCourse === 'All' ? courses : courses.filter(c => c === selectedCourse);

    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{ padding: '0.5rem' }}
          >
            <option value="All">All Courses</option>
            {courses.map((course, idx) => (
              <option key={idx} value={course}>{course}</option>
            ))}
          </select>
        </div>

        {filteredCourses.map((course, idx) => (
          <div key={idx} style={{ marginBottom: '2rem' }}>
            <h3>{course}</h3>
            {grouped[course].map((assignment, idx2) => {
              const isOverdue = assignment.dueDate < today && !assignment.completed;

              return (
                <div
                  key={idx2}
                  style={{
                    border: '1px solid #ccc',
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: isOverdue ? '#ffcccc' : 'white'
                  }}
                >
                  <h4>{assignment.name}</h4>
                  <p>Due Date: {assignment.dueDate}</p>
                  <button onClick={() => markAsCompleted(assignments.indexOf(assignment))}>
                    Mark as Completed
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1rem' }}>
        <h3>Menu</h3>
        <button onClick={() => setActiveMenu('upcoming')}>Upcoming Assignments</button>
        <br /><br />
        <button onClick={() => setActiveMenu('course')}>Course Assignments</button>
        <br /><br />
        <button onClick={() => setActiveMenu('completed')}>Completed Assignments</button>
        <br /><br />
        <button onClick={() => setActiveMenu('add')}>Add Assignment</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <h2>Welcome, {username}!</h2>

        {activeMenu === 'upcoming' && (
          <>
            <h2>Upcoming Assignments</h2>
            {renderAssignments(a => !a.completed, true)}
          </>
        )}

        {activeMenu === 'course' && (
          <>
            <h2>Assignments by Course</h2>
            {renderGroupedByCourse()}
          </>
        )}

        {activeMenu === 'completed' && (
          <>
            <h2>Completed Assignments</h2>
            {renderAssignments(a => a.completed)}
          </>
        )}

        {activeMenu === 'add' && (
          <>
            <h2>Add New Assignment</h2>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Assignment Name"
                value={newAssignment.name}
                onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })}
                style={{ marginBottom: '1rem' }}
              />

              <select
                value={newAssignment.course}
                onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
                style={{ marginBottom: '1rem' }}
              >
                <option value="">Select Course</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="English">English</option>
              </select>

              <input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                style={{ marginBottom: '1rem' }}
              />

              <button onClick={handleAddAssignment}>Save Assignment</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
