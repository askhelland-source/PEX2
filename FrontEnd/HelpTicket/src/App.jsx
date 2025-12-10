import TicketList from './Components/TicketList'
import NySak from './Components/NySak'  
import { useState } from "react";

import './App.css'

function App() {
  
  //Ny sak
  const [tickets, setTickets] = useState([]);

  const handleCreated = (newTicket) => {
    setTickets(prev => [...prev, newTicket]); // legg til ny sak

  // Ny sak
  
  };

  return (
    <>

    <TicketList />

      <NySak onCreated={handleCreated} />

    </>
  )
}

export default App
