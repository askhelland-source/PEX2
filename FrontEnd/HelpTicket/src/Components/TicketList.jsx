import { useState } from "react";
import TicketDetail from "./TicketDetails";
import { useTickets } from '../API/useTicket';

function TicketList() {
  const { tickets, loading, error } = useTickets(); 
  const [selectedTicket, setSelectedTicket] = useState(null);

  // viser status koder
  if (loading) return <div>Laster saker...</div>;
  if (error) return <div>Feil ved henting av saker: {error.message}</div>;

  // Når man klikker "See more details"
  const handleSeeDetails = (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) setSelectedTicket(ticket);
  };

  // Når en ticket oppdateres
  const handleUpdated = (updatedTicket) => {
    setSelectedTicket(updatedTicket); // oppdater også valgt ticket
  };

  // Når en ticket slettes
  const handleDeleted = (deletedId) => {
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
