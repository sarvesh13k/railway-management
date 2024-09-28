import React, { useState } from 'react';
import axios from 'axios';
import './GetSeatAvailability.css';

const GetSeatAvailability = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [trains, setTrains] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.get(`http://localhost:5000/get_seat_availability?source=${source}&destination=${destination}`);
        setTrains(response.data); // Assume response contains the train data
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Source"
                    required
                />
                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Destination"
                    required
                />
                <button type="submit">Check Availability</button>
            </form>
            <ul>
                {trains.map(train => (
                    <li key={train.id}>{train.name} - Seats Available: {train.available_seats}</li>
                ))}
            </ul>
        </div>
    );
};

export default GetSeatAvailability;
