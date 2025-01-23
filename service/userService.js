const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Create a new user
exports.createUser = async ({ email, password, profile }) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                profile: profile ? {
                    create: {
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        bio: profile.bio || null,
                    },
                } : undefined,
            },
            include: {
                profile: true,
            },
        });
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Get a user by ID
exports.getUserById = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                roles: true,
                organization: true,
            },
        });
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};


// Update a user by ID
exports.updateUser = async (userId, { email, password, profile }) => {
    try {
        const updateData = {};
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        if (profile) {
            await prisma.profile.upsert({
                where: { userId },
                create: {
                    userId,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    bio: profile.bio || null,
                },
                update: {
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    bio: profile.bio || null,
                },
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            include: { profile: true },
        });

        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Delete a user by ID
exports.deleteUser = async (userId) => {
    try {
        await prisma.profile.delete({
            where: { userId },
        });

        const deletedUser = await prisma.user.delete({
            where: { id: userId },
        });

        return deletedUser;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

exports.updateProfile = async (req, res) => {
    const { firstName, lastName, bio } = req.body;

    try {
        const userId = req.user.id; // Assuming user is authenticated and `req.user` has the user's info

        const updatedProfile = await prisma.profile.upsert({
            where: { userId },
            update: { firstName, lastName, bio },
            create: { firstName, lastName, bio, userId },
        });

        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Error updating profile.');
    }
};

// Get all users
exports.getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            include: {
                profile: true,
                organization: true,
            },
        });
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};


// Fetch a single user by ID (exclude sensitive data)
exports.getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            profile: true, // Include profile details if available
        },
    });
};