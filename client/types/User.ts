type IUser = {
	username?: string;
	email: string;
	createdAt: string;
	isVerified: boolean;
	githubID?: string;
	isBanned: boolean;
};

export default IUser;
