/*

// context/AuthGuard.tsx
'use client';
import { useAuth } from './AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  // 1. Extraemos el estado 'loading' que añadimos a tu contexto
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 2. CRÍTICO: Si el AuthContext sigue leyendo el localStorage, nos esperamos.
    if (loading) return;

    // 3. Definimos qué páginas son públicas (cualquiera puede verlas sin loguearse)
    const esRutaPublica = pathname === '/login' || pathname === '/recover';

    // 4. Si no hay usuario y no es una ruta pública, lo mandamos al login
    if (!user && !esRutaPublica) {
      router.push('/login');
    }
    
    // 5. Si ya hay un usuario activo e intenta ir al login o recover, lo mandamos al home
    if (user && esRutaPublica) {
      // Excepción especial: Si el usuario tiene estatus TEMPORAL, lo mandamos a cambiar clave
      if (user.role === 'sin-role' || user.userName.includes('TEMPORAL')) { 
         // Esto es opcional por si quieres forzarlo desde aquí, si no, directo a '/'
         router.push('/');
      } else {
         router.push('/');
      }
    }
  }, [user, pathname, router, loading]);

  // 6. Mientras lee el localStorage, podemos mostrar una pantalla de carga limpia de PrimeReact
  if (loading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen surface-ground">
         <i className="pi pi-spin pi-spinner text-blue-500" style={{ fontSize: '3rem' }}></i>
      </div>
    );
  }

  // 7. Si no hay sesión y no es una ruta pública, bloqueamos el renderizado mientras redirige
  const esRutaPublica = pathname === '/login' || pathname === '/recover' || pathname === '/change-password';
  if (!user && !esRutaPublica) return null;

  return <>{children}</>;
};
*/

// context/AuthGuard.tsx
'use client';
import { useAuth } from './AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Esperar a que el Context lea el localStorage

    // 🚨 REGISTRO DE RUTAS PÚBLICAS REPARADO: Añadimos /recover y /change-password
    const esRutaPublica = pathname === '/login' || pathname === '/recover' || pathname === '/change-password';

    // Si no hay usuario y quiere ingresar a una pantalla privada, lo expulsamos
    if (!user && !esRutaPublica) {
      router.push('/login');
    }
    
    // Si ya inició sesión de forma normal e intenta entrar a login o recover, al home
    if (user && (pathname === '/login' || pathname === '/recover')) {
      router.push('/');
    }
  }, [user, pathname, router, loading]);

  // Si el AuthContext está cargando, mostramos spinner limpio de PrimeReact
  if (loading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen surface-ground">
         <i className="pi pi-spin pi-spinner text-blue-500" style={{ fontSize: '3rem' }}></i>
      </div>
    );
  }

  // 🚨 PROTECCIÓN REPARADA: No bloqueamos el renderizado de las 3 páginas públicas
  const esRutaPublica = pathname === '/login' || pathname === '/recover' || pathname === '/change-password';
  if (!user && !esRutaPublica) return null;

  return <>{children}</>;
};

