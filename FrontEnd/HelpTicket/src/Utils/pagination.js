/**
 * Pagination utilities
 */

/**
 * Get paginated items
 * @param {Array} items - All items
 * @param {number} currentPage - Current page (1-indexed)
 * @param {number} itemsPerPage - Items to show per page
 * @returns {Object} { items: Array, totalPages: number, totalItems: number }
 */
export const getPaginatedItems = (items, currentPage, itemsPerPage = 15) => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Clamp current page to valid range
  const page = Math.max(1, Math.min(currentPage, totalPages || 1));

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    currentPage: page,
    totalPages,
    totalItems,
    startIndex,
    endIndex: Math.min(endIndex, totalItems),
  };
};

/**
 * Get array of page numbers for pagination controls
 * @param {number} currentPage
 * @param {number} totalPages
 * @param {number} maxPageButtons - Max page buttons to show
 * @returns {Array} Array of page numbers (or null for ellipsis)
 */
export const getPageNumbers = (currentPage, totalPages, maxPageButtons = 5) => {
  if (totalPages <= maxPageButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const halfWindow = Math.floor(maxPageButtons / 2);

  let start = Math.max(1, currentPage - halfWindow);
  let end = Math.min(totalPages, currentPage + halfWindow);

  if (end - start + 1 < maxPageButtons) {
    if (start === 1) {
      end = Math.min(totalPages, start + maxPageButtons - 1);
    } else {
      start = Math.max(1, end - maxPageButtons + 1);
    }
  }

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push(null); // null represents ellipsis
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push(null); // null represents ellipsis
    pages.push(totalPages);
  }

  return pages;
};
