import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Welcome to the Dashboard</h2>
      <p>This is the dashboard page.</p>
      
      <button onClick={() => (window.location.href = '/add-train')}>Add Train</button>
      <button onClick={() => (window.location.href = '/get-seat-availability')}>Get Seat Availability</button>
      <button onClick={() => (window.location.href = '/book-seat')}>Book Seat</button>
      <button onClick={() => (window.location.href = '/booking-details')}>Booking Details</button>
      
    </div>
  );
};

export default Dashboard;
