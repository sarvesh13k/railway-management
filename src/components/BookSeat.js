// src/components/Booking.js
import React, { useState } from 'react';
import API from '../api';

const Booking = () => {
  const [trainId, setTrainId] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
      try {
          const response = await API.post('http://localhost:5000/book', 
          { trainId}, 
          {
              headers: {
                  Authorization: `Bearer ${token}`
                }
            }
            );
            alert("Seat Booked! Thank Your For Booking!! Happy Journey!!!");
    } catch (error) {
        alert(error)
      console.error('Error booking seat:', error);
    }
  };
  
  return (
    <form onSubmit={handleBooking}>
      <input
        type="text"
        placeholder="Train ID"
        value={trainId}
        onChange={(e) => setTrainId(e.target.value)}
      />
      <button type="submit">Book Seat</button>
    </form>
  );
};

export default Booking;
