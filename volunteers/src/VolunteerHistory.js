import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VolunteerHistory.css'; // Add styling as needed

const VolunteerHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Fetch volunteer history from the backend API
        axios.get('/api/volunteer_history')
            .then(response => {
                setHistory(response.data);
            })
            .catch(error => {
                console.error('Error fetching volunteer history:', error);
            });
    }, []);

    return (
        <div className="volunteer-history">
            <h1>Volunteer History</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Event Name</th>
                        <th>Role</th>
                        <th>Hours</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length > 0 ? (
                        history.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.date}</td>
                                <td>{entry.eventName}</td>
                                <td>{entry.role}</td>
                                <td>{entry.hours}</td>
                                <td>{entry.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No volunteer history available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VolunteerHistory;
