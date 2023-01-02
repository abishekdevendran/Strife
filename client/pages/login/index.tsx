import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, loginFormSchemaType } from '../../models/formSchema';
import { toast } from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import Router from 'next/router';
import Head from 'next/head';
import UserContext from '../../contexts/UserContext';

const Login = () => {
  const secretKey = process.env.NEXT_PUBLIC_COUPLING_SECRET;
  const [interactive, setInteractive] = useState(true);
  const { mutate, user } = useContext(UserContext);
  const router = Router;

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  },[user]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<loginFormSchemaType>({
    resolver: zodResolver(loginFormSchema)
  });

  const submitHandler = async (data: loginFormSchemaType) => {
    setInteractive(false);
    //encrypt password
    data.password = CryptoJS.AES.encrypt(data.password, secretKey!).toString();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message);
      } else {
        toast.success('Login successful. Redirecting...');
        mutate();
        router.push('/dashboard');
      }
      console.log(result);
    } catch (error) {
      console.error(error);
    }
    setInteractive(true);
  };
  return (
    <>
      <Head>
        <title>Strife Login</title>
        <meta name="description" content="Strife Login" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        Login
        <form onSubmit={handleSubmit(submitHandler)}>
          <fieldset disabled={!interactive}>
            <p>Username:</p>
            <input {...register('username')} />
            <p>{errors.username?.message}</p>
            <p>Password:</p>
            <input {...register('password')} type="password" />
            <p>{errors.password?.message}</p>
            <button type="submit">Submit</button>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default Login;
