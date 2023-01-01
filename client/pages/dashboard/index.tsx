import { GetServerSideProps } from 'next';
import React from 'react';
import LogoutButton from '../../components/LogoutButton';
import VerifyButton from '../../components/VerifyButton';
import dayjs from 'dayjs';

export type IUser = {
  username: string;
  email: string;
  createdAt: string;
  isVerified: boolean;
  githubID: string;
  isBanned: boolean;
};

const Dashboard = ({ user }: any) => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      {/* pretty print createdat date */}
      <p>Created At: {dayjs(user.createdAt).format('MMMM D, YYYY')}</p>
      <p>Verified: {user.isVerified ? 'True' : 'False'}</p>
      <LogoutButton />
      {!user.isVerified && <VerifyButton user={user} />}
    </div>
  );
};

export default Dashboard;

//getServerSideProps to get the user data on server
export const getServerSideProps: GetServerSideProps = async (context) => {
  //get the user data from the session
  if (!context.req.headers.cookie) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }
  try {
    const res = await fetch(`http://localhost:3000/api/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        cookie: context.req.headers.cookie
      }
    });
    const data = await res.json();

    if (!res.ok) {
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      };
    }
    return {
      props: {
        user: data.user
      }
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }
};
