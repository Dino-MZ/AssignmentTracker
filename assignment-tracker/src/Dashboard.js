import React, { useState } from 'react';

function Dashboard({ username }) {
  const [activeMenu, setActiveMenu] = useState('upcoming');

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
      <div style={{ flex: 1, padding: '2rem' }}>
        <h2>Welcome, {username}!</h2>
        <div>
          {activeMenu === 'upcoming' && <p>Upcoming Assignments Menu</p>}
          {activeMenu === 'course' && <p>Course Assignments Menu</p>}
          {activeMenu === 'completed' && <p>Completed Assignments Menu</p>}
          {activeMenu === 'add' && <p>Add Assignment Menu</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;