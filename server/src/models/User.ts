import mongoose from 'mongoose';

export interface Tuser extends mongoose.Document {
	username: string;
	password: string;
	email: string;
	createdAt: string;
	githubID: string;
	isVerified: boolean;
	isBanned: boolean;
	// array of user ids
	friends: string[];
}

const userSchema = new mongoose.Schema({
	username: { type: String, unique: true },
	password: String,
	email: { type: String, unique: true, required: true },
	createdAt: String,
	githubID: String,
	isVerified: Boolean,
	isBanned: Boolean,
	//array of user ids
	friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('User', userSchema);
