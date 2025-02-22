import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

// Import images directly
import backgroundImg from '../assets/Background.png';
import conferenceImg from '../assets/Conference.png';
import concertImg from '../assets/concert.png';
import weddingImg from '../assets/wedding.png';
import birthdayImg from '../assets/birthday.png';

const pageStyle = {
  backgroundImage: `url(${backgroundImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh'
};

// Category image mapping
const categoryImages = {
  conference: conferenceImg,
  concert: concertImg,
  wedding: weddingImg,
  birthday: birthdayImg,
};

// Add a function to get image for any event type
const getEventImage = (eventType) => {
  try {
    const imagePath = categoryImages[eventType.toLowerCase()] || categoryImages.other;
    console.log('Loading image for event type:', eventType, 'Path:', imagePath);
    return imagePath;
  } catch (error) {
    console.error('Error loading image for event type:', eventType);
    return categoryImages.other;
  }
};

const Allevents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/event');
        if (response.data) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString.slice(0, 5);
  };

  const isDateInRange = (eventStartDate, eventEndDate, filterDate) => {
    // Convert all dates to Date objects for comparison
    const start = new Date(eventStartDate);
    const end = new Date(eventEndDate);
    const filter = new Date(filterDate);

    // Reset time part for accurate date comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    filter.setHours(0, 0, 0, 0);

    // Check if filter date falls between start and end dates (inclusive)
    return filter >= start && filter <= end;
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = filterCategory === 'all' || event.event_type === filterCategory;
    const matchesDate = !filterDate || isDateInRange(event.start_date, event.end_date, filterDate);
    return matchesCategory && matchesDate;
  });

  return (
    <div className="allevents-page" style={pageStyle}>
      <div className="sidebar">
        <div className="filter-box">
          <label>Category</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="conference">Conference</option>
            <option value="concert">Concert</option>
            <option value="wedding">Wedding</option>
            <option value="birthday">Birthday</option>
          </select>
        </div>
        <div className="filter-box">
          <label>Date</label>
          <input 
            type="date" 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)} 
          />
        </div>
      </div>

      <div className="allevents-container">
        {loading ? (
          <div className="loading-spinner">
            <p>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="no-events">
            <h3>No events found</h3>
            <p>Try adjusting your filter criteria</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-image">
                  <img 
                    src={getEventImage(event.event_type)} 
                    alt={event.event_type}
                    onError={(e) => {
                      console.log('Image failed to load:', e.target.src);
                      e.target.src = categoryImages.other;
                    }}
                  />
                </div>
                <h2 className="event-title">{event.title}</h2>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <div>
                    <FaCalendarAlt /> {formatDate(event.start_date)}
                  </div>
                  <div>
                    <FaClock /> {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </div>
                  <div>
                    <FaMapMarkerAlt /> {event.venue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Allevents;
