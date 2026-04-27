'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useRef } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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

    const theme = 'dark'
  
    return (
    <div className="min-h-screen bg-gray-200" >
      <div className="flex">
        {/*Sidebar*/}
        <div className="lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white shadow-lg border-r border-gray-200 ">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-lg font-bold text-gr ">Módulo NAMEX</h1>
          </div>
          <nav className="flex-1 mt-6 px-3">
            <div className="space-y-1">
              {navigationItems.map((item)=>{
                const isActive = pathname === item.href;
                return (
                  <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-r-2 borderblue-700'
                      :'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <i className={`${item.icon} mr-3`}></i>
                    <span>{item.name}</span>
                  </Link>
                )

              })}
            </div>

          </nav>
        </div>
        <div className="flex-1 lg:ml-64">
          {/*Top bar*/}
          <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
            <div className="flex-1 lg:flex-none">
              <h1 className="text-lg font-semibold text-gray-800"> Aplicación</h1>
            </div>
            <div className="flex items-center">
              <Button icon="pi pi-bell"></Button>
              
              <div>
                <Button icon="pi pi-info" onClick={(e)=>userMenuRef.current?.toggle(e)}></Button>
                <Menu model={topbarItems} popup ref={userMenuRef} className=""></Menu>
              </div>
            </div>
          </header>
          {/*Maincontent*/}
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </div>
    </div> 
  );
}