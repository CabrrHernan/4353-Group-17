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

  // Fetch reports from APIs
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');

      const [volunteerResponse, eventResponse] = await Promise.all([
        fetch('http://127.0.0.1:5000/report/volunteers?format=json'),
        fetch('http://127.0.0.1:5000/report/events?format=json'),
      ]);

      const volunteerData = await volunteerResponse.json();
      const eventData = await eventResponse.json();

      if (!volunteerResponse.ok || !eventResponse.ok) {
        throw new Error('Failed to fetch reports');
      }

      setVolunteerReport(volunteerData);
      setEventReport(eventData);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  // Download reports
  const downloadReport = async (type, format) => {
    try {
      const url = `http://127.0.0.1:5000/report/${type}?format=${format}`;
      const response = await fetch(url);

      if (response.ok) {
        const blob = await response.blob();
        const fileName = `${type}_report.${format}`;
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        throw new Error(`Failed to download ${type} report`);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to download ${type} report`);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="reports-page">
      <h1>Admin Reports</h1>

      {/* Volunteer Report Section */}
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
                  <th>Skills</th>
                  <th>Participated Events</th>
                </tr>
              </thead>
              <tbody>
                {currentVolunteers.map((volunteer, index) => (
                  <tr key={index}>
                    <td>{volunteer.username}</td>
                    <td>{volunteer.email}</td>
                    <td>{volunteer.skills || 'No Skills'}</td>
                    <td>{volunteer.participated_events.join(', ') || 'No Events'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Volunteer Pagination */}
            <div className="pagination-controls">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from(
                { length: Math.ceil(volunteerReport.length / volunteersPerPage) },
                (_, index) => (
                  <button key={index} onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                )
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(volunteerReport.length / volunteersPerPage)}
              >
                Next
              </button>
            </div>
          </>
        )}
        {/* Download Volunteer Report */}
        <div className="download-button">
          <button onClick={() => downloadReport('volunteers', 'csv')}>Download Volunteer Report (CSV)</button>
          <button onClick={() => downloadReport('volunteers', 'pdf')}>Download Volunteer Report (PDF)</button>
        </div>
      </section>

      {/* Event Report Section */}
      <section>
        <h2>Event Report</h2>
        {eventReport.length === 0 ? (
          <p>No event data available.</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Event Start Date</th>
                  <th>Volunteers Assigned</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.map((event, index) => (
                  <tr key={index}>
                    <td>{event.name || 'Unknown Event'}</td>
                    <td>{new Date(event.start_date).toLocaleDateString() || 'N/A'}</td>
                    <td>{event.volunteers_assigned.join(', ') || 'No Volunteers'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Event Pagination */}
            <div className="pagination-controls">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from(
                { length: Math.ceil(eventReport.length / eventsPerPage) },
                (_, index) => (
                  <button key={index} onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                )
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(eventReport.length / eventsPerPage)}
              >
                Next
              </button>
            </div>
          </>
        )}
        {/* Download Event Report */}
        <div className="download-button">
          <button onClick={() => downloadReport('events', 'csv')}>Download Event Report (CSV)</button>
          <button onClick={() => downloadReport('events', 'pdf')}>Download Event Report (PDF)</button>
        </div>
      </section>
    </div>
  );
};

export default Reports;
