import React, { useState } from 'react';
import './EventManagementFrom.css';

function EventManagementFrom() {
  // Form state
  const [form, setForm] = useState({
    eventName: '',
    eventDescription: '',
    location: '',
    requiredSkills: [],
    urgency: '',
    eventDate: ''
  });

  // Handler for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMultiSelectChange = (e) => {
    const selectedOptions = [...e.target.selectedOptions].map(option => option.value);
    setForm({ ...form, requiredSkills: selectedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', form);
    // Further actions like form validation and API calls go here
  };

  return (
    <div className="App">
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
          />
        </label>
        <br />

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EventManagementFrom;
