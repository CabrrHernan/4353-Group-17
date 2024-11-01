import React, { useState, useEffect } from 'react';
import styles from './VolunteerMatchingForm.module.css';
import axios from 'axios';

function VolunteerMatchingForm() {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [manualEvent, setManualEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); // Store filtered events
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch volunteers');
        const volunteerData = await response.json();
        setVolunteers(volunteerData);
      } catch (error) {
        console.error('Failed to fetch volunteers:', error);
        setError('Could not load volunteers. Please try again later.');
      }
    };

    const fetchEvents = async () => {
      try {
        const eventResponse = await fetch('/api/events');
        if (!eventResponse.ok) throw new Error('Failed to fetch events');
        const eventData = await eventResponse.json();
        setEvents(eventData);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Could not load events. Please try again later.');
      }
    };

    fetchVolunteers();
    fetchEvents();
  }, []);

  useEffect(() => {
    const volunteer = volunteers.find(vol => vol.id === selectedVolunteerId);
    
    if (volunteer) {
      // Split the volunteer's skills into an array
      const skillsArray = volunteer.skills.split(',').map(skill => skill.trim());

      // Filter events based on the selected volunteer's skills
      const filtered = events.filter(event => {
        const requiredSkillsArray = event.required_skills.split(',').map(skill => skill.trim());
        // Check if there is any intersection between the skills
        return requiredSkillsArray.some(requiredSkill => skillsArray.includes(requiredSkill));
      });
      
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events); // Reset to all events if no volunteer is selected
    }
  }, [selectedVolunteerId, events, volunteers]);

  const handleVolunteerChange = (e) => {
    setSelectedVolunteerId(e.target.value);
    setManualEvent(''); // Reset manual event selection when volunteer changes
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
            status: 'pending', // Explicitly set the status to pending
        });

        if (response.status === 200) {
            setSuccess('Volunteer matched successfully!');
            setError('');
            // Reset the form
            setSelectedVolunteerId('');
            setManualEvent('');
            setFilteredEvents([]);
            // Optionally, reset success message after a few seconds
            setTimeout(() => setSuccess(''), 3000);
        }
    } catch (error) {
        console.error('Error response:', error.response);
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
                {volunteer.username}
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
            {filteredEvents.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} {/* Use event.name instead of event.title */}
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* Error and Success Messages */}
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Submit Button */}
        <button type="submit" disabled={!selectedVolunteerId || !manualEvent}>
          Submit Match
        </button>
      </form>
    </div>
  );
}

export default VolunteerMatchingForm;
