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

module.exports = {
    getAllTickets,
    getSingleTicket,
    createTicket,
    updateTicket,
    deleteTicket
};