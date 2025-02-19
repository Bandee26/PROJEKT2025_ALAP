import React from 'react';
import './Home.css'; // A háttér animációs stílusok a Home.css-ben lesznek

const Home = () => {
  return (
    <div className="home-container">
      <div className="background-images">
        <div className="image-slide" />
        <div className="image-slide" />
        <div className="image-slide" />
        <div className="image-slide" />
        <div className="image-slide" />
      </div>
      <div className="content">
        <h1>Welcome to the Home Page!</h1>
        <p>Itt lesznek a kezdőoldal tartalmai.</p>
      </div>
    </div>
  );
};

export default Home;
