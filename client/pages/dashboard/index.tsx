import React, { useContext } from 'react';
import LogoutButton from '../../components/LogoutButton';
import VerifyButton from '../../components/VerifyButton';
import dayjs from 'dayjs';
import Head from 'next/head';
import UserContext from '../../contexts/UserContext';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  if(!user){
    //this never happens because of AuthGuard, left here for Typescript to be happy
    toast.error('You are not logged in');
    return <div>Redirecting...</div>
  }
  return (
    <>
      <Head>
        <title>{`${user.username}'s dashboard`}</title>
        <meta name="description" content="User Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <h1>Dashboard</h1>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Created At: {dayjs(user.createdAt).format('MMMM D, YYYY')}</p>
        <p>Verified: {user.isVerified ? 'True' : 'False'}</p>
        <p>Github ID: {user.githubID}</p>
        <LogoutButton />
        {!user.isVerified && <VerifyButton user={user} />}
      </div>
    </>
  );
};

Dashboard.requireAuth = true;
export default Dashboard;