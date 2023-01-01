import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, loginFormSchemaType } from '../../models/formSchema';
import { toast } from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import Router from 'next/router';

const Login = () => {
  const secretKey = process.env.NEXT_PUBLIC_COUPLING_SECRET;
  const [interactive, setInteractive] = useState(true);
  const router = Router;
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
      if (response.status !== 200) {
        toast.error(result.message);
      }
      else{
        toast.success('Login successful. Redirecting...');
        router.push('/dashboard');
      }
      console.log(result);
    } catch (error) {
      console.error(error);
    }
    setInteractive(true);
  };
  return (
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
  );
};

export default Login;
