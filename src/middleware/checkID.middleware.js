export default function validateUserId(req, res, next) {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID không hợp lệ' });
  }
  next();
};