import mongoose from 'mongoose';

export interface Tserver extends mongoose.Document {
	name: string;
	userCount: number;
	createdAt: string;
	users: string[];
}

const serverSchema = new mongoose.Schema({
	name: { type: String, required: true },
	//default to 1 because the creator is automatically added to the server
	userCount: { type: Number, default: 1 },
	createdAt: String,
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('Server', serverSchema);
