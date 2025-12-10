const { getObjectById } = require('../data/DataBaseTicket');

// Sjekker om ID er et number
const validateIdParam = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ success: false, error: "Invalid ID format. The ID must be a number." });
    }
    req.id = id; 
    next();
};

// Her ser vi om rating og navn følger reglene vi har bestemnt
//Validerer navn
const validateTitle = (tittle) => {
    if (typeof tittle !== "string") {
        return "Invalid type. 'name' must be a string.";
    }
    const trimmedName = tittle.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
        return "'name' must be between 2 and 100 characters long.";
    }
    const nameRegex = /^[A-Za-zÅåØøÆæ0-9\s\-:',.?!]+$/; 
    if (!nameRegex.test(trimmedName)) {
        return "'name' contains invalid characters.";
    }
    return null; 
};


//Validerer beskrivelse
const validateDescription = (description) => {
    if (typeof description !== "string") {
        return "Invalid type. 'description' must be a string.";
    }
    const trimmedDesc = description.trim();
    if (trimmedDesc.length < 5) {
        return "'description' is too short. Please provide more details.";
    }
    // Vi bruker vanligvis ikke streng regex på description, da folk skriver hva som helst der.
    return null;
};

//Validerer status
const validateStatus = (status) => {
    if (typeof status !== "string") {
        return "Invalid type. 'status' must be a string.";
    }

    const allowedStatuses = ["Open", "In Progress", "Closed"];
    
    if (!allowedStatuses.includes(status)) {
        return `Invalid status. Allowed values are: ${allowedStatuses.join(", ")}`;
    }
    return null;
};


// Sjekker om body er gyldig for å lage en ticket
const validateTicketBody = (req, res, next) => {
    const { title, description, status } = req.body;

    // Sjekk at feltene eksisterer
    if (!title || !description) {
        return res.status(400).json({ 
            success: false, 
            error: "Missing fields. 'title' and 'description' are required." 
        });
    }

    // Valider title
    const titleError = validateTitle(title);
    if (titleError) return res.status(400).json({ success: false, error: titleError });

    // Valider description
    const descError = validateDescription(description);
    if (descError) return res.status(400).json({ success: false, error: descError });

    // Valider status 
    if (status) {
        const statusError = validateStatus(status);
        if (statusError) return res.status(400).json({ success: false, error: statusError });
    }

    next();
};



// Sjekker om ticket eksisterer og setter den i req
const checkTicketExists = async (req, res, next) => {
    const ticket = await getObjectById(req.id); 
    
    if (!ticket) {
        return res.status(404).json({
            success: false,
            error: "Ticket not found. Maybe you typed the wrong ID?"
        });
    }
    req.ticket = ticket; // Legger ticket objektet på requesten så vi kan bruke det senere
    next();
};


//Sjekker om vi kan oppdatere student
const validateUpdateBody = (req, res, next) => {
    const { title, description, status } = req.body;
    let error;

    // Må ha minst én ting å oppdatere
    if (title === undefined && description === undefined && status === undefined) {
        return res.status(400).json({ 
            success: false, 
            error: "No data provided. Update requires 'title', 'description' or 'status'." 
        });
    }

    if (title !== undefined) {
        error = validateTitle(title);
        if (error) return res.status(400).json({ success: false, error });
    }

    if (description !== undefined) {
        error = validateDescription(description);
        if (error) return res.status(400).json({ success: false, error });
    }

    if (status !== undefined) {
        error = validateStatus(status);
        if (error) return res.status(400).json({ success: false, error });
    }

    next();
};


module.exports = {
    validateIdParam,
    validateTicketBody,
    checkTicketExists,
    validateUpdateBody
};

