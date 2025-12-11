import { useState } from "react";
import { useTickets } from '../API/useTicket';

function TicketDetail({ ticket, onUpdated, onDeleted }) {
  const { updateTicket, deleteTicket } = useTickets();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [status, setStatus] = useState(ticket.status);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedData = { title, description, status };
      const updatedTicket = await updateTicket(ticket.id, updatedData);
      onUpdated(updatedTicket);
      setIsEditing(false);
    } catch (err) {
      alert("Feil ved oppdatering: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Er du sikker på at du vil slette denne saken?")) return;
    setLoading(true);
    try {
      await deleteTicket(ticket.id);
      onDeleted(ticket.id);
    } catch (err) {
      alert("Feil ved sletting: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, marginTop: 16 }}>
      {isEditing ? (
        <>
          <h3>Rediger sak #{ticket.id}</h3>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <br />
          <button onClick={handleUpdate} disabled={loading}>Lagre</button>
          <button onClick={() => setIsEditing(false)} disabled={loading}>Avbryt</button>
        </>
      ) : (
        <>
          <h3>{ticket.title} <span style={{ color: "#666" }}>#{ticket.id}</span></h3>
          <p>{ticket.description}</p>
          <p>Status: {ticket.status}</p>
          <p>Start: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "ukjent"}</p>
          {ticket.completedAt && <p>Ferdig: {new Date(ticket.completedAt).toLocaleString()}</p>}

          <button onClick={() => setIsEditing(true)}>Rediger</button>
          <button onClick={handleDelete} style={{ marginLeft: 8, background: "red", color: "white" }}>Slett</button>
          <button style={{ marginLeft: 8 }}>Send videre</button>
        </>
      )}
    </div>
  );
}

export default TicketDetail;
