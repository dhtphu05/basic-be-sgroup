import AuthService from './auth.service.js';

class AuthController {
    async register(req, res, next) {
        try {
            console.log('\n🔷 Register Controller:');
            console.log('📥 Received data:', req.body);
        
            const { username, email, password } = req.body;
            
            // Validate input
            if (!username || !email || !password) {
                console.log('❌ Validation failed:', { username, email, password });
                return res.status(400).json({
                    success: false,
                    message: 'Please provide username, email and password'
                });
            }
            console.log('✅ Validation passed, calling AuthService...');
            // Register user
            const result = await AuthService.register(username, email, password);
            console.log('📤 Service result:', result);
            // Attach user to request for next middleware
            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
            
            // Continue to next middleware
            
        } catch (error) {
            console.error('Registration controller error:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            
            // Validate input
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide username and password'
                });
            }
            
            // Login user
            const result = await AuthService.login(username, password);
            
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            console.error('Login controller error:', error);
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    async example(req, res) {
        try {
            const userLogin = req.body;
            const username = userLogin.name;
            const password = userLogin.password;
            console.log("username:", username);
            const responseSer = await AuthService.example(username, password);
            
            return res.status(200).json({
                success: true,
                data: responseSer
            });
        } catch (error) {
            console.log(error)
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new AuthController();