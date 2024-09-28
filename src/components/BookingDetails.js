import React, { useState } from 'react';
import axios from 'axios';
import './BookingDetails.css';

const BookingDetails = () => {
    const [bookingId, setBookingId] = useState('');
    const [details, setDetails] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.get(`http://localhost:5000/get_booking_details?booking_id=${bookingId}`);
        setDetails(response.data); // Assume response contains booking details
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    placeholder="Booking ID"
                    required
                />
                <button type="submit">Get Booking Details</button>
            </form>
            {details && (
                <div>
                    <h3>Booking Details</h3>
                    {/* Render details here */}
                </div>
            )}
        </div>
    );
};

export default BookingDetails;
