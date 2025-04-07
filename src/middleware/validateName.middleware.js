export default function validateName(req, res, next) {
    const { name } = req.body;
    const nameRegex= /^[a-zA-Z\s]+$/;
    if (!name || !nameRegex.test(name)) {
        return res.status(400).json({ error: 'Tên không hợp lệ' });
    }
    next(); 
}