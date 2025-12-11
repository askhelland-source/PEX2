import { useState, useEffect } from "react";

function SlettSak({ onDeleted }) {

  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  // Hent tickets fra backend
  useEffect(() => {
    fetch("http://localhost:3002/api/v1/tickets")
      .then(res => res.json())
      .then(json => {
        setTickets(json.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tickets:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async () => {
    if (!selectedId) return alert("Du må velge en sak!");
    const isConfirmed = window.confirm("Er du sikker på at du vil slette denne saken?");
if (!isConfirmed) {
return;
    }
    const res = await fetch(`http://localhost:3002/api/v1/tickets/${selectedId}`, {
      method: "DELETE"
    });

    const json = await res.json();

    if (json.success) {
      onDeleted(selectedId);  // Oppdater liste i parent
      setSelectedId("");      // Tøm input
      // Fjern saken fra dropdown lista
      setTickets(prev => prev.filter(t => t.id !== parseInt(selectedId)));
    } else {
      alert("Fant ikke sak med ID " + selectedId);
    }
  };

  return (
    <div style={{ border: "1px solid #f00", padding: "16px", marginTop: "16px" }}>
      <h3>Slett sak</h3>

      {loading ? (
        <p>Laster saker...</p>
      ) : (
        <>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{ padding: "8px", width: "100%", maxWidth: "400px" }}
          >
            {tickets.map(ticket => (
              <option key={ticket.id} value={ticket.id}>
                ID {ticket.id}: {ticket.title}
              </option>
            ))}
          </select>
          <br /><br />

          <button style={{ background: "red", color: "white" }} onClick={handleDelete}>
            Slett sak
          </button>
        </>
      )}
    </div>
  );
}

export default SlettSak;
