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
        <h1>Üdvözöllek a B&K autókereskedés hivatalos oldalán!</h1>
        <p></p>
      </div>
    </div>
  );
};

export default Home;
