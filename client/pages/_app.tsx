import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '../contexts/UserContext';
import AuthGuard from '../components/AuthGuard';

export default function App({
  Component,
  pageProps
}: {
  Component: any;
  pageProps: any;
}) {
  return (
    <UserProvider>
      {Component.requireAuth ? (
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      ) : (
        <Component {...pageProps} />
      )}
      <Toaster />
    </UserProvider>
  );
}
