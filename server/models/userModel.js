import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true  // allows null/undefined without unique conflict
  },
  photo: {
    type: String
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
