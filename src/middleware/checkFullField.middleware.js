
export default function checkFullField(req, res, next) {
    const {name} = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Tên không được để trống' });
    }
    next();
}
