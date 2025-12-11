import TicketList from './Components/TicketList'
import NySak from './Components/NySak'  
import SlettSak from './Components/SlettSak'
import SøkSak from './Components/SøkSak'

import './App.css'

function App() {
  return (
    <>
      <SøkSak />

      <TicketList />

      <NySak />

      <SlettSak />
    </>
  );
}

export default App
