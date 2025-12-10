const { getAllObjects, getObjectById, deleteObjectById, updateObjectById, addObject } = require('../data/DataBaseTicket');
const { get } = require('../routes/TicketsRoutes');


const getAllTickets = async (req, res) => {
    try {
        const tickets = await getAllObjects();
        res.status(200).json({success: true, data: tickets});
    } catch (error) {
        res.status(500).json({success: false, error: "Something went wrong, we cant get the tickets ):"});

    }
};

const getSingleTicket = async (req, res) => {
    try {
        const id = parseInt(req.params.id); // Sørger for at ID er et tall. Konvertere fra string til integer. 

        res.status(200).json({sucess: true, data: req.ticket}); // Viktig JavaScript leser fra topp til bunn. Så retuner godkjent status etter all validering.

    }   catch (error) {
        res.status(500).json({sucess: false, error: "Something went wrong, we cant find the ticket you are looking for ):"});
    }
}


const createTicket = async (req, res) => {
    try{
        const {title, description, status} = req.body;

        const newTicketData = ({title, description, status: status || "Open"});
        const newTicket = await addObject(newTicketData);
        
        res.status(201).json({success: true, data: newTicket}); // Viktig JavaScript leser fra topp til bunn. Så retuner godkjent status etter all validering.
        
    } catch (error) {
        res.status(500).json({success: false, error: "Something went wrong, we cant create the ticket  ):"});

        }
}

const updateTicket = async (req, res) => {
    try{
        const {id} = req.params;
        const updateData = req.body;
        const updatedTicket = await updateObjectById(id, updateData); //Oppdaterer studenten ETTER validering
 
        res.status(200).json({success: true, data: updatedTicket}); // Viktig JavaScript leser fra topp til bunn. Så retuner godkjent status etter all validering.

    } catch(error){
        res.status(500).json({success: false, error: "Something went wrong, we cant update the ticket):"});
    }
}


const deleteTicket = async (req, res) => {
    try{

        const {id} = req.params;
        const deleted = await deleteObjectById(id);

        res.status(200).json({success: true, message: "Ticket deleted"});

    } catch(error){
        res.status(500).json({success: false, error: "Something went wrong, we cant delete the ticket ):"});
    }

}




//Search start

const searchTickets = (req, res) => {
    const { q } = req.query;

    // Hvis søket er tomt
    if (!q) {
        return res.json({ success: true, data: [] });
    }

    const tickets = getData();
    const searchId = q.replace(/[^0-9]/g, ''); 

    const results = tickets
        .map(ticket => {
            const combinedText = `
                ${ticket.title}
                ${ticket.description}
                ${ticket.status}
                ${ticket.id}
                ${ticket.date || ""}
            `.replace(/\s+/g, " ").toLowerCase();
            
            const queryLower = q.toLowerCase();
            let score = calculateScore(combinedText, queryLower);

            // ID-Sjekk logikk
            if (String(ticket.id) === q.trim()) {
                score += 100; 
            } else if (searchId && String(ticket.id) === searchId) {
                score += 50; 
            }

            return { ...ticket, score };
        })
        .filter(t => t.score > 0)
        .sort((a, b) => b.score - a.score);

    res.json({ success: true, data: results });
};

// --- HJELPEFUNKSJON (kan ligge nederst i fila, men ikke eksporteres) ---
function calculateScore(text, query) {
    if (!text.includes(query)) return 0;
    let s = 1;
    if (text === query) s += 10;
    if (text.startsWith(query)) s += 5;
    return s;
}

// Search end


module.exports = {
    getAllTickets,
    getSingleTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    searchTickets
};