import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VolunteerHistory.css';

const VolunteerHistory = () => {
    const [history, setHistory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [hoursFilter, setHoursFilter] = useState('All');

    useEffect(() => {
        axios.get('/api/volunteer_history')
            .then(response => {
                setHistory(response.data);
            })
            .catch(error => {
                console.error('Error fetching volunteer history:', error);
            });
    }, []);

    // Filter the history based on search and selected filters
    const filteredHistory = history.filter(entry => {
        const matchesSearch = 
            entry.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.role.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;

        const matchesHours = 
            hoursFilter === 'All' ||
            (hoursFilter === 'Less than 5 hours' && entry.hours < 5) ||
            (hoursFilter === '5-10 hours' && entry.hours >= 5 && entry.hours <= 10) ||
            (hoursFilter === 'More than 10 hours' && entry.hours > 10);

        return matchesSearch && matchesStatus && matchesHours;
    });

    return (
        <div className="volunteer-history">
            <h1>Volunteer History</h1>
            
            <div className="filters-container">
                {/* Search Input */}
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by event name or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Status Filter Dropdown */}
                <select 
                    className="filter-select"
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                </select>

                {/* Hours Filter Dropdown */}
                <select 
                    className="filter-select"
                    value={hoursFilter} 
                    onChange={(e) => setHoursFilter(e.target.value)}
                >
                    <option value="All">All Hours</option>
                    <option value="Less than 5 hours">Less than 5 hours</option>
                    <option value="5-10 hours">5-10 hours</option>
                    <option value="More than 10 hours">More than 10 hours</option>
                </select>
            </div>

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
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.date}</td>
                                <td>{entry.eventName}</td>
                                <td>{entry.role}</td>
                                <td>{entry.hours}</td>
                                <td className={`status ${entry.status.toLowerCase()}`}>{entry.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No matching volunteer history found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VolunteerHistory;
