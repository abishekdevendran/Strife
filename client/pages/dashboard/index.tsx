import React, { useEffect } from 'react';
import LogoutButton from '../../components/LogoutButton';
import VerifyButton from '../../components/VerifyButton';
import dayjs from 'dayjs';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import WithAuth from '../../components/WithAuth';
import IUser, { IServer } from '../../types/User';

const serverRender = (servers: IServer[] | undefined) => {
	if (!servers || servers.length === 0) {
		return <div className='text-center'>Not part of any servers yet. Create one!</div>;
	}
	return (
		<>
			{servers.forEach((server: any) => {
				const { name, id } = server;
				return <div className="avatar">{JSON.stringify(name[0])}</div>;
			})}
		</>
	);
};

const friendsRender = (friends: IUser[] | undefined) => {
	if (!friends || friends.length === 0) {
		return <div className="text-center">No friends yet. :(</div>;
	}
	return (
		<>
			{friends.forEach((friend: any) => {
				const { username, id } = friend;
				return <div className="avatar">{JSON.stringify(username[0])}</div>;
			})}
		</>
	);
};
// {user}:{user:IUser}
const Dashboard = ({ user }: { user: IUser }) => {
	if (!user) {
		//this never happens because of AuthGuard, left here for Typescript to be happy
		toast.error('You are not logged in');
		return <div>Redirecting...</div>;
	}
	useEffect(() => {
		console.log('mounted');
		console.log(user);
	}, []);

	return (
		<>
			<Head>
				<title>{`${user.username}'s dashboard`}</title>
				<meta name="description" content="User Dashboard" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<div className="card bg-base-200 p-4 mt-20 flex flex-col items-center justify-between gap-4">
				<div className="w-full h-full card bg-base-300 sm:p-8 sm:py-10 p-4 py-6">
					<h2 className="prose text-5xl font-extrabold mb-8 text-center">
						Dashboard
					</h2>
					<div className="mb-10">
						<p>Username: {user.username}</p>
						<p>Email: {user.email}</p>
						<p>Created At: {dayjs(user.createdAt).format('MMMM D, YYYY')}</p>
						<p>Verified: {user.isVerified ? 'True' : 'False'}</p>
					</div>
					{!user.isVerified && <VerifyButton user={user} />}
					<LogoutButton />
				</div>
				<div className="w-full h-full card bg-base-300 sm:p-8 sm:py-10 p-4 py-6">
					{serverRender(user.servers)}
				</div>
				<div className="w-full h-full card bg-base-300 sm:p-8 sm:py-10 p-4 py-6">
					{friendsRender(user.friends)}
				</div>
			</div>
		</>
	);
};

export default WithAuth(Dashboard);
