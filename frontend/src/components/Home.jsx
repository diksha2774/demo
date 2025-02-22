import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to Creative Studio</h1>
      <div className="button-container">
        <button 
          className="home-btn poster-btn"
          onClick={() => navigate('/poster')}
        >
          <span>Create Poster</span>
        </button>
        <button 
          className="home-btn event-btn"
          onClick={() => navigate('/event')}
        >
          <span>Create Event</span>
        </button>
        <button 
          className="home-btn event-btn"
          onClick={() => navigate('/Allevents')}
        >
          <span>View All Event</span>
        </button>

      </div>
    </div>
  );
};

export default Home; 