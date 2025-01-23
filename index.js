const express = require('express');
const { port } = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bodyParsr = require('body-parser');
const { PrismaClient  } = require('@prisma/client');
const webhookController = require('./controllers/webhookController');

const app = express();

// app.use(bodyParsr.json()); // use this for private route
const prisma = new PrismaClient ();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.post('/webhook', webhookController.webhook);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
