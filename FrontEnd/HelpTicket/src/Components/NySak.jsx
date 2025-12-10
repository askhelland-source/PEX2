import { useState } from "react";

function NySak({ onCreated }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("In Progress"); // standard verdi

  const handleCreate = async () => {
    const newTicket = {
      title,
      description,
      status
    };

    const res = await fetch("http://localhost:3002/api/v1/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTicket)
    });

    const json = await res.json();
    
    if (json.success) {
      onCreated(json.data); // oppdater liste
      setTitle("");
      setDescription("");
      setStatus("In Progress");
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
