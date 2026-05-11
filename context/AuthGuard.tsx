// context/AuthGuard.tsx
'use client';
import { useAuth } from './AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Si no hay usuario y no estamos en login, manda a login
    if (!user && pathname !== '/login') {
      router.push('/login');
    }
    // Si hay usuario e intenta ir al login, mándalo al home
    if (user && pathname === '/login') {
      router.push('/');
    }
  }, [user, pathname, router]);

  // Si no hay usuario y no es login, no renderizamos nada mientras redirige
  if (!user && pathname !== '/login') return null;

  return <>{children}</>;
};