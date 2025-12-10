// Liste over alle tickets. Viser oversikt over alle saker

import { useEffect, useState } from "react";

function TicketList() {
  const [tickets, setTickets] = useState([]);

useEffect(() => {
  fetch("http://localhost:3002/api/v1/tickets")
    .then(res => res.json())
    .then(json => setTickets(json.data)) 
    .catch(err => console.error("Error fetching tickets:", err));
}, []);

  const handleSeeDetails = (id) => {
    alert("See details for ticket ID: " + id);
  };

return (
    <>
      <h2>Alle Saker</h2>

      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id}>
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
    </>
  );
}

export default TicketList;