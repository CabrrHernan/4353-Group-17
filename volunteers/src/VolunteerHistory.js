import React from 'react';

const VolunteerHistory = () => {
    // Dummy data for volunteer history
    const volunteerHistory = [
        { date: '2023-05-10', role: 'Event Helper', hours: 4 },
        { date: '2023-07-22', role: 'Fundraiser', hours: 6 },
        { date: '2023-08-14', role: 'Social Media Coordinator', hours: 3 },
    ];

    return (
        <div>
            <h1>Volunteer History</h1>
            <ul>
                {volunteerHistory.map((entry, index) => (
                    <li key={index}>
                        {entry.date} - {entry.role} - {entry.hours} hours
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VolunteerHistory;
