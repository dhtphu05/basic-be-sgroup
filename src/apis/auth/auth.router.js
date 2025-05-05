import express from 'express';
import AuthController from './auth.controller.js';
import { authenticateToken, authorizeRoles } from './auth.middleware.js';

const authRoute = express.Router();

// Test route
authRoute.post('/example', AuthController.example);

// Auth routes
authRoute.post('/register', AuthController.register);
authRoute.post('/login', AuthController.login);
authRoute.post('/forgot-password', AuthController.forgotPassword);
authRoute.post('/reset-password/:token', AuthController.resetPassword);
// Protected route example
authRoute.get('/profile', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Profile accessed successfully',
        data: req.user
    });
});

// Admin only route
authRoute.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({
        success: true,
        message: 'Admin access granted',
        data: req.user
    });
});

export default authRoute;