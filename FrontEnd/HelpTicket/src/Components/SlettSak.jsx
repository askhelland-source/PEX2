import { useState } from "react";

function SlettSak({ onDeleted }) {

  const [id, setId] = useState("");

  const handleDelete = async () => {
    if (!id) return alert("Du må skrive inn et ID!");

    const res = await fetch(`http://localhost:3002/api/v1/tickets/${id}`, {
      method: "DELETE"
    });

    const json = await res.json();

    if (json.success) {
      onDeleted(id);  // Oppdater liste i parent
      setId("");      // Tøm input
    } else {
      alert("Fant ikke sak med ID " + id);
    }
  };

  return (
    <div style={{ border: "1px solid #f00", padding: "16px", marginTop: "16px" }}>
      <h3>Slett sak</h3>

      <input
        type="number"
        placeholder="Skriv inn ID..."
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <br /><br />

      <button style={{ background: "red", color: "white" }} onClick={handleDelete}>
        Slett sak
      </button>
    </div>
  );
}

export default SlettSak;
