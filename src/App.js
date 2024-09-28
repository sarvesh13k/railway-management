import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AddTrain from './components/AddTrain';
import GetSeatAvailability from './components/GetSeatAvailability';
import BookSeat from './components/BookSeat';
import BookingDetails from './components/BookingDetails';
import Dashboard from './components/dashboard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} /> 
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add-train" element={<AddTrain />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/get-seat-availability" element={<GetSeatAvailability />} />
                <Route path="/book-seat" element={<BookSeat />} />
                <Route path="/booking-details" element={<BookingDetails />} />
            </Routes>
        </Router>
    );
};

export default App;
