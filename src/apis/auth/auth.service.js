import { UserRepository } from '../../repositories/users.repository.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../../models/users.model.js';

const userRepo = new UserRepository();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

class AuthService {
    async register(username, email, password) {
        try {
            // Check if user already exists
            const existingUser = await userRepo.findByUsername(username);
            if (existingUser) {
                throw new Error('Username already exists');
            }

            const existingEmail = await userRepo.findByEmail(email);
            if (existingEmail) {
                throw new Error('Email already in use');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const newUser = await UserModel.create({
                username,
                name: username, // Sử dụng username làm name nếu cần
                email,
                password: hashedPassword,
                role: 'user',
                createdAt: new Date().toISOString()
            });

            // Generate JWT token
            const token = this._generateToken(newUser);

            // Return user info (without password) and token
            const userResponse = {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            };

            return {
                user: userResponse,
                token
            };
        } catch (error) {
            console.error('Registration error:', error.message);
            throw error;
        }
    }

    async login(username, password) {
        try {
            // Find user by username
            const user = await UserModel.findOne({ username });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            // Generate JWT token
            const token = this._generateToken(user);

            // Return user info (without password) and token
            const userResponse = {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            };

            return {
                user: userResponse,
                token
            };
        } catch (error) {
            console.error('Login error:', error.message);
            throw error;
        }
    }

    // Helper method to generate JWT token
    _generateToken(user) {
        return jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
    }

    // For testing only
    async example(username, password) {
        console.log(`Example service called with username: ${username} and password: ${password}`);
        return { message: 'Example service' };
    }
}

export default new AuthService();