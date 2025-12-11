import { ErrorProvider } from './Contexts/ErrorContext';
import { ErrorDisplay } from './Components/ErrorDisplay';
import TicketList from './Components/TicketList'
import NySak from './Components/NySak'  
import SlettSak from './Components/SlettSak'
import SøkSak from './Components/SøkSak'

import './App.css'

function App() {
  return (
    <ErrorProvider>
      <ErrorDisplay />
      <SøkSak />

      <TicketList />

      <NySak />

      <SlettSak />
    </ErrorProvider>
  );
}

export default App
