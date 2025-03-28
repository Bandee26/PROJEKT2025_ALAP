import React from 'react';

const Video = () => {
  return (
    <video 
      autoPlay 
      loop 
      muted 
      playsInline 
      className="background-video"
    >
      <source src={`${process.env.PUBLIC_URL}/video.mp4`} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;
