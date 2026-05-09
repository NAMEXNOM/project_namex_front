'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Password } from "primereact/password";
import { useEffect, useRef, useState } from "react";

import { Divider } from 'primereact/divider';

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
     <div className="surface-ground flex align-items-center justify-content-center min-h-screen">
        {/* Sidebar Lateral */}
        {/*<aside className="w-64 bg-white shadow-md">
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
        </aside>*/}


        <div className="surface-card p-6 shadow-2 border-round-xl w-full" style={{ maxWidth: '450px' }}>
                <div className="text-center mb-5">
                    <img src="/namex.png" alt="logo" height="50" className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Bienvenido</div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                    <InputText 
                        id="email" 
                    
                        className="w-full mb-3 p-inputtext-lg" 
                    />

                    <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
                    <Password 
                        id="password" 
                    
                        toggleMask 
                        feedback={false}
                        className="w-full mb-3" 
                        inputClassName="w-full p-3" 
                    />

                    <Button 
                        label="Entrar" 
                        icon="pi pi-sign-in" 
                   
                        className="w-full p-3 text-xl" 
                    />
                </div>

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
    </div>
  );
}