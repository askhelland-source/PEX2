const express = require('express');

const ticketRoutes = require('./v1/routes/TicketsRoutes');


const app = express();
const cors = require('cors');

//middleware
app.use(express.json());
app.use(cors());

// Setup Routes | www.localhost:3002/api/v1/tickets
app.use('/api/v1/tickets', ticketRoutes);

app.listen(3002, () => {
    console.log('Server running on port 3002');
});