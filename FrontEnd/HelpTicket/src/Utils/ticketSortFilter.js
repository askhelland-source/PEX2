/**
 * Ticket sorting and filtering utilities
 */

export const SortOptions = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  ALPHABETICAL_AZ: 'alphabetical_az',
  ALPHABETICAL_ZA: 'alphabetical_za',
  STATUS_OPEN: 'status_open',
  STATUS_IN_PROGRESS: 'status_in_progress',
  STATUS_CLOSED: 'status_closed',
};

/**
 * Sort tickets based on selected option
 * @param {Array} tickets - Array of ticket objects
 * @param {string} sortBy - Sort option from SortOptions
 * @returns {Array} Sorted array
 */
export const sortTickets = (tickets, sortBy) => {
  const sorted = [...tickets];

  switch (sortBy) {
    case SortOptions.NEWEST:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    case SortOptions.OLDEST:
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    case SortOptions.ALPHABETICAL_AZ:
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'no'));

    case SortOptions.ALPHABETICAL_ZA:
      return sorted.sort((a, b) => b.title.localeCompare(a.title, 'no'));

    case SortOptions.STATUS_OPEN:
      return sorted.filter(t => t.status === 'Open');

    case SortOptions.STATUS_IN_PROGRESS:
      return sorted.filter(t => t.status === 'In Progress');

    case SortOptions.STATUS_CLOSED:
      return sorted.filter(t => t.status === 'Closed');

    default:
      return sorted;
  }
};

/**
 * Filter tickets by status
 * @param {Array} tickets - Array of ticket objects
 * @param {string} status - Status to filter by ('Open', 'In Progress', 'Closed', or null for all)
 * @returns {Array} Filtered array
 */
export const filterByStatus = (tickets, status) => {
  if (!status || status === 'All') return tickets;
  return tickets.filter(t => t.status === status);
};

/**
 * Get sort label for display
 * @param {string} sortBy - Sort option
 * @returns {string} Display label
 */
export const getSortLabel = (sortBy) => {
  const labels = {
    [SortOptions.NEWEST]: 'Nyeste først',
    [SortOptions.OLDEST]: 'Eldeste først',
    [SortOptions.ALPHABETICAL_AZ]: 'A - Å',
    [SortOptions.ALPHABETICAL_ZA]: 'Å - A',
    [SortOptions.STATUS_OPEN]: 'Åpne saker',
    [SortOptions.STATUS_IN_PROGRESS]: 'Under arbeid',
    [SortOptions.STATUS_CLOSED]: 'Lukket',
  };
  return labels[sortBy] || 'Standard';
};
