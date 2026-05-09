'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Definimos qué datos queremos guardar del usuario
interface AuthContextType {
  user: { nombre: string; token: string } | null;
  login: (userData: { nombre: string; token: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ nombre: string; token: string } | null>(null);

  // Al cargar, revisamos si ya había una sesión en el navegador
  useEffect(() => {
    const savedUser = localStorage.getItem('userSession');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: { nombre: string; token: string }) => {
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

// Hook para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};