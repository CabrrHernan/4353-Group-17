import React, { useState, useEffect } from 'react';
import './Reports.css';

const Reports = () => {
  const [volunteerReport, setVolunteerReport] = useState([]);
  const [eventReport, setEventReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [volunteersPerPage, setVolunteersPerPage] = useState(10);
  const [eventsPerPage, setEventsPerPage] = useState(10);

  // Dummy Data
  const dummyVolunteerData = [
    { username: 'john_doe', email: 'john@example.com', location: 'Tokyo', skills: 'Programming, Leadership', participated_events: ['Event1', 'Event2'] },
    { username: 'jane_smith', email: 'jane@example.com', location: 'Osaka', skills: 'Design, Communication', participated_events: ['Event3', 'Event4'] },
    // Add more volunteers here...
  ];

  

  // Pagination logic for volunteers
  const indexOfLastVolunteer = currentPage * volunteersPerPage;
  const indexOfFirstVolunteer = indexOfLastVolunteer - volunteersPerPage;
  const currentVolunteers = volunteerReport.slice(indexOfFirstVolunteer, indexOfLastVolunteer);

  // Pagination logic for events
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventReport.slice(indexOfFirstEvent, indexOfLastEvent);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchEventReport = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch('http://127.0.0.1:5000/report/events?format=json');
        if (!response.ok) {
          throw new Error('Failed to fetch event report');
        }
        const data = await response.json();
        setEventReport(data); // Set the fetched data
        setVolunteerReport(dummyVolunteerData); // Use dummy volunteer data
        setLoading(false); // Stop loading
      } catch (err) {
        console.error('Error fetching event report:', err);
        setError('Failed to load event report');
        setLoading(false);
      }
    };
  
    fetchEventReport();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  

  // If still loading, show loading text
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error, display it
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="reports-page">
      <h1>Admin Reports</h1>

      <section>
        <h2>Volunteer Report</h2>
        {volunteerReport.length === 0 ? (
          <p>No volunteer data available.</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Skills</th>
                  <th>Participated Events</th>
                </tr>
              </thead>
              <tbody>
                {currentVolunteers.map((volunteer, index) => (
                  <tr key={index}>
                    <td>{volunteer.username}</td>
                    <td>{volunteer.email}</td>
                    <td>{volunteer.location}</td>
                    <td>{volunteer.skills}</td>
                    <td>{volunteer.participated_events.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div>
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: Math.ceil(volunteerReport.length / volunteersPerPage) }, (_, index) => (
                <button key={index} onClick={() => paginate(index + 1)}>{index + 1}</button>
              ))}

              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === Math.ceil(volunteerReport.length / volunteersPerPage)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>

      <section>
        <h2>Event Report</h2>
        {eventReport.length === 0 ? (
          <p>No event data available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Event Date</th>
                <th>Volunteers Assigned</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map((event, index) => (
                <tr key={index}>
                  <td>{event.event_name}</td>
                  <td>{event.event_date}</td>
                  <td>{event.volunteers_assigned.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Reports;
