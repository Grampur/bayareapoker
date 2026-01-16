import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const ChartCard = ({ title, src, height }) => (
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
    <div
      style={{
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <iframe
        src={src}
        title={title}
        style={{
          width: "900px",
          height: height,
          border: "none",
          background: "white",
          borderRadius: "8px",
          display: "block",
        }}
        loading="lazy"
      />
    </div>
    <div
      style={{
        fontSize: "0.8rem",
        opacity: 0.6,
        marginTop: "0.5rem",
      }}
    >
      Swipe left/right to view chart →
    </div>
  </div>
);

const TableCard = ({ title, data, loading, error }) => {
  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "1rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>{title}</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "1rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>{title}</h2>
        <p style={{ color: "#ff6b6b" }}>Error: {error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "1rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>{title}</h2>
        <p>No data available</p>
      </div>
    );
  }

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
                {col.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                  {typeof row[col] === 'number' && col.includes('profit')
                    ? `$${row[col]}`
                    : row[col]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SessionNotesCard = ({ sessionNotes, loading, error }) => {
  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "1rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>Session Notes</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "1rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>Session Notes</h2>
        <p style={{ color: "#ff6b6b" }}>Error: {error}</p>
      </div>
    );
  }

  if (!sessionNotes || sessionNotes.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "1rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>Session Notes</h2>
        <p>No session notes available</p>
      </div>
    );
  }

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
      <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>Session Notes</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {sessionNotes.map((session, index) => {
          if (!session.notable_hands || session.notable_hands.length === 0) {
            return null; // Skip sessions without notable hands
          }

          return (
            <div
              key={session.session_id}
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                padding: "1rem",
                border: "1px solid #444",
              }}
            >
              <h3
                style={{
                  marginBottom: "0.5rem",
                  fontSize: "1rem",
                  color: "#4ade80",
                }}
              >
                Session {session.session_id} - {new Date(session.session_date).toLocaleDateString()}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {session.notable_hands.map((hand, handIndex) => (
                  <div
                    key={hand.id}
                    style={{
                      backgroundColor: "#333",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {hand.note_text}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  const [profitData, setProfitData] = useState([]);
  const [sessionNotes, setSessionNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notesError, setNotesError] = useState(null);

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        setLoading(true);
        console.log('API_URL:', API_URL);
        console.log('Fetching from:', `${API_URL}/api/cached/profit-summary`);

        const response = await axios.get(`${API_URL}/api/cached/profit-summary`);

        const formattedData = response.data.data.map(player => ({
          Name: player.name,
          "Total Profit": player.total_profit,
          "Sessions Played": player.sessions_played
        }));

        setProfitData(formattedData);
        setError(null);

        // Show last updated time
        console.log('Data last updated:', response.data.lastUpdated);
      } catch (err) {
        console.error('Full error object:', err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch player data');
      } finally {
        setLoading(false);
      }
    };

    const fetchSessionNotes = async () => {
      try {
        setNotesLoading(true);
        console.log('Fetching session notes from:', `${API_URL}/api/cached/session-notes`);

        const response = await axios.get(`${API_URL}/api/cached/session-notes`);
        setSessionNotes(response.data.data);
        setNotesError(null);

        // Show last updated time
        console.log('Session notes last updated:', response.data.lastUpdated);
      } catch (err) {
        console.error('Session notes error:', err);
        setNotesError(err.response?.data?.error || err.message || 'Failed to fetch session notes');
      } finally {
        setNotesLoading(false);
      }
    };

    fetchProfitData();
    fetchSessionNotes();
  }, []);

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

      <TableCard
        title="Player Profits"
        data={profitData}
        loading={loading}
        error={error}
      />

      <ChartCard
        title="Profit/Loss by Session"
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRXIW4YrYvuI9hwOXACI-HPAn_EX0mRKJO3WNHc9y1rCQbzx3PMgObX5lJToojWZ9fdrPKkZxfK-1hb/pubchart?oid=927464540&format=interactive"
        height={750}
      />

      <ChartCard
        title="Session Breakdown"
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRXIW4YrYvuI9hwOXACI-HPAn_EX0mRKJO3WNHc9y1rCQbzx3PMgObX5lJToojWZ9fdrPKkZxfK-1hb/pubchart?oid=733910113&format=interactive"
        height={600}
      />

      <SessionNotesCard
        sessionNotes={sessionNotes}
        loading={notesLoading}
        error={notesError}
      />
    </div>
  );
}