import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// import StarRating from "./StarRating";
// import { useState } from "react";

// function StarRatingProto1() {
//   const [rateMessage, setRateMessage] = useState(0);

//   return (
//     <div>
//       <StarRating
//         maxRating={5}
//         color="orange"
//         fontSize="1.2rem"
//         message={[
//           "Terrible 😫",
//           "Bad 😞",
//           "Good 🙂",
//           "Better 🤗",
//           "Excellent 😍",
//         ]}
//         onRate={setRateMessage}
//       />
//       <p style={{ textAlign: "center" }}>
//         This movie was rated {rateMessage} star
//       </p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRatingProto1 /> */}
    {/* <StarRating
      maxRating={10}
      color="red"
      fontSize="1.2rem"
      defaultRating={0}
    /> */}
  </React.StrictMode>
);
