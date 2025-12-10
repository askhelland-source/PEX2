const express = require('express');

const { 
    createTicket,
    getAllTickets,
    getSingleTicket,
    updateTicket,
    deleteTicket,
    searchTickets
} = require('../controllers/ticketController');

const router = express.Router();

// Imporeter validerings middleware
const {
    validateIdParam,
    validateTicketBody,
    checkTicketExists,
    validateUpdateBody
} = require('../middleware/ticketValidation');


// Viktig å ha array med validering FØR vi går videre. 

router.get("/search", searchTickets);


// GET| www.localost:3002/api/v2/movies
router.get('/',getAllTickets );

// GET | www.localost:3002/api/v2/movie/834
router.get('/:id', [validateIdParam, checkTicketExists], getSingleTicket);

// POST | www.localost:3002/api/v2/movies
router.post('/', validateTicketBody, createTicket);

// PUT Routes | www.localost:3002/api/v2/movies/834
router.put('/:id', [validateIdParam, checkTicketExists, validateUpdateBody], updateTicket);

// DELETE www.localost:3002/api/v2/movies/834
router.delete('/:id', [validateIdParam, checkTicketExists], deleteTicket);

module.exports = router;