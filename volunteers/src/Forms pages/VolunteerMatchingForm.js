import React, { useState, useEffect } from 'react';
import styles from './VolunteerMatchingForm.module.css';
import axios from 'axios';

function VolunteerMatchingForm() {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [manualEvent, setManualEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/volunteers');
        const volunteerData = await response.json();
        setVolunteers(volunteerData);
      } catch (error) {
        console.error('Failed to fetch volunteers:', error);
      }
    };

    const fetchEvents = async () => {
      try {
        const eventResponse = await fetch('/api/events');
        const eventData = await eventResponse.json();
        setEvents(eventData);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchVolunteers();
    fetchEvents();
  }, []);

  const handleVolunteerChange = (e) => {
    setSelectedVolunteerId(e.target.value);
  };

  const handleManualEventChange = (e) => {
    setManualEvent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/match', {
        volunteer_id: selectedVolunteerId,
        manual_event_id: manualEvent || null,
      });

      if (response.status === 200) {
        setSuccess('Volunteer matched successfully!');
        setError('');
      }
    } catch (error) {
      console.error('Error response:', error.response);  // Log the full error response for debugging
      setError(error.response ? error.response.data.message : 'Failed to match volunteer');
      setSuccess('');
    }
};


  return (
    <div className={styles.volunteerMatchingForm}>
      <h1>Volunteer Matching Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Volunteer Dropdown */}
        <label>
          Select Volunteer:
          <select onChange={handleVolunteerChange} value={selectedVolunteerId}>
            <option value="">-- Select Volunteer --</option>
            {volunteers.map((volunteer) => (
              <option key={volunteer.id} value={volunteer.id}>
                {volunteer.name}
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* Manually Select Event */}
        <label>
          Manually Select Event:
          <select onChange={handleManualEventChange} value={manualEvent}>
            <option value="">-- Select Event --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* Error and Success Messages */}
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Submit Button */}
        <button type="submit">Submit Match</button>
      </form>
    </div>
  );
}

export default VolunteerMatchingForm;

