'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Ajusta la ruta a tu AuthContext
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function MisVacacionesPage() {
    const { user } = useAuth(); // Obtenemos el usuario logueado del contexto global
    const [vacations, setVacations] = useState<any[]>([]); // Tipado básico para el estado
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Obtenemos el userId y el token desde el contexto o el almacenamiento local
    const userId = user?.userId || localStorage.getItem('userId');
    const token = user?.token || localStorage.getItem('token');

    // 🚨 Bloqueo de seguridad: Si no hay credenciales, esperamos a que cargue el contexto
    if (!userId || !token) {
        console.warn("Esperando el userId y el token de autenticación...");
        setLoading(false);
        return;
    }

    const cargarVacaciones = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/vacations/user?userId=${userId}`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Vacaciones del usuario cargadas con éxito:", data);
                setVacations(data);
            } else {
                console.error("Error al responder el servidor. Estatus:", res.status);
            }
        } catch (error) {
            console.error("Error de conexión con el backend:", error);
        } finally {
            setLoading(false);
        }
    };

    cargarVacaciones();
    // 🔄 SOLUCIÓN: Eliminamos 'user' global y dejamos un tamaño fijo de 2 elementos primitivos
    }, [user?.userId, user?.token]); 

    // 🎨 Formateador visual sin marcar errores en TypeScript (tipo: any)
    const tipoRegistroTemplate = (rowData: any) => {
        if (rowData.recordType === 1 || rowData.recordType === "1") {
            return <span className="text-green-600 font-semibold">Abonadas</span>;
        } else if (rowData.recordType === 2 || rowData.recordType === "2") {
            return <span className="text-orange-600 font-semibold">Tomadas</span>;
        }
        return <span>{rowData.recordType}</span>;
    };

    return (
        <div className="surface-card p-1 md:p-3 shadow-2 border-round-xl">
            <DataTable 
                value={vacations} 
                loading={loading}
                size="small" 
                className="text-xs"
                tableStyle={{ minWidth: '100%' }}
            >
                <Column field="period" header="Per." style={{ width: '15%' }} />
                
                <Column 
                    field="recordType" 
                    header="Tipo" 
                    style={{ width: '25%' }}
                    body={tipoRegistroTemplate} // 👈 Vinculación directa de tu plantilla corregida
                />

                <Column 
                    header="Inicio" 
                    style={{ width: '22%' }}
                    body={(rowData: any) => new Date(rowData.fechaInicio).toLocaleDateString('es-MX', {day:'2-digit', month:'2-digit', year:'2-digit'})}
                />
                
                <Column 
                    header="Fin" 
                    style={{ width: '22%' }}
                    body={(rowData: any) => new Date(rowData.fechaFinal).toLocaleDateString('es-MX', {day:'2-digit', month:'2-digit', year:'2-digit'})}
                />

                <Column 
                    field="vacationDays" 
                    header="Días" 
                    style={{ width: '16%' }}
                    bodyStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                    headerStyle={{ textAlign: 'center' }}
                />
            </DataTable>
        </div>
    );
}
