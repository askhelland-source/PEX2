import { useState, useEffect, useRef } from "react";
import TicketDetail from "./TicketDetails";
import { useTickets } from '../API/useTicket';

function SokSak() {
  const { searchTickets } = useTickets();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const debounceRef = useRef(null);

  // funksjon som gjør search via hook
  const doSearch = async (q) => {
    // hvis tomt eller for kort, nullstill resultater
    if (!q || q.trim().length < 1) {
      setSearchResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await searchTickets(q);
      setSearchResults(results || []);
    } catch (err) {
      console.error("Search error:", err);
      setError(err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce: kaller doSearch 300ms etter siste tastetrykk
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      doSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Enter-key handler
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // fjern debounced kall og kjør umiddelbart
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      doSearch(query);
    }
  };

  const handleButtonClick = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    doSearch(query);
  };

  // Oppdater søkeresultater etter redigering
  const handleUpdated = (updatedTicket) => {
    setSearchResults(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket); // oppdater også valgt ticket
  };

  // Fjern ticket fra søkeresultater hvis slettet
  const handleDeleted = (deletedId) => {
    setSearchResults(prev => prev.filter(t => t.id !== deletedId));
    setSelectedTicket(null);
  };

  const handleSeeDetails = (ticketId) => {
    const ticket = searchResults.find(t => t.id === ticketId);
    if (ticket) setSelectedTicket(ticket);
  };

  return (
    <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 6 }}>
      <h3>Søk etter sak</h3>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Skriv f.eks: printer, løst pc 2021, open..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: "1 1 300px", padding: 8 }}
        />
        <button onClick={handleButtonClick}>Søk</button>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading && <p>Laster resultater...</p>}

        {!loading && error && (
          <p style={{ color: "crimson" }}>Feil ved søk: {error.message}</p>
        )}

        {!loading && !error && searchResults.length === 0 && query.trim().length >= 2 && (
          <p>Ingen treff for "{query}"</p>
        )}

        {!loading && searchResults.length > 0 && (
          <ul style={{ marginTop: 8 }}>
            {searchResults.map((r) => (
              <li key={r.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                <div style={{ fontWeight: 600 }}>{r.title} <span style={{ color: "#666" }}>#{r.id}</span></div>
                <div style={{ fontSize: 13, color: "#333" }}>{r.description}</div>
                <div style={{ fontSize: 12, color: "#555" }}>
                  Status: {r.status} — Start: {r.createdAt ? new Date(r.createdAt).toLocaleString() : "ukjent"} 
                  {r.completedAt && <> — Ferdig: {new Date(r.completedAt).toLocaleString()}</>}
                </div>
                
                <button onClick={() => handleSeeDetails(r.id)} style={{ marginTop: 4 }}>
                  See more details
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {/* Vis TicketDetail hvis valgt */}
        {selectedTicket && (
          <TicketDetail
            ticket={selectedTicket}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        )}
      </div>
    </div>
  );
}

export default SokSak;
