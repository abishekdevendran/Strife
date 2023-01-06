import mongoose from 'mongoose';

const friendshipSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  _friendId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
});

export interface Tfriendship extends mongoose.Document {
  _userId: string;
  _friendId: string;
  status: string;
};

export default mongoose.model('Friendship', friendshipSchema);