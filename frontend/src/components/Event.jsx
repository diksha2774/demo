import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Event = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    venue: '',
    event_type: 'conference',
    chief_guest: '',
    public_event: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/event", eventData);
      console.log('Event Data:', response.data);
      navigate('/Allevents', { state: { eventData: response.data } });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="event-page">
      <div className="event-container">
        <h1>Create New Event</h1>
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Event Name*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
              placeholder="Enter event name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Event Description*</label>
            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              required
              placeholder="Enter event description"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date*</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={eventData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_date">End Date*</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={eventData.end_date}
                onChange={handleChange}
                required
                min={eventData.start_date}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_time">Start Time*</label>
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={eventData.start_time}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_time">End Time*</label>
              <input
                type="time"
                id="end_time"
                name="end_time"
                value={eventData.end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="venue">Venue*</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={eventData.venue}
              onChange={handleChange}
              required
              placeholder="Enter event venue"
            />
          </div>

          <div className="form-group">
            <label htmlFor="event_type">Event Type*</label>
            <select
              id="event_type"
              name="event_type"
              value={eventData.event_type}
              onChange={handleChange}
              required
            >
              <option value="conference">Conference</option>
              <option value="concert">Concert</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday</option>
            </select>
          </div>

          <div className="form-buttons">
            <button type="button" onClick={() => navigate('/')} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Event & Design Poster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Event; 