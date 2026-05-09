import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import Image from "next/image";
import Link from "next/link";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Password } from "primereact/password";
import { Children, useState } from "react";
import { Divider } from 'primereact/divider';
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; // El contexto que crearemos


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    
    
    const router = useRouter();
    const { login } = useAuth(); // Función para guardar el usuario globalmente

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Si el backend responde bien, guardamos datos y redirigimos
                login({ nombre: data.userName, token: data.token });
                router.push('/'); // Vamos al Home
            } else {
                alert(data.message || "Error al entrar");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        } finally {
            setLoading(false);
        }
    };


  return (
    

// ... dentro del return del componente anterior
<div className="surface-ground flex align-items-center justify-content-center min-h-screen">
    <div className="surface-card p-6 shadow-2 border-round-xl w-full ">
        <div className="text-center mb-5">
            <img src="/namex.png" alt="logo" height="15" className="mb-3" />
            <div className="text-900 text-3xl font-medium mb-3">Portal Consultas Bienvenido</div>
            
            
        </div>

        <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
            <InputText id="email" type="text" className="w-full mb-3 p-inputtext-lg" />

            <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
            <Password id="password" toggleMask className="w-full mb-3" inputClassName="w-full p-3" />

            <div className="flex align-items-center justify-content-between mb-6">
                <div className="flex align-items-center">
                    <input id="remember" type="checkbox" className="mr-2" />
                    <label htmlFor="remember">Recuérdame</label>
                </div>
                
            </div>

            <Button label="Entrar" icon="pi pi-sign-in" className="w-full p-3 text-xl" />
        </div>
        
        <Divider align="center" className="my-4">
            <span className="text-600 font-normal text-sm"></span>
        </Divider>

        <span className="text-600 font-medium line-height-3">¿No tienes cuenta?</span>
        <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">¡Regístrate!</a>
                
        

        <Divider align="center" className="my-4">
            <span className="text-600 font-normal text-sm"></span>
        </Divider>

        <a className="font-medium no-underline text-blue-500 text-right cursor-pointer">¿Olvidaste tu clave?</a>
    </div>
</div>
 
  );
}