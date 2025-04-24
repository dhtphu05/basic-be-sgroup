import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  username: { type: String, required: true, unique: true },

});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;