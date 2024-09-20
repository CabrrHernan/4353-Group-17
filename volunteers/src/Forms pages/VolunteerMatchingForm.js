import React, { useState, useEffect } from 'react';
import styles from './VolunteerMatchingForm.module.css';
import { useNavigate } from 'react-router-dom';


// Mock data for demonstration (replace with actual database calls)
const volunteerData = [
  { id: 1, name: 'John Doe', profile: 'Programming' },
  { id: 2, name: 'Jane Smith', profile: 'Project Management' },
];

const eventData = [
  { id: 1, name: 'Hackathon', requiredSkill: 'Programming' },
  { id: 2, name: 'Fundraising Campaign', requiredSkill: 'Project Management' },
];

function VolunteerMatchingForm() {
  // Form state
  const [volunteer, setVolunteer] = useState(null);
  const [matchedEvent, setMatchedEvent] = useState(null);
  const [manualEvent, setManualEvent] = useState('');

  // Simulate fetching volunteer from database and matching event
  useEffect(() => {
    const fetchVolunteer = () => {
      const selectedVolunteer = volunteerData[0]; // Fetching first volunteer for demo
      setVolunteer(selectedVolunteer);
      matchEvent(selectedVolunteer);
    };
    fetchVolunteer();
  }, []);

  // Match event based on volunteer's profile
  const matchEvent = (volunteer) => {
    const matched = eventData.find((event) => event.requiredSkill === volunteer.profile);
    setMatchedEvent(matched);
  };

  const handleManualEventChange = (e) => {
    const selectedEventId = e.target.value;
    const selectedEvent = eventData.find(event => event.id === parseInt(selectedEventId));
    setManualEvent(selectedEvent);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Volunteer:', volunteer);
    console.log('Matched Event:', matchedEvent || manualEvent);
  };

  return (
    <div className={styles.volunteerMatchingForm}>
      <h1>Volunteer Matching Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Volunteer Name (Auto-filled) */}
        <label>
          Volunteer Name:
          <input
            type="text"
            value={volunteer ? volunteer.name : ''}
            readOnly
          />
        </label>
        <br />

        {/* Matched Event (Auto-filled based on profile) */}
        <label>
          Matched Event:
          <input
            type="text"
            value={matchedEvent ? matchedEvent.name : 'No match found'}
            readOnly
          />
        </label>
        <br />

        {/* Option to manually select another event */}
        <label>
          Manually Select Event:
          <select onChange={handleManualEventChange} value={manualEvent ? manualEvent.id : ''}>
            <option value="">-- Select Event --</option>
            {eventData.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* Submit Button */}
        <button type="submit">Submit Match</button>
      </form>
    </div>
  );
}

export default VolunteerMatchingForm;