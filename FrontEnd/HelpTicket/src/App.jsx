import { ErrorProvider } from './Contexts/ErrorContext';
import { ErrorDisplay } from './Components/ErrorDisplay';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Components/NavBar';

// Pages
import Dashboard from './Pages/Dashboard';
import CreateTicekt from './Pages/CreateTicket';
import ViewTicket from './Pages/ViewTicket';
import YourTicket from './Pages/YourTickets';




import './App.css'

function App() {
  return (
    <Router>
    <ErrorProvider>
      <ErrorDisplay />
      <Navbar />
        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/MakeTicket" element={<CreateTicekt />} />
          <Route path="/SeeTickets" element={<ViewTicket />} />
          <Route path="/YourTickets" element={<YourTicket />} />
        </Routes>
    </ErrorProvider>
    </Router>
  );
}

export default App
