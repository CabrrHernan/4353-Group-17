import React, { useState, useEffect } from 'react';
import styles from './VolunteerMatchingForm.module.css';

function VolunteerMatchingForm() {
  const [volunteer, setVolunteer] = useState(null);
  const [matchedEvent, setMatchedEvent] = useState(null);
  const [manualEvent, setManualEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(''); // Add error state
  const [success, setSuccess] = useState(''); // Add success state

  useEffect(() => {
    const fetchVolunteer = async () => {
      const volunteerResponse = await fetch('/api/volunteers');
      const volunteerData = await volunteerResponse.json();
      setVolunteer(volunteerData[0]); // For demo, auto-select the first volunteer
    };

    const fetchEvents = async () => {
      const eventResponse = await fetch('/api/events');
      const eventData = await eventResponse.json();
      setEvents(eventData);
    };

    fetchVolunteer();
    fetchEvents();
  }, []);

  const matchEvent = async () => {
    const response = await fetch('/api/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        volunteer_id: volunteer?.id,
        manual_event_id: manualEvent ? parseInt(manualEvent) : null,
      }),
    });

    if (response.ok) {
      const matchData = await response.json();
      setMatchedEvent(matchData.event);
      setSuccess('Volunteer matched successfully!'); // Set success message
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Failed to match volunteer'); // Set error message
    }
  };

  const handleManualEventChange = (e) => {
    setManualEvent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error before submission
    setMatchedEvent(null); // Reset matched event

    await matchEvent(); // Call matchEvent function
  };

  return (
    <div className={styles.volunteerMatchingForm}>
      <h1>Volunteer Matching Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Volunteer Name (Auto-filled) */}
        <label>
          Volunteer Name:
          <input type="text" value={volunteer ? volunteer.name : ''} readOnly />
        </label>
        <br />

        {/* Matched Event (Auto-filled based on profile) */}
        <label>
          Matched Event:
          <input type="text" value={matchedEvent ? matchedEvent.title : 'No match found'} readOnly />
        </label>
        <br />

        {/* Option to manually select another event */}
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

        {/* Error message */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Success message */}
        {success && <div className={styles.success}>{success}</div>}

        {/* Submit Button */}
        <button type="submit">Submit Match</button>
      </form>
    </div>
  );
}

export default VolunteerMatchingForm;
