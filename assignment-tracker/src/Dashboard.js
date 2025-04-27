import React, { useState } from 'react';
import './Dashboard.css';

function Dashboard({ username }) {
  const [activeMenu, setActiveMenu] = useState('upcoming');
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ name: '', course: '', dueDate: '' });
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editAssignmentData, setEditAssignmentData] = useState({ name: '', course: '', dueDate: '' });

  const today = new Date().toISOString().split('T')[0];

  const handleAddAssignment = () => {
    if (newAssignment.name && newAssignment.course && newAssignment.dueDate) {
      setAssignments(prev => [...prev, { ...newAssignment, completed: false }]);
      setNewAssignment({ name: '', course: '', dueDate: '' });
      setActiveMenu('upcoming');
    }
  };

  const handleDeleteAssignment = (index) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleEditAssignment = (index) => {
    setEditingIndex(index);
    setEditAssignmentData(assignments[index]);
  };

  const saveEditedAssignment = () => {
    setAssignments(prev => {
      const updated = [...prev];
      updated[editingIndex] = { ...editAssignmentData, completed: updated[editingIndex].completed };
      return updated;
    });
    setEditingIndex(null);
    setEditAssignmentData({ name: '', course: '', dueDate: '' });
  };

  const markAsCompleted = (index) => {
    if (window.confirm('Mark this assignment as completed?')) {
      setAssignments(prev => {
        const updated = [...prev];
        updated[index].completed = true;
        return updated;
      });
    }
  };

  const renderAssignments = (filterFn, sortByDate = false) => {
    let filtered = assignments.filter(filterFn);

    if (sortByDate) {
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    if (filtered.length === 0) return <p>No assignments found.</p>;

    return filtered.map((assignment, idx) => {
      const isOverdue = assignment.dueDate < today && !assignment.completed;
      const globalIndex = assignments.indexOf(assignment);

      if (editingIndex === globalIndex) {
        return (
          <div key={idx} className="assignment-card">
            <input
              type="text"
              value={editAssignmentData.name}
              onChange={(e) => setEditAssignmentData({ ...editAssignmentData, name: e.target.value })}
              className="form-input"
            />
            <select
              value={editAssignmentData.course}
              onChange={(e) => setEditAssignmentData({ ...editAssignmentData, course: e.target.value })}
              className="form-select"
            >
              <option value="">Select Course</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="English">English</option>
            </select>
            <input
              type="date"
              value={editAssignmentData.dueDate}
              onChange={(e) => setEditAssignmentData({ ...editAssignmentData, dueDate: e.target.value })}
              className="form-input"
            />
            <div className="assignment-actions">
              <button onClick={saveEditedAssignment}>Save</button>
              <button onClick={() => setEditingIndex(null)}>Cancel</button>
            </div>
          </div>
        );
      }

      return (
        <div
          key={idx}
          className={`assignment-card ${isOverdue ? 'overdue' : ''}`}
        >
          <h3>{assignment.name}</h3>
          <p>Course: {assignment.course}</p>
          <p>Due Date: {assignment.dueDate}</p>
          {!assignment.completed && (
            <button onClick={() => markAsCompleted(globalIndex)}>Mark as Completed</button>
          )}
          <button onClick={() => handleEditAssignment(globalIndex)}>Edit</button>
          <button onClick={() => handleDeleteAssignment(globalIndex)}>Delete</button>
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

    if (courses.length === 0) return <p>No assignments found.</p>;

    const filteredCourses = selectedCourse === 'All' ? courses : courses.filter(c => c === selectedCourse);

    return (
      <div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="form-select"
        >
          <option value="All">All Courses</option>
          {courses.map((course, idx) => (
            <option key={idx} value={course}>{course}</option>
          ))}
        </select>

        {filteredCourses.map((course, idx) => (
          <div key={idx} className="course-group">
            <h3>{course}</h3>
            {grouped[course].map((assignment, idx2) => {
              const isOverdue = assignment.dueDate < today && !assignment.completed;
              const globalIndex = assignments.indexOf(assignment);

              if (editingIndex === globalIndex) {
                return (
                  <div key={idx2} className="assignment-card">
                    <input
                      type="text"
                      value={editAssignmentData.name}
                      onChange={(e) => setEditAssignmentData({ ...editAssignmentData, name: e.target.value })}
                      className="form-input"
                    />
                    <select
                      value={editAssignmentData.course}
                      onChange={(e) => setEditAssignmentData({ ...editAssignmentData, course: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select Course</option>
                      <option value="Math">Math</option>
                      <option value="Science">Science</option>
                      <option value="History">History</option>
                      <option value="English">English</option>
                    </select>
                    <input
                      type="date"
                      value={editAssignmentData.dueDate}
                      onChange={(e) => setEditAssignmentData({ ...editAssignmentData, dueDate: e.target.value })}
                      className="form-input"
                    />
                    <div className="assignment-actions">
                      <button onClick={saveEditedAssignment}>Save</button>
                      <button onClick={() => setEditingIndex(null)}>Cancel</button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={idx2}
                  className={`assignment-card ${isOverdue ? 'overdue' : ''}`}
                >
                  <h4>{assignment.name}</h4>
                  <p>Due Date: {assignment.dueDate}</p>
                  <button onClick={() => markAsCompleted(globalIndex)}>Mark as Completed</button>
                  <button onClick={() => handleEditAssignment(globalIndex)}>Edit</button>
                  <button onClick={() => handleDeleteAssignment(globalIndex)}>Delete</button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Menu</h3>
        <button onClick={() => { setActiveMenu('upcoming'); setEditingIndex(null); }}>Upcoming Assignments</button>
        <button onClick={() => { setActiveMenu('course'); setEditingIndex(null); }}>Course Assignments</button>
        <button onClick={() => { setActiveMenu('completed'); setEditingIndex(null); }}>Completed Assignments</button>
        <button onClick={() => { setActiveMenu('add'); setEditingIndex(null); }}>Add Assignment</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
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
            <div className="add-assignment-form">
              <input
                type="text"
                placeholder="Assignment Name"
                value={newAssignment.name}
                onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })}
                className="form-input"
              />

              <select
                value={newAssignment.course}
                onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
                className="form-select"
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
                className="form-input"
              />

              <button onClick={handleAddAssignment} className="add-button">Save Assignment</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
