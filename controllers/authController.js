const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { baseUrl, jwtSecret } = require('../config/config');
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const sendInvitation = require('../utils/InviteEmail');

const prisma = new PrismaClient();

// Signup
exports.signup = async (req, res) => {
    const { email, password, role, profileData } = req.body; // Accept roles and profile data from the client

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }
    try {
        // Check if email exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).send('Email already in use.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = uuid.v4();

        // Create the new user with optional roles and profile
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                verificationToken,
                // Optional: roles can be provided as an array of role names
                role: role || 'USER',
            },
        });

        // Send verification email (you can modify this to match your setup)
        const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;
        sendVerificationEmail(email, verificationLink);

        res.status(200).send('Signup successful! Please check your email to verify your account.');
        console.log(verificationToken, "token");

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Error during signup.');
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send('Verification token is missing.');
    }

    try {
        // Find the user by verification token
        const user = await prisma.user.findUnique({
            where: { verificationToken: token },
        });

        if (!user) {
            return res.status(400).send('Invalid verification token.');
        }

        // Update the user's verified status and clear the token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                verified: true,
                verificationToken: null,
            },
        });

        res.status(200).send('Your email has been successfully verified.');
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).send('Something went wrong. Please try again later.');
    }
};

exports.InvitationEmail = async (req, res) => {
    const { email, organization, role } = req.body;

    // Basic validation
    if (!email || !organization || !role) {
        return res.status(400).json({ error: 'Email, organization, and role are required' });
    }

    try {
        await sendInvitation(email, organization, role);
        res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send invitation' });
    }
}

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid email or password.');
        }

        // Check if the user is verified (optional based on your business logic)
        if (!user.verified) {
            return res.status(400).send('Please verify your email first.');
        }

        // Generate a session token
        const sessionToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store the session in the database
        await prisma.session.create({
            data: {
                userId: user.id,
                token: sessionToken,
                expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
                isActive: true,
            },
        });

        res.status(200).send({ message: 'Login successful!' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Something went wrong. Please try again later.');
    }
};

exports.logout = async (req, res) => {
    try {
        const { user } = req; // This should be populated by validateSession middleware
        if (!user) {
            return res.status(400).send('User not authenticated.');
        }

        // Option 1: Remove the session token from the database (if storing tokens)
        await prisma.session.deleteMany({
            where: { userId: user.id },
        });

        // Option 2: You can also send a response indicating successful logout
        res.status(200).send('Logged out successfully.');
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).send('Internal server error.');
    }
};

exports.deleteUser = async (userId) => {
    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }, // Include the profile to check its existence
        });

        if (!user) {
            throw new Error('User not found.');
        }

        // Delete the profile if it exists
        if (user.profile) {
            await prisma.profile.delete({
                where: { userId: userId },
            });
        }

        // Delete the user
        await prisma.user.delete({
            where: { id: userId },
        });

        return { message: 'User deleted successfully.' };
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Error deleting user.');
    }
};



// Protected Route
exports.protected = (req, res) => {
    res.status(200).send(`Welcome, ${req.user.userId}. You have access to this protected route.`);
};
