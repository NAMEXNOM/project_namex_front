'use client';
import { API_URL } from '../../../utils/api'; // Ajusta la ruta según dónde lo guardaste

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext'; 
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { LoginResponse } from '../../../types/auth';


export default function LoginPage() {
    const [userRFC, setUserRFC] = useState(''); // Sincronizado con el nombre de la variable
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const router = useRouter();




const ejecutarLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!userRFC || !password) {
        alert("Por favor ingresa tu RFC y contraseña");
        return;
    }

    setLoading(true);
    try {
        //const res = await fetch('http://localhost:5000/auth/login', {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userRFC, password })
        });

        const data = await res.json(); 

        // 1. Verificación estricta del Estatus de Red y del objeto de NestJS
        //if (!res.ok || data.status === 404 || data.status === 401 || data.name === 'HttpException') {
        if (!res.ok || data.name === 'HttpException') {
            const msg = data.message || "Credenciales incorrectas";
            alert(Array.isArray(msg) ? msg.join(', ') : msg);
            
            setLoading(false);
            return; 
        }

        // 2. Si el código llega aquí, significa que la respuesta fue exitosa
        

        login({ 
            userName: data.userName,      
            token: data.access_token,     
            userBalance: data.userBalance,
            userId: data.userId
        });

        // 🟢 NUEVO: Guardar banderas en una Cookie para que el Middleware las lea en el servidor
        document.cookie = `namex_session=${JSON.stringify({
            userId: data.userId,
            firstTimeLoad: data.firstTimeLoad,
            status: data.status
        })}; path=/; max-age=86400; SameSite=Strict; Secure`;

        // 🚨 Forzamos a Next.js a refrescar los estados internos de ruta
        router.refresh();
        
        // 🚨 REDIRECCIÓN INTELIGENTE
        if (data.firstTimeLoad === true || data.status === 'TEMPORAL') {
        //    console.log("🔄 Redirigiendo a cambio de contraseña obligatorio...");
            router.push('/change-password'); 
        } else {
        //    console.log("➡️ Redirigiendo al Dashboard principal...");
            router.push('/'); 
        }
        

    } catch (error) {
        console.error("🚨 Error crítico de red o código en el Frontend:", error);
        alert("Error de conexión con el servidor. Verifica que el Backend esté encendido.");
    } finally {
        setLoading(false);
    }
};

    return (
    /* Contenedor principal: ocupa todo el ancho y alto, y centra el contenido */
    <div className="surface-ground flex align-items-center justify-content-center min-h-screen p-3">
        
        {/* Tarjeta del Login: le ponemos un ancho máximo para que no se estire en PC */}
        <div className="surface-card p-6 shadow-2 border-round-xl w-full" style={{ maxWidth: '400px' }}>
            
            <div className="text-center mb-5">
                <img src="/namex.png" alt="logo" height="50" className="mb-3" />
                <div className="text-900 text-3xl font-medium mb-3">Bienvenido</div>
            </div>

            <div className="flex flex-column gap-3">
                <div>
                    <label htmlFor="userRFC" className="block text-900 font-medium mb-2">RFC de Usuario</label>
                    <InputText 
                        id="userRFC" 
                        value={userRFC} 
                        onChange={(e) => setUserRFC(e.target.value.toUpperCase())} 
                        className="w-full p-inputtext-lg" 
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
                    <Password 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        toggleMask 
                        feedback={false}
                        className="w-full" 
                        inputClassName="w-full p-3" 
                    />
                </div>

                <Button 
                    label="Entrar" 
                    icon="pi pi-sign-in" 
                    className="w-full p-3 text-xl mt-2" 
                    loading={loading}
                    onClick={ejecutarLogin} 
                />
            </div>
            
            <Divider align="center" className="my-4" />

            <div className="text-center">
                <a onClick={() => router.push('/recover')} className="font-medium no-underline text-blue-500 cursor-pointer">
                    ¿Olvidaste tu contraseña o es tu primer ingreso? Haz clic aquí
                </a>
            </div>
        </div>
    </div>
);

}