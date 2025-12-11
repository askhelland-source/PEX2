import { useState } from "react";
import { useTickets } from '../API/useTicket';
import { useErrorHandler } from '../Hooks/useErrorHandler';

function SlettSak() {
  const { tickets, loading, deleteTicket } = useTickets();
  const { handleError, addError } = useErrorHandler();
  const [selectedId, setSelectedId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedId) {
      handleError("Du må velge en sak!", "validering");
      return;
    }
    
    const isConfirmed = window.confirm("Er du sikker på at du vil slette denne saken?");
    if (!isConfirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTicket(selectedId);
      setSelectedId(""); // Tøm dropdown
      addError("Saken ble slettet!", "success");
    } catch (error) {
      handleError(error, "slette sak");
    } finally {
      setIsDeleting(false);
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
            disabled={isDeleting}
          >
            {tickets.map(ticket => (
              <option key={ticket.id} value={ticket.id}>
                ID {ticket.id}: {ticket.title}
              </option>
            ))}
          </select>
          <br /><br />

          <button 
            style={{ background: "red", color: "white" }} 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Sletter..." : "Slett sak"}
          </button>
        </>
      )}
    </div>
  );
}

export default SlettSak;
