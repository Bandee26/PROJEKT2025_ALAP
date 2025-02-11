import React, { useState, useEffect } from "react";
import "../components/Imageslider.css"; // CSS fájl
import audi from "../assets/audi.jpg";
import bmw from "../assets/bmw.jpg";
import ford from "../assets/ford.jpg";
import toyota from "../assets/toyota.jpg";
import volkswagen from "../assets/volkswagen.jpg";

const images = [audi, bmw, ford, toyota, volkswagen];

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // 4 másodpercenként vált

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Car ${index}`}
          className={index === currentIndex ? "slider-image active" : "slider-image"}
        />
      ))}
    </div>
  );
}

export default ImageSlider;
