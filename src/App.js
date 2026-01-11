import React from "react";

const ChartCard = ({ title, src }) => (
  <div
    style={{
      width: "100%",
      maxWidth: "900px",
      backgroundColor: "#1a1a1a",
      borderRadius: "12px",
      padding: "1rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    }}
  >
    <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>{title}</h2>

    <iframe
      src={src}
      title={title}
      style={{
        width: "100%",
        height: "750px",
        border: "none",
        background: "white",
        borderRadius: "8px",
        display: "block",
      }}
      loading="lazy"
      scrolling="no"
    />
  </div>
);

const ChartCard2 = ({ title, src }) => (
  <div
    style={{
      width: "100%",
      maxWidth: "900px",
      backgroundColor: "#1a1a1a",
      borderRadius: "12px",
      padding: "1rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    }}
  >
    <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>{title}</h2>

    <iframe
      src={src}
      title={title}
      style={{
        width: "100%",
        height: "600px",
        border: "none",
        background: "white",
        borderRadius: "8px",
        display: "block",
      }}
      loading="lazy"
      scrolling="no"
    />
  </div>
);

const TableCard = ({ title, data }) => {
  const columns = Object.keys(data[0]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        padding: "1rem",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>{title}</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  borderBottom: "2px solid white",
                  padding: "0.5rem",
                  textAlign: "left",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td
                  key={col}
                  style={{
                    borderBottom: "1px solid #555",
                    padding: "0.5rem",
                  }}
                >
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function App() {
  const profitData = [
    { Name: "Gagan R.", "Total Profit": 20, "Sessions Played": 1 },
    { Name: "Sean S.", "Total Profit": 30, "Sessions Played": 1 },
    { Name: "Troy H.", "Total Profit": 80, "Sessions Played": 1 },
    { Name: "Ethan T.", "Total Profit": -40, "Sessions Played": 1 },
    { Name: "Avery T.", "Total Profit": -50, "Sessions Played": 1 },
    { Name: "Ethan L.", "Total Profit": -40, "Sessions Played": 1 },
  ];


  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "white",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <h1>Bay Area Poker</h1>


      {/* Table */}
      <TableCard title="Player Profits" data={profitData} />

      <ChartCard
        title="Profit/Loss by Session"
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRXIW4YrYvuI9hwOXACI-HPAn_EX0mRKJO3WNHc9y1rCQbzx3PMgObX5lJToojWZ9fdrPKkZxfK-1hb/pubchart?oid=927464540&format=interactive"
      />

      <ChartCard2
        title="Session Breakdown"
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRXIW4YrYvuI9hwOXACI-HPAn_EX0mRKJO3WNHc9y1rCQbzx3PMgObX5lJToojWZ9fdrPKkZxfK-1hb/pubchart?oid=733910113&format=interactive"
      />


    </div>
  );
}
