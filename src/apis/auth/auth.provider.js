import jwt from 'jsonwebtoken';
import 'dotenv/config';

class AuthProvider{
    async encodeToken(user){
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
                algorithm: 'HS256'
            }
        );
        return token;
    }
    async decodeToken(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
export default new AuthProvider();