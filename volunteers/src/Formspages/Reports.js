import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reports.css';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';

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
  
  useEffect(() => {
    // Fetch both volunteer and event reports
    Promise.all([
      axios.get('/report/volunteers'),
      axios.get('/report/events')
    ])
      .then(([volunteerResponse, eventResponse]) => {
        setVolunteerReport(volunteerResponse.data);
        setEventReport(eventResponse.data);
      })
      .catch(error => {
        setError('Failed to fetch reports.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Volunteer Report', 10, 10);

    currentVolunteers.forEach((volunteer, index) => {
      doc.text(`Username: ${volunteer.username}`, 10, 20 + (index * 10));
      doc.text(`Email: ${volunteer.email}`, 10, 25 + (index * 10));
      doc.text(`Location: ${volunteer.location}`, 10, 30 + (index * 10));
      doc.text(`Skills: ${volunteer.skills}`, 10, 35 + (index * 10));
      doc.text(`Participated Events: ${volunteer.participated_events.join(', ')}`, 10, 40 + (index * 10));
    });

    doc.save('volunteer_report.pdf');
  };

  // Export to CSV
  const exportToCSV = () => {
    const volunteersData = currentVolunteers.map(volunteer => ({
      Username: volunteer.username,
      Email: volunteer.email,
      Location: volunteer.location,
      Skills: volunteer.skills,
      'Participated Events': volunteer.participated_events.join(', ')
    }));
    
    const csv = Papa.unparse(volunteersData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'volunteer_report.csv';
    link.click();
  };

  return (
    <div className="reports-page">
      <h1>Admin Reports</h1>

      <section>
        <h2>Volunteer Report</h2>
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

        {/* Export Buttons */}
        <div>
          <button onClick={exportToPDF}>Export to PDF</button>
          <button onClick={exportToCSV}>Export to CSV</button>
        </div>
      </section>

      <section>
        <h2>Event Report</h2>
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

        {/* Pagination Controls for Events */}
        <div>
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: Math.ceil(eventReport.length / eventsPerPage) }, (_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>{index + 1}</button>
          ))}

          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === Math.ceil(eventReport.length / eventsPerPage)}
          >
            Next
          </button>
        </div>

        {/* Export Buttons */}
        <div>
          <button onClick={exportToPDF}>Export to PDF</button>
          <button onClick={exportToCSV}>Export to CSV</button>
        </div>
      </section>
    </div>
  );
};

export default Reports;
