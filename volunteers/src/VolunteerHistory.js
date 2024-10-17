import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VolunteerHistory.css';

const VolunteerHistory = () => {
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });

    useEffect(() => {
        axios.get('/api/volunteer_history')
            .then(response => {
                setHistory(response.data);
            })
            .catch(error => {
                console.error('Error fetching volunteer history:', error);
            });
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const sortedHistory = [...history].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredHistory = sortedHistory.filter((entry) =>
        entry.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="volunteer-history">
            <h1>Volunteer History</h1>
            <input
                type="text"
                placeholder="Search by event, role, or status"
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('date')}>Date</th>
                        <th onClick={() => handleSort('eventName')}>Event Name</th>
                        <th onClick={() => handleSort('role')}>Role</th>
                        <th onClick={() => handleSort('hours')}>Hours</th>
                        <th onClick={() => handleSort('status')}>Status</th>
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
                            <td colSpan="5">No volunteer history available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VolunteerHistory;
