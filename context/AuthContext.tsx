'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Definimos la estructura exacta del Usuario según tu Backend
interface User {
  userName: string; // El nombre que quieres mostrar
  token: string;
  role?: string;    // Opcional, por si lo usas después
  userBalance: number;
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
