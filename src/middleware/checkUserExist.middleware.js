export default function validateUserExistence(req, res, next) {
  const { id } = req.params;
  const user = users.find(u => u.id === parseInt(id));
  if (!user) {
    return res.status(404).json({ error: 'Người dùng không tồn tại' });
  }
  next();
}