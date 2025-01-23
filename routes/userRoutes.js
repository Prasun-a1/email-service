const express = require('express');
const userService = require('../service/userService');
const validateSession = require('../middleware/validateSession');

const router = express.Router();

// Create a user
router.post('/', async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a user by ID
// use validateToken after "/:id, validateToken" for private route
router.get('/:id',  async (req, res) => {
    try {
        const singleUser = await userService.getUserById(parseInt(req.params.id), req.body);

        if (!singleUser) return res.status(404).send('User not found.');

        res.status(200).json(singleUser);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(400).json({ error: error.message });
    }
});


// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        const simplifiedUsers = users.map((user) => ({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            verified: user.verified,
            role: user.role,
            profile: user.profile,
        }));
        res.status(200).json(simplifiedUsers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(parseInt(req.params.id), req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await userService.deleteUser(parseInt(req.params.id));
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
