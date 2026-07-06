const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  points: { type: Number, default: 0 }, // For gamification
  history: [String], // For personalized recommendations
});
module.exports = mongoose.model('User', UserSchema);