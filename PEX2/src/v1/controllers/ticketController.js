const { getAllObjects, getObjectById, deleteObjectById, updateObjectById, addObject } = require('../data/DataBaseTicket');
const { get } = require('../routes/TicketsRoutes');
const Fuse = require('fuse.js');
const path = require("path");



const getAllTickets = async (req, res) => {
    try {
        const tickets = await getAllObjects();
        return res.status(200).json({ success: true, data: tickets });
    } catch (error) {

        if (req.headers["accept"] && req.headers["accept"].includes("text/html")) {
            return res.status(500).sendFile(path.join(__dirname, "../../ServerError.html"));
        } else {
            console.error("Error in getAllTickets:", error);
            return res.status(500).json({ success: false, error: "Something went wrong, we can't get the tickets ):" });
        }

    }
};


const getSingleTicket = async (req, res) => {
    try {
        const id = parseInt(req.params.id); // Sørger for at ID er et tall. Konvertere fra string til integer. 

        res.status(200).json({sucess: true, data: req.ticket}); // Viktig JavaScript leser fra topp til bunn. Så retuner godkjent status etter all validering.

    } catch (error) {

        if (req.headers["accept"] && req.headers["accept"].includes("text/html")) {
            return res.status(500).sendFile(path.join(__dirname, "../../ServerError.html"));
        } else {
            console.error("Error in getAllTickets:", error);
            return res.status(500).json({ success: false, error: "Something went wrong, we can't get the ticket ):" });
        }

    }
};


const createTicket = async (req, res) => {
    try{
        const {title, description, status} = req.body;

        const newTicketData = ({title, description, status: status || "Open"});
        const newTicket = await addObject(newTicketData);
        
        res.status(201).json({success: true, data: newTicket}); // Viktig JavaScript leser fra topp til bunn. Så retuner godkjent status etter all validering.
        
    } catch (error) {

        if (req.headers["accept"] && req.headers["accept"].includes("text/html")) {
            return res.status(500).sendFile(path.join(__dirname, "../../ServerError.html"));
        } else {
            console.error("Error in getAllTickets:", error);
            return res.status(500).json({ success: false, error: "Something went wrong, we can't create the ticket ):" });
        }

    }
};

const updateTicket = async (req, res) => {
    try{
        const {id} = req.params;
        const updateData = req.body;
        const updatedTicket = await updateObjectById(id, updateData); //Oppdaterer studenten ETTER validering
 
        res.status(200).json({success: true, data: updatedTicket}); // Viktig JavaScript leser fra topp til bunn. Så retuner godkjent status etter all validering.

    } catch (error) {

        if (req.headers["accept"] && req.headers["accept"].includes("text/html")) {
            return res.status(500).sendFile(path.join(__dirname, "../../ServerError.html"));
        } else {
            console.error("Error in getAllTickets:", error);
            return res.status(500).json({ success: false, error: "Something went wrong, we can't update the ticket):" });
        }

    }
};


const deleteTicket = async (req, res) => {
    try{

        const {id} = req.params;
        const deleted = await deleteObjectById(id);

        res.status(200).json({success: true, message: "Ticket deleted"});

    } catch (error) {

        if (req.headers["accept"] && req.headers["accept"].includes("text/html")) {
            return res.status(500).sendFile(path.join(__dirname, "../../ServerError.html"));
        } else {
            console.error("Error in getAllTickets:", error);
            return res.status(500).json({ success: false, error: "Something went wrong, we can't delete the ticket):" });
        }

    }
};





//Search start
const searchTickets = async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    try {
        const tickets = await getAllObjects();

        // Konfigurasjon for Fuse
        const options = {
            keys: ['title', 'description', 'status', 'id', 'createdAt', 'completedAt'],
            threshold: 0.6, // Jo lavere, jo strengere match
            ignoreLocation: true,
            includeScore: true,
        };

        const fuse = new Fuse(tickets, options);
        const results = fuse.search(q).map(r => r.item);

        res.json({ success: true, data: results });

    } catch (error) {
        res.status(500).json({ success: false, error: "Something went wrong while searching tickets: " + error.message });
    }
};


// Search end


module.exports = {
    getAllTickets,
    getSingleTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    searchTickets
};