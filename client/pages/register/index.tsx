import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerFormSchema, registerFormSchemaType } from '../../models/formSchema';
import { toast } from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import useSWR from 'swr';
import { useRouter } from 'next/router';

const Register = () => {
  const secretKey = process.env.NEXT_PUBLIC_COUPLING_SECRET;
  const [interactive, setInteractive] = useState(true);
  const router = useRouter();

  const { error, isLoading } = useSWR('/api/user', async () => {
    const res = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    if (res.ok && data.user) {
      toast.success('Already logged in. Redirecting to dashboard...');
      router.push('/dashboard');
      return;
    }
    setInteractive(true);
    return data;
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<registerFormSchemaType>({
    resolver: zodResolver(registerFormSchema)
  });

  const submitHandler = async (data: registerFormSchemaType) => {
    setInteractive(false);
    //check if passwords match
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      setInteractive(true);
      return;
    }
    //drop confirmPassword
    delete data.confirmPassword;
    //encrypt password
    data.password = CryptoJS.AES.encrypt(data.password, secretKey!).toString();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.status !== 200) {
        toast.error(result.message);
      } else {
        toast.success('Registartion successful. Redirecting...');
      }
      console.log(result);
    } catch (error) {
      console.error(error);
    }
    setInteractive(true);
  };

  return (
    <div>
      Register
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <form onSubmit={handleSubmit(submitHandler)}>
        <fieldset disabled={!interactive}>
          <p>Username:</p>
          <input {...register('username')} />
          <p>{errors.username?.message}</p>
          <p>Password:</p>
          <input {...register('password')} />
          <p>{errors.password?.message}</p>
          <p>Confirm Password:</p>
          <input {...register('confirmPassword')} type="password" />
          <p>{errors.confirmPassword?.message}</p>
          <p>Email:</p>
          <input {...register('email')} />
          <p>{errors.email?.message}</p>
          <button type="submit">Submit</button>
        </fieldset>
      </form>
    </div>
  );
};

export default Register;
