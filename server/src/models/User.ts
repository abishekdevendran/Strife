import mongoose from 'mongoose';

export type Tuser = {
	username: string;
	password: string;
	email: string;
	createdAt: string;
	githubID: string;
	isVerified: boolean;
	isBanned: boolean;
};

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: { type: String, unique: true, required: true },
	createdAt: String,
	githubID: String,
	isVerified: Boolean,
	isBanned: Boolean,
});

export default mongoose.model('User', userSchema);
