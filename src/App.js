import React from "react";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "white",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <h1>Bay Area Poker – Charts</h1>

      {/* Chart 1 */}
      <iframe
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRXIW4YrYvuI9hwOXACI-HPAn_EX0mRKJO3WNHc9y1rCQbzx3PMgObX5lJToojWZ9fdrPKkZxfK-1hb/pubchart?oid=927464540&format=interactive"
        width="100%"
        height="450"
        style={{ border: "none", background: "white" }}
        loading="lazy"
        title="Chart 1"
      />

      {/* Chart 2 */}
      <iframe
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRXIW4YrYvuI9hwOXACI-HPAn_EX0mRKJO3WNHc9y1rCQbzx3PMgObX5lJToojWZ9fdrPKkZxfK-1hb/pubchart?oid=733910113&format=interactive"
        width="100%"
        height="450"
        style={{ border: "none", background: "white" }}
        loading="lazy"
        title="Chart 2"
      />

      {/* Add more charts as needed */}
    </div>
  );
}
