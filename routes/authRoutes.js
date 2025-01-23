const express = require('express');
const authController = require('../controllers/authController');
const validateSession = require('../middleware/validateSession');

const router = express.Router();

router.post('/signup', authController.signup);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.get('/logout', validateSession, authController.logout); 
router.delete('/:userId', validateSession, authController.deleteUser);
router.get('/protected', validateSession, authController.protected);

module.exports = router;
