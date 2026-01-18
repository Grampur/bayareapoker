import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const ChartCard = ({ title, src, height }) => (
  <div className="card">
    <h2 className="card-title">{title}</h2>
    <div className="chart-container">
      <iframe
        src={src}
        title={title}
        className="chart-iframe"
        style={{ '--chart-height': height + 'px' }}
        loading="lazy"
      />
    </div>
    <div className="chart-hint">
      Swipe left/right to view chart →
    </div>
  </div>
);

const SortableTableCard = ({ title, data, loading, error }) => {
  const [sortField, setSortField] = useState("Total Profit");
  const [sortDirection, setSortDirection] = useState("desc"); // Start with biggest profit (desc)

  if (loading) {
    return (
      <div className="card card-centered">
        <h2 className="card-title">{title}</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card card-centered">
        <h2 className="card-title">{title}</h2>
        <p className="card-error">Error: {error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card card-centered">
        <h2 className="card-title">{title}</h2>
        <p>No data available</p>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  const handleSort = (field) => {
    if (sortField === field) {
      // If clicking the same field, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new field, set default direction based on field type
      setSortField(field);
      if (field === "Name") {
        setSortDirection("asc"); // Names default to A-Z
      } else {
        setSortDirection("desc"); // Numbers default to high-to-low
      }
    }
  };

  const getSortedData = () => {
    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle string sorting (names)
      if (typeof aVal === "string" && typeof bVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
        if (sortDirection === "asc") {
          return aVal.localeCompare(bVal);
        } else {
          return bVal.localeCompare(aVal);
        }
      }

      // Handle number sorting (profit, sessions)
      if (typeof aVal === "number" && typeof bVal === "number") {
        if (sortDirection === "asc") {
          return aVal - bVal;
        } else {
          return bVal - aVal;
        }
      }

      return 0;
    });
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "⇅";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getFieldDisplayName = (field) => {
    const displayNames = {
      "Name": "Name",
      "Total Profit": "Profit/Loss",
      "Sessions Played": "Sessions"
    };
    return displayNames[field] || field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const sortedData = getSortedData();

  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      
      {/* Sort Controls */}
      <div className="sort-controls">
        <span className="sort-label">Sort by:</span>
        {columns.map((field) => (
          <button
            key={field}
            onClick={() => handleSort(field)}
            className={`sort-button ${sortField === field ? "sort-button-active" : ""}`}
          >
            {getFieldDisplayName(field)} {getSortIcon(field)}
          </button>
        ))}
      </div>

      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th 
                key={col} 
                className={`table-header table-header-sortable ${sortField === col ? "table-header-active" : ""}`}
                onClick={() => handleSort(col)}
              >
                {getFieldDisplayName(col)} {getSortIcon(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col} className="table-cell">
                  {typeof row[col] === 'number' && col.includes('Profit')
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

const TableCard = ({ title, data, loading, error }) => {
  if (loading) {
    return (
      <div className="card card-centered">
        <h2 className="card-title">{title}</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card card-centered">
        <h2 className="card-title">{title}</h2>
        <p className="card-error">Error: {error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card card-centered">
        <h2 className="card-title">{title}</h2>
        <p>No data available</p>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="table-header">
                {col.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col} className="table-cell">
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
      <div className="card card-centered">
        <h2 className="card-title">Session Notes</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card card-centered">
        <h2 className="card-title">Session Notes</h2>
        <p className="card-error">Error: {error}</p>
      </div>
    );
  }

  if (!sessionNotes || sessionNotes.length === 0) {
    return (
      <div className="card card-centered">
        <h2 className="card-title">Session Notes</h2>
        <p>No session notes available</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">Session Notes</h2>
      <div className="session-notes-container">
        {sessionNotes.map((session, index) => {
          if (!session.notable_hands || session.notable_hands.length === 0) {
            return null;
          }

          return (
            <div key={session.session_id} className="session-note">
              <h3 className="session-note-title">
                Session {session.session_id} - {new Date(session.session_date).toLocaleDateString()}
              </h3>
              <div className="session-note-hands">
                {session.notable_hands.map((hand, handIndex) => (
                  <div key={hand.id} className="notable-hand">
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
    <div className="app-container">
      <h1 className="app-title">Bay Area Poker</h1>

      {/* Changed from TableCard to SortableTableCard */}
      <SortableTableCard
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