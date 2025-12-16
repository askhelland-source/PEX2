import { Link } from "react-router-dom";
import "../Styling/NavBar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/Dashboard" className="nav-link">Dashboard</Link>
    </nav>
  );
}

export default Navbar;