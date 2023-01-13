import mongoose from 'mongoose';

type Tmember = { user: string; role: 'owner' | 'admin' | 'member' };
export interface Tserver extends mongoose.Document {
	name: string;
	userCount: number;
	createdAt: string;
	users?: Tmember[];
}

const serverSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	//default to 1 because the creator is automatically added to the server
	userCount: { type: Number, default: 1 },
	createdAt: String,
	users: [
		{type:{
			user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			role: { type: String, enum: ['owner', 'admin', 'member'] },
		}, required: false}
	],
});

export default mongoose.model('Server', serverSchema);
