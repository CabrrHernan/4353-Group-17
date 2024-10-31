import React, { useState } from 'react';
import styles from './EventManagementForm.module.css';
import { useNavigate } from 'react-router-dom';

function EventManagementForm() {
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
        setError('');
        setSuccess('');
  
        // Validation
        if (!form.eventName || !form.eventDescription || !form.location || form.requiredSkills.length === 0 || !form.urgency || !form.eventDate) {
            setError('Please fill in all fields');
            return;
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
                    requiredSkill: form.requiredSkills.join(', '),
                    urgency: form.urgency,
                    date: form.eventDate,
                    status: 'pending',
                }),
            });
  
            if (response.ok) {
                const data = await response.json();
                setSuccess('Event created successfully!');
                setTimeout(() => {
                    setSuccess('');
                    navigate('/events'); // Redirect after success
                }, 3000);
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
                        onChange={handleMultiSelectChange}
                        multiple
                        required
                    >
                        <option value="Communication" selected={form.requiredSkills.includes("Communication")}>Communication</option>
                        <option value="Project Management" selected={form.requiredSkills.includes("Project Management")}>Project Management</option>
                        <option value="Technical Skills" selected={form.requiredSkills.includes("Technical Skills")}>Technical Skills</option>
                        <option value="Leadership" selected={form.requiredSkills.includes("Leadership")}>Leadership</option>
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
                
                {/* Error and Success Messages */}
                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}
                
                {/* Submit Button */}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default EventManagementForm;
