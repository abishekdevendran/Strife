import React from 'react';
import LogoutButton from '../../components/LogoutButton';
import VerifyButton from '../../components/VerifyButton';
import dayjs from 'dayjs';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import WithAuth from '../../components/WithAuth';
import IUser from '../../types/User';
import UserContext from '../../contexts/UserContext';

// {user}:{user:IUser}
const Dashboard = ({ user }: { user: IUser }) => {
	// const { user } = React.useContext(UserContext);
	if (!user) {
		//this never happens because of AuthGuard, left here for Typescript to be happy
		toast.error('You are not logged in');
		return <div>Redirecting...</div>;
	}
	return (
		<>
			<Head>
				<title>{`${user.username}'s dashboard`}</title>
				<meta name="description" content="User Dashboard" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<div className="card bg-base-300 sm:p-16 sm:py-20 p-8 py-12">
				<h2 className="prose text-5xl font-extrabold mb-8">Dashboard</h2>
				<p>Username: {user.username}</p>
				<p>Email: {user.email}</p>
				<p>Created At: {dayjs(user.createdAt).format('MMMM D, YYYY')}</p>
				<p>Verified: {user.isVerified ? 'True' : 'False'}</p>
				<LogoutButton />
				{!user.isVerified && <VerifyButton user={user} />}
			</div>
		</>
	);
};

export default WithAuth(Dashboard);
