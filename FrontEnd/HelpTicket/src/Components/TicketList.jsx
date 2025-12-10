import { useEffect, useState } from "react";
import TicketDetail from "./TicketDetails";

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); // må ha state for valgt ticket

  // Hent tickets fra backend
  useEffect(() => {
    fetch("http://localhost:3002/api/v1/tickets")
      .then(res => res.json())
      .then(json => setTickets(json.data)) 
      .catch(err => console.error("Error fetching tickets:", err));
  }, []);

  // Når man klikker "See more details"
  const handleSeeDetails = (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) setSelectedTicket(ticket);
  };

  // Når en ticket oppdateres
  const handleUpdated = (updatedTicket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket); // oppdater også valgt ticket
  };

  // Når en ticket slettes
  const handleDeleted = (deletedId) => {
    setTickets(prev => prev.filter(t => t.id !== deletedId));
    setSelectedTicket(null); // fjern valgt ticket hvis den ble slettet
  };

  return (
    <>
      <h2>Alle Saker</h2>

      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
            <div>
              <strong>ID: {ticket.id}</strong> — {ticket.title || 'Ingen tittel funnet'}
              <br />
              <small>Status: {ticket.status}</small>
              <br />
              <p>Beskrivelse: {ticket.description || 'Ingen beskrivelse'}</p> 
            </div>

            <button onClick={() => handleSeeDetails(ticket.id)}>
              See more details
            </button>
          </li>
        ))}
      </ul>

      {/* Vis detaljkomponent dersom en ticket er valgt */}
      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}

export default TicketList;
