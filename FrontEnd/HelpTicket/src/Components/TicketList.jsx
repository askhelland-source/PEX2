import { useState } from "react";
import TicketDetail from "./TicketDetails";
import { useTickets } from '../API/useTicket';
import { sortTickets, filterByStatus, SortOptions, getSortLabel } from '../Utils/ticketSortFilter';
import { getPaginatedItems, getPageNumbers } from '../Utils/pagination';

function TicketList() {
  const { tickets, loading, error } = useTickets(); 
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [sortBy, setSortBy] = useState(SortOptions.NEWEST);
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // viser status koder
  if (loading) return <div>Laster saker...</div>;
  if (error) return <div>Feil ved henting av saker: {error.message}</div>;

  // Apply filters and sorting
  let filteredTickets = filterByStatus(tickets, filterStatus);
  let displayedTickets = sortTickets(filteredTickets, sortBy);

  // Apply pagination
  const { items: paginatedTickets, totalPages, totalItems, startIndex, endIndex } = getPaginatedItems(
    displayedTickets,
    currentPage,
    ITEMS_PER_PAGE
  );

  const pageNumbers = getPageNumbers(currentPage, totalPages, 5);

  // Når man klikker "See more details"
  const handleSeeDetails = (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) setSelectedTicket(ticket);
  };

  // Når en ticket oppdateres
  const handleUpdated = (updatedTicket) => {
    setSelectedTicket(updatedTicket); // oppdater også valgt ticket
  };

  // Når en ticket slettes
  const handleDeleted = (deletedId) => {
    setSelectedTicket(null);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <h2>Alle Saker</h2>

      {/* Sorting and Filtering Controls */}
      <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Sort Dropdown */}
          <div>
            <label style={{ marginRight: 8, fontWeight: 'bold' }}>Sortering:</label>
            <select value={sortBy} onChange={handleSortChange} style={{ padding: '8px', borderRadius: 4 }}>
              <option value={SortOptions.NEWEST}>Nyeste først</option>
              <option value={SortOptions.OLDEST}>Eldeste først</option>
              <option value={SortOptions.ALPHABETICAL_AZ}>A - Å</option>
              <option value={SortOptions.ALPHABETICAL_ZA}>Å - A</option>
            </select>
          </div>

          {/* Filter Dropdown */}
          <div>
            <label style={{ marginRight: 8, fontWeight: 'bold' }}>Status:</label>
            <select value={filterStatus} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: 4 }}>
              <option value="All">Alle</option>
              <option value="Open">Åpne</option>
              <option value="In Progress">Under arbeid</option>
              <option value="Closed">Lukket</option>
            </select>
          </div>

          {/* Results count */}
          <div style={{ marginLeft: 'auto', fontSize: 14, color: '#666' }}>
            Viser {startIndex + 1} - {endIndex} av {totalItems}
          </div>
        </div>
      </div>

      {/* Tickets List */}
      {paginatedTickets.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {paginatedTickets.map(ticket => (
            <li key={ticket.id} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
              <div>
                <strong>ID: {ticket.id}</strong> — {ticket.title || 'Ingen tittel funnet'}
                <br />
                <small>Status: {ticket.status}</small>
                <br />
                <p>Beskrivelse: {ticket.description || 'Ingen beskrivelse'}</p> 
              </div>

              <button onClick={() => handleSeeDetails(ticket.id)}>
                Se detaljer
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: 'center', color: '#999' }}>Ingen saker funnet.</p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: 30, textAlign: 'center', padding: 16, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ padding: '8px 12px', marginRight: 8, cursor: currentPage === 1 ? 'default' : 'pointer' }}
            >
              ← Forrige
            </button>

            {pageNumbers.map((page, idx) => (
              <button
                key={idx}
                onClick={() => page !== null && handlePageChange(page)}
                disabled={page === null}
                style={{
                  padding: '8px 12px',
                  marginRight: 4,
                  backgroundColor: page === currentPage ? '#007bff' : page === null ? 'transparent' : '#fff',
                  color: page === currentPage ? '#fff' : '#000',
                  border: page === currentPage ? 'none' : '1px solid #ddd',
                  borderRadius: 4,
                  cursor: page === null ? 'default' : 'pointer',
                  fontWeight: page === currentPage ? 'bold' : 'normal',
                }}
              >
                {page === null ? '...' : page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ padding: '8px 12px', marginLeft: 8, cursor: currentPage === totalPages ? 'default' : 'pointer' }}
            >
              Neste →
            </button>
          </div>
          <small style={{ color: '#666' }}>Side {currentPage} av {totalPages}</small>
        </div>
      )}

      {/* Vis detaljkomponent dersom en ticket er valgt */}
      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}

export default TicketList;
