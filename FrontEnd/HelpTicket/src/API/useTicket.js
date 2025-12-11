// useTickets.js - Custom Hook for Ticket Data Management
import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiSend } from './Fetch'; // Import the API utility

export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. GET (Read) Logic ---
  const fetchAllTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await apiGet();
      setTickets(json.data || []);
      return json.data || []; // Return data for immediate use if needed
    } catch (err) {
      setError(err);
      console.error("Error fetching tickets:", err);
      setTickets([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTickets();
  }, [fetchAllTickets]); // Initial fetch when component mounts

  // --- 2. DELETE Logic (used by SlettSak component) ---
  const deleteTicket = async (id) => {
    try {
      await apiSend('DELETE', `/${id}`);
      
      // Update local state immediately (Optimistic UI update)
      setTickets(prev => prev.filter(t => String(t.id) !== String(id)));
      return true;
    } catch (err) {
      setError(err);
      console.error("Error deleting ticket:", err);
      throw err; // Allow component to handle specific deletion error
    }
  };

  // --- 3. EDIT (Update) Logic (used by Edit components) ---
  const updateTicket = async (id, updatedData) => {
    try {
      const json = await apiSend('PUT', `/${id}`, updatedData);
      const updatedTicket = json.data;

      // Update local state with the returned fresh data
      setTickets(prev => prev.map(t => 
        String(t.id) === String(id) ? updatedTicket : t
      ));
      return updatedTicket;
    } catch (err) {
      setError(err);
      console.error("Error updating ticket:", err);
      throw err;
    }
  };

  // --- 4. SEARCH Logic (can be a wrapper around apiGet) ---
  const searchTickets = async (queryTerm) => {
    setLoading(true);
    setError(null);
    try {
      // Using the correct search endpoint: /search?q=query
      const json = await apiGet(`/search?q=${encodeURIComponent(queryTerm)}`);
      setTickets(json.data || []);
      return json.data || [];
    } catch (err) {
      setError(err);
      console.error("Error searching tickets:", err);
      setTickets([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  // --- 5. CREATE Logic (New: used by NySak component) ---
const createTicket = async (newTicketData) => {
  try {
    // Bruker apiSend ('POST', '', data) for å sende til base URL
    const json = await apiSend('POST', '', newTicketData);
    const newTicket = json.data;

    // Oppdater den lokale 'tickets' staten med den nye saken
    setTickets(prev => [newTicket, ...prev]); 
    
    return newTicket; // Returner den opprettede saken med ID etc.
  } catch (err) {
    setError(err);
    console.error("Error creating ticket:", err);
    throw err; 
  }
};


  return {
    tickets,
    loading,
    error,
    setTickets, 
    fetchAllTickets, 
    deleteTicket,
    updateTicket,
    searchTickets,
    createTicket
  };
}