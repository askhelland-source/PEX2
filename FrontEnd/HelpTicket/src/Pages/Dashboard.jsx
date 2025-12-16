import { Link } from "react-router-dom";
import "../Styling/Dashboard.css";
import SokSak from "../Components/SøkSak";

function Dashboard() {
  return (
    
    <div className="dashboard">
      <h1>Dashboard</h1> <SokSak />
      <p className="dashboard-text">
        Welcome to your helpdesk overview
      </p>

    <nav className="DashBoardNav">
      <Link to="/MakeTicket" className="dashboard-link">Create Ticket</Link> 
      <Link to="/SeeTickets" className="dashboard-link">See all the tickets </Link> 
      <Link to="/YourTickets" className="dashboard-link">Start helping </Link> 
    </nav>

    </div>
  );
}

export default Dashboard;
