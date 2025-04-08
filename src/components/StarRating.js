import React, { useState } from "react";

const StarRating = ({ rating, onRatingChange, isEditable = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (newRating) => {
    if (isEditable && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating) => {
    if (isEditable) {
      setHoverRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (isEditable) {
      setHoverRating(0);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || rating; // Show hovered rating if applicable
    const fullStars = Math.floor(displayRating);
    const fractionalPart = displayRating - fullStars;
    
    // Render full stars
    for (let i = 1; i <= fullStars; i++) {
      stars.push(
        <span
          key={`full-${i}`}
          style={{ cursor: isEditable ? "pointer" : "default", color: "gold", fontSize: "24px" }}
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </span>
      );
    }

    // Render half star if fractional part exists
    if (fractionalPart > 0) {
      stars.push(
        <span
          key="half"
          style={{
            position: "relative",
            fontSize: "24px",
            cursor: isEditable ? "pointer" : "default",
          }}
        >
          <span style={{ color: "gold", position: "absolute", clipPath: `polygon(0 0, ${fractionalPart * 100}% 0, ${fractionalPart * 100}% 100%, 0% 100%)` }}>
            ★
          </span>
          <span style={{ color: "gray" }}>★</span>
        </span>
      );
    }

    // Render remaining empty stars
    const remainingStars = 5 - Math.ceil(displayRating);
    for (let i = 1; i <= remainingStars; i++) {
      stars.push(
        <span
          key={`empty-${i}`}
          style={{ cursor: isEditable ? "pointer" : "default", color: "gray", fontSize: "24px" }}
          onClick={() => handleClick(fullStars + i)}
          onMouseEnter={() => handleMouseEnter(fullStars + i)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </span>
      );
    }

    return stars;
  };

  return <div style={{ display: "flex", gap: "2px" }}>{renderStars()}</div>;
};

export default StarRating;
