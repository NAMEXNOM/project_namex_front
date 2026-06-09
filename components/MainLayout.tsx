'use client'
import { useAuth } from '../context/AuthContext';
import { Button } from 'primereact/button';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-column min-h-screen bg-gray-50">
            {/* BARRA SUPERIOR (HEADER) */}
            <header className="flex justify-content-between align-items-center p-3 bg-white shadow-1 sticky top-0 z-5">
                <span className="font-bold text-blue-600">EMPLEADOS</span>
                
                <div className="flex align-items-center gap-3">
                    <span className="text-sm">Hola, <b>{user?.userName.split(" ")[0] || 'Usuario'}</b></span>
                    <Button 
                        icon="pi pi-sign-out" 
                        label="Salir" 
                        className="p-button-text p-button-danger p-button-sm" 
                        onClick={() => logout()} 
                    />
                </div>
            </header>

            {/* CONTENIDO CENTRADO */}
            <main className="flex-1 flex justify-content-center p-3">
                <div className="w-full" style={{ maxWidth: '500px' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
