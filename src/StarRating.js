import React, { useState } from "react";
import { AiTwotoneStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import PropTypes from "prop-types";

StarRating.propTypes = {
  maxRating: PropTypes.number,
  color: PropTypes.string,
  message: PropTypes.array,
  onRate: PropTypes.func,
  defaultRating: PropTypes.number,
  fontSize: PropTypes.string,
};

const StarsContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "3px",
};

function StarRating({
  maxRating,
  color = "",
  fontSize = "1.5rem",
  message = [],
  defaultRating = 0,
  onRate,
}) {
  const [clickStar, setClickStar] = useState(defaultRating);
  const [hoverStar, setHoverStar] = useState(0);

  const handleRating = function (rate) {
    setClickStar(rate);
    if (!onRate) return;
    onRate(rate);
  };

  return (
    <ul style={StarsContainer}>
      {Array.from({ length: maxRating }, (_, i) => (
        <StarList
          key={i}
          onClickStar={() => handleRating(i + 1)}
          onHoverIn={() => setHoverStar(i + 1)}
          onHoverOut={() => setHoverStar(0)}
          filledStar={hoverStar ? hoverStar >= i + 1 : clickStar >= i + 1}
          color={color}
          fontSize={fontSize}
          message={message}
        />
      ))}
      <span
        style={{
          color: color,
          marginLeft: "1px",
          width: "1rem",
          height: "1rem",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {message.length === maxRating
          ? message[hoverStar - 1] || message[clickStar - 1]
          : hoverStar ||
            clickStar || (
              <div style={{ opacity: "0", width: "2rem", height: "2rem" }}>
                0
              </div>
            )}
      </span>
    </ul>
  );
}

// const starText = {
//   marginLeft: "10px",

// };

function StarList({
  onClickStar,
  filledStar,
  onHoverIn,
  onHoverOut,
  color,
  fontSize,
}) {
  const starList = {
    listStyle: "none",
    cursor: "pointer",
    color,
    fontSize,
  };

  return (
    <li
      style={starList}
      onClick={onClickStar}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {filledStar ? <AiTwotoneStar /> : <AiOutlineStar />}
    </li>
  );
}

export default StarRating;
