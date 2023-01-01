import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const LogoutButton = () => {
  const [interactive, setInteractive] = useState(true);
  const router = useRouter();
  const onClick = async () => {
    setInteractive(false);
    try {
      const response = await fetch('/api/user/logout', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message);
      } else {
        toast.success('Logout successful. Redirecting...');
        router.push('/');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    setInteractive(true);
  };
  return (
    <button onClick={onClick} disabled={!interactive}>
      Logout
    </button>
  );
};

export default LogoutButton;
