// src/components/AddTrain.js
import React, { useState } from 'react';
import API from '../api';

const AddTrain = () => {
  const [trainName, setTrainName] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [totalSeats, setTotalSeats] = useState('');

  const handleAddTrain = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const adminApiKey = 'G20jHafFDIEtE5cXz0IYFrkj6ixCxfBC';  // Admin API key (same as in Flask app)

    try {
      const response = await API.post(
        '/trains', 
        {
          train_name: trainName,
          source: source,
          destination: destination,
          total_seats: totalSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // JWT token
            'API-Key': adminApiKey,  // Admin API key
          }
        }
      );
      alert('Train added successfully!');
    } catch (error) {
      alert('Failed to add train.');
    }
  };

  return (
    <form onSubmit={handleAddTrain}>
      <input
        type="text"
        placeholder="Train Name"
        value={trainName}
        onChange={(e) => setTrainName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Seats"
        value={totalSeats}
        onChange={(e) => setTotalSeats(e.target.value)}
      />
      <button type="submit">Add Train</button>
    </form>
  );
};

export default AddTrain;
