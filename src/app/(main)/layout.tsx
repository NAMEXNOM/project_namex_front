'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useEffect, useRef, useState } from "react";

export default function MainLayout(
  {children}: {children: React.ReactNode}) {
    const [datos, setDatos] = useState<any>(null);

    useEffect(() => {
        // Llamada al endpoint de NestJS
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:5000/users'); // Ajusta a tu ruta real
                const data = await response.json();
                setDatos(data);
            } catch (error) {
                console.error("Error cargando usuario:", error);
            }
        };
        fetchUser();
    }, []);


    const router = useRouter();
    const pathname = usePathname();
    const userMenuRef = useRef<Menu>(null);
    const navigationItems = [
        {name: "Home", href: "/", icon: "pi pi-home"},
        {name: "Usuarios", href: "/users", icon: "pi pi-user"},
        {name: "Roles", href: "/roles", icon: "pi pi-pencil"},
        {name: "Vacaciones", href: "/vacations", icon: "pi pi-car"}

    ]

    const topbarItems: MenuItem[] = [
      { label: 'Perfil', icon: 'pi pi-plus', command: () => {alert("USER PROFILE")}},
      { label: 'Salir', icon: 'pi pi-sign-out', command: () => {alert("LOGOUT") }}
    ]

    
  
    return (
    <div className="min-h-screen bg-gray-200 flex">
        {/* Sidebar Lateral */}
        <aside className="w-64 bg-white shadow-md">
            <div className="p-4 font-bold text-xl border-b">Mi App</div>
            <nav className="p-2">
                {navigationItems.map((item) => (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        className={`flex items-center p-3 mb-2 rounded-md ${pathname === item.href ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <i className={`${item.icon} mr-2`}></i>
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1">
            <header className="bg-white p-4 shadow-sm flex justify-between items-center">
                <span>Bienvenido, {datos?.name || 'Cargando...'}</span>
                <Menu model={topbarItems} popup ref={userMenuRef} />
                <Button 
                    icon="pi pi-user" 
                    className="p-button-rounded p-button-text" 
                    onClick={(e) => userMenuRef.current?.toggle(e)} 
                />
            </header>
            
            <div className="p-6">
                {children} {/* Aquí se mostrarán las páginas /users, /roles, etc. */}
            </div>
        </main>
    </div> 
  );
}