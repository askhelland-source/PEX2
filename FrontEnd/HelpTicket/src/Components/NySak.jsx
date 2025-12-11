import { useState } from "react";
import { useTickets } from '../API/useTicket';

function NySak() {
  const { createTicket } = useTickets();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    //Sjekk om tittel og beskrivelse er fylt ut
    if (!title || !description) {
        return alert("Tittel og beskrivelse må fylles ut.");
    }

    const newTicketData = {
      title,
      description,
      status
    };

    setIsCreating(true);

    try {
      await createTicket(newTicketData); 
      
      // Tøm feltene
      setTitle("");
      setDescription("");
      setStatus("In Progress");

    } catch (error) {
      // Feil håndtert i hooken, men vis en melding til brukeren her
      console.error("Noe gikk galt ):", error);
      alert(`Klarte ikke å opprette sak. Feil: ${error.message}`);
    } finally {
      setIsCreating(false); // Stopp lasting
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", marginTop: "16px" }}>
      <h3>Opprett ny sak</h3>

      <input 
        type="text" 
        placeholder="Tittel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /><br/><br/>

      <textarea
        placeholder="Beskrivelse"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      /><br/><br/>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </select>
      <br/><br/>

      <button onClick={handleCreate}>Lag ny sak</button>
    </div>
  );
}

export default NySak;
