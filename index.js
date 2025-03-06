const express = require("express");
const cors = require("cors");
const { port } = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const organizationRoutes = require("./routes/orgRoutes");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const webhookController = require("./controllers/webhookController");

const app = express();
const prisma = new PrismaClient();

// CORS Configuration
const corsOptions = {
    origin: "http://localhost:5173", // Allow requests only from your frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allow cookies/auth headers
};

// Apply CORS Middleware
app.use(cors(corsOptions));

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/organization", organizationRoutes);
app.post("/webhook", webhookController.webhook);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
