import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';
import LoadingPage from '../../components/LoadingPage';

const Token = () => {
  const router = useRouter();
  const { token } = router.query;
  const { error, isLoading } = useSWR('verify', async () => {
    if (!token) return;
    const res = await fetch(`/api/verify/${token}`);
    const data = await res.json();
    if (!res.ok && data.message) {
      toast.error(data.message);
    }
    if (res.ok) {
      toast.success(data.message);
      router.push('/dashboard');
    }
    router.push('/login');
    console.log(data);
    return data;
  });
  if (error) return <div>Error</div>;
  if (isLoading) return <LoadingPage />;
  return null;
};

export default Token;
