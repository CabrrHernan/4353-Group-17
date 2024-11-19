import './Admin.css';
import React, { useState, useEffect } from 'react';

function Admin() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [isFull, setIsFull] = useState(false);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setEvents(data);
      } else {
        alert(data.message || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      name,
      description,
      location,
      required_skills: requiredSkills,
      urgency_level: urgencyLevel,
      start_date: startDate,
      end_date: endDate,
      capacity,
      is_full: isFull,
    };

    try {
      const response = await fetch('/api/create_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Event created successfully');
        setName('');
        setDescription('');
        setLocation('');
        setRequiredSkills('');
        setUrgencyLevel('');
        setStartDate('');
        setEndDate('');
        setCapacity('');
        setIsFull(false);
        fetchEvents();
      } else {
        alert(data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(filter.toLowerCase()) ||
    event.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Here you can manage events and users.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label>Required Skills:</label>
          <input
            type="text"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Urgency Level:</label>
          <input
            type="number"
            value={urgencyLevel}
            onChange={(e) => setUrgencyLevel(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Capacity:</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Is Full:</label>
          <input
            type="checkbox"
            checked={isFull}
            onChange={(e) => setIsFull(e.target.checked)}
          />
        </div>
        <button type="submit">Create Event</button>
      </form>

      <h2>Event Reports</h2>
      <input
        type="text"
        placeholder="Filter events"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul>
        {filteredEvents.map(event => (
          <li key={event.id}>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <p>Location: {event.location}</p>
            <p>Required Skills: {event.required_skills}</p>
            <p>Urgency Level: {event.urgency_level}</p>
            <p>Start Date: {new Date(event.start_date).toLocaleString()}</p>
            <p>End Date: {new Date(event.end_date).toLocaleString()}</p>
            <p>Capacity: {event.capacity}</p>
            <p>Is Full: {event.is_full ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;