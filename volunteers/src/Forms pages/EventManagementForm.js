import React, { useState } from 'react';
import styles from './EventManagementForm.module.css';
import { useNavigate } from 'react-router-dom';

function EventManagementForm() {
  // Form state
  const [form, setForm] = useState({
    eventName: '',
    eventDescription: '',
    location: '',
    requiredSkills: [],
    urgency: '',
    eventDate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Handler for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMultiSelectChange = (e) => {
    const selectedOptions = [...e.target.selectedOptions].map(option => option.value);
    setForm({ ...form, requiredSkills: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:5000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Event created:', data);
            // Optionally reset the form or redirect the user
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
};


  return (
    <div className={styles.eventManagementForm}>
      <h1>Event Management Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Error message */}
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Event Name */}
        <label>
          Event Name:
          <input
            type="text"
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            maxLength="100"
            required
          />
        </label>
        <br />

        {/* Event Description */}
        <label>
          Event Description:
          <textarea
            name="eventDescription"
            value={form.eventDescription}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        {/* Location */}
        <label>
          Location:
          <textarea
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        {/* Required Skills (Multi-select Dropdown) */}
        <label>
          Required Skills:
          <select
            name="requiredSkills"
            value={form.requiredSkills}
            onChange={handleMultiSelectChange}
            multiple
            required
          >
            <option value="Communication">Communication</option>
            <option value="Project Management">Project Management</option>
            <option value="Technical Skills">Technical Skills</option>
            <option value="Leadership">Leadership</option>
          </select>
        </label>
        <br />

        {/* Urgency (Dropdown) */}
        <label>
          Urgency:
          <select
            name="urgency"
            value={form.urgency}
            onChange={handleChange}
            required
          >
            <option value="">Select Urgency</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <br />

        {/* Event Date (Date Picker) */}
        <label>
          Event Date:
          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EventManagementForm;
