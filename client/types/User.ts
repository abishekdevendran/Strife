export type IServer = {
	name: string;
	_id: string;
}

type IUser = {
	username?: string;
	email: string;
	createdAt: string;
	isVerified: boolean;
	githubID?: string;
	isBanned: boolean;
	servers?: IServer[];
	friends?: IUser[];
};

export default IUser;
