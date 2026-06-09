/*'use client'
import MainLayout from '../../components/MainLayout'; // Ajusta los puntos según tu carpeta

export default function LayoutPrivado({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}
*/

'use client'
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta a donde guardaste tu componente
import { Button } from 'primereact/button';
import { useRouter, usePathname } from 'next/navigation';

export default function NextMainLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Oculta el botón de regresar si el usuario está en el inicio de la aplicación
    const mostrarRegresar = pathname !== '/';

    return (
        <div className="flex flex-column min-h-screen bg-gray-50">
            {/* BARRA SUPERIOR (HEADER) */}
            <header className="flex justify-content-between align-items-center p-3 bg-white shadow-1 sticky top-0 z-5">
                
                {/* Sección Izquierda: Logo y Botón de Regresar */}
                <div className="flex align-items-center gap-3">
                    <span className="font-bold text-blue-600"> EMPLEADOS</span>
                    
                    {mostrarRegresar && (
                        <Button 
                            icon="pi pi-arrow-left" 
                            className="p-button-text p-button-secondary p-button-sm p-0 h-2rem w-2rem" 
                            onClick={() => router.back()} 
                        />
                    )}
                </div>
                
                {/* Sección Derecha: Usuario y Cierre de sesión */}
                <div className="flex align-items-center gap-3">
                    <span className="text-sm">Hola, <b>{user?.userName || 'Usuario'}</b></span>
                    <Button 
                        icon="pi pi-sign-out" 
                        label="Salir" 
                        className="p-button-text p-button-danger p-button-sm" 
                        onClick={() => logout()} 
                    />
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 flex justify-content-center p-3">
                {/* ⚠️ NOTA: Eliminamos el maxWidth de 500px aquí para que tablas grandes (como la de vacaciones) puedan ocupar todo el ancho en pantallas de escritorio */}
                <div className="w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
