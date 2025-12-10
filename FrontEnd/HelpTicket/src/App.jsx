import TicketList from './Components/TicketList'
import NySak from './Components/NySak'  
import { useState } from "react";
import SlettSak from './Components/SlettSak'
import SøkSak from './Components/SøkSak'

import './App.css'

function App() {

  // Ny sak
  const handleCreated = (newTicket) => {
    setTickets(prev => [...prev, newTicket]);
  };
  // Ny sak

    // Slett sak
  const handleDeleted = (deletedId) => {
    setTickets(prev => prev.filter(t => t.id !== parseInt(deletedId)));
  };
  
  // slett sak






  return (
    <>
    <SøkSak />

    <TicketList />

    <NySak onCreated={handleCreated} />

      <SlettSak onDeleted={handleDeleted} />

    </>
  );
}

export default App
