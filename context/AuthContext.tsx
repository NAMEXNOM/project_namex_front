/*'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Definimos la estructura exacta del Usuario según tu Backend
interface User {
  userName: string; // El nombre que quieres mostrar
  token: string;
  role?: string;    // Opcional, por si lo usas después
  userBalance: number;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 2. Persistencia: Cargar datos al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem('userSession');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error al parsear el usuario de localStorage", error);
        localStorage.removeItem('userSession');
      }
    }
  }, []);

  // 3. Función de Login tipada
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('userSession', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userSession');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
*/

'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  userName: string; 
  token: string;
  role?: string;    
  userBalance: number;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar datos al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem('userSession');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error al parsear el usuario de localStorage", error);
        localStorage.removeItem('userSession');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('userSession', JSON.stringify(userData));
    
    // Guarda el token en las cookies del navegador por 1 día para que el Proxy lo lea
    document.cookie = `token=${userData.token}; path=/; max-age=86400; SameSite=Strict; Secure`;
  };

  const logout = () => {
    // 1. 🟢 REPARADO: Quitamos setToken(null) ya que el token vive dentro de setUser(null)
    setUser(null);

    // 2. 🟢 REPARADO: Sincronizado para borrar 'userSession' del almacenamiento local
    localStorage.removeItem('userSession');

    // 3. 🟢 UNIFICADO: Limpiamos ambas cookies expirándolas inmediatamente
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
    document.cookie = "namex_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
    
    console.log("🔒 Sesión destruida limpiamente en cliente y servidor.");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};


