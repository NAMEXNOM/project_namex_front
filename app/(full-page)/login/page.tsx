'use client';
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

    const ejecutarLogin = async () => {
        if (!userRFC || !password) {
            alert("Por favor ingresa tu RFC y contraseña");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userRFC, password })
            });

            const data = await res.json(); // Se llama una sola vez

            if (res.ok) {
                 // --- AQUÍ PONES LAS DOS LÍNEAS ---
                    //const data = await res.json(); 
                    //console.log("Respuesta de NestJS:", data); 
                // ---------------------------------
                // Sincronizado con tu Payload: 'access_token' y 'user'
                login({ 
                    userName: data.userName,      // Esto pondrá el email/nombre que viene en "user"
                    token: data.access_token,     // Importante: usar guion bajo como en tu payload
                    userBalance: data.userBalance,
                    userId: data.userId
                });
                
                router.push('/'); 
            } else {
                // Manejo de errores de validación de NestJS
                const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
                alert(msg || "Credenciales incorrectas");
            }
        } catch (error) {
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
                <span className="text-600 font-medium">¿No tienes cuenta?</span>
                <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">¡Regístrate!</a>
            </div>
        </div>
    </div>
);

}
