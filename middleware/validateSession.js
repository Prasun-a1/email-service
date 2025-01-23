const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { jwtSecret } = require('../config/config');

const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);

        // Check the session in the database
        const session = await prisma.session.findUnique({
            where: { token },
        });

        if (!session || !session.isActive || session.expiresAt < new Date()) {
            return res.status(401).send('Invalid or expired session.');
        }

        // Attach the user information to the request object
        req.user = { id: session.userId, ...decoded };
        next();
    } catch (err) {
        console.error('Error validating session:', err);
        res.status(401).send('Invalid or expired token.');
    }
};
