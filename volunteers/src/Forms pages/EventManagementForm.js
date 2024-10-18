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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };
  
  const handleMultiSelectChange = (e) => {
    const selectedOptions = [...e.target.selectedOptions].map(option => option.value);
    setForm(prevForm => ({ ...prevForm, requiredSkills: selectedOptions }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error before submit
    setSuccess(''); // Reset success message before submit
  
    // Validation: Check if required fields are filled
    if (!form.eventName || !form.eventDescription || !form.location || form.requiredSkills.length === 0 || !form.urgency || !form.eventDate) {
      setError('Please fill in all fields'); // Set error message if validation fails
      return; // Stop the submission process
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/create_events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.eventName,
          content: form.eventDescription,
          location: form.location,
          requiredSkill: form.requiredSkills.join(', '), // Sending skills as comma-separated string
          urgency: form.urgency,
          date: form.eventDate,
          status: 'pending', // Default status
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setSuccess('Event created successfully!');
        setForm({
          eventName: '',
          eventDescription: '',
          location: '',
          requiredSkills: [],
          urgency: '',
          eventDate: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create event');
      }
    } catch (error) {
      setError('Network error: Could not connect to server');
    }
  };
  

  


  return (
    <div className={styles.eventManagementForm}>
      <h1>Event Management Form</h1>
      <form onSubmit={handleSubmit}>
        

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
        {/* Error message */}
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        
        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EventManagementForm;
