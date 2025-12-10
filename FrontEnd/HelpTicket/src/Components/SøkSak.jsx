import { useState, useEffect, useRef } from "react";

function SokSak() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  // funksjon som gjør fetch mot backend
  const doSearch = async (q) => {
    // hvis tomt eller for kort, nullstill og don't show loading
    if (!q || q.trim().length < 2) {
      // avbryt pågående fetch hvis noen
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    // avbryt tidligere request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const encoded = encodeURIComponent(q);
      const res = await fetch(`http://localhost:3002/api/v1/tickets/search?q=${encoded}`, {
        signal: controller.signal
      });

      // om server svarer med ikke-JSON eller error, catch tar det
      const json = await res.json();

      // forsikre oss om at backend-return har success flag
      if (json && json.success) {
        setResults(Array.isArray(json.data) ? json.data : []);
      } else if (json && !json.success) {
        setResults([]);
        setError(json.message || "Ingen treff");
      } else {
        setResults([]);
      }

    } catch (err) {
      if (err.name === "AbortError") {
        // request ble avbrutt — ikke vis feilmelding
        // keep as is
      } else {
        setError("Feil ved søk: " + (err.message || "ukjent feil"));
        setResults([]);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <p style={{ color: "crimson" }}>{error}</p>
        )}

        {!loading && !error && results.length === 0 && query.trim().length >= 2 && (
          <p>Ingen treff for "{query}"</p>
        )}

        {!loading && results.length > 0 && (
          <ul style={{ marginTop: 8 }}>
            {results.map((r) => (
              <li key={r.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                <div style={{ fontWeight: 600 }}>{r.title} <span style={{ color: "#666" }}>#{r.id}</span></div>
                <div style={{ fontSize: 13, color: "#333" }}>{r.description}</div>
                <div style={{ fontSize: 12, color: "#555" }}>
                  Status: {r.status} — Dato: {r.date || "ukjent"} — Score: {r.score ?? "-"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SokSak;
