'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAuth } from '../../../context/AuthContext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Vacation } from '../../../types/auth';

export default function VacationsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.token) {
            fetchVacations();
        }
    }, [user]);

    const fetchVacations = async () => {
        try {
            const response = await fetch('http://localhost:5000/vacations/mis-vacaciones', {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setVacations(data);
            }
        } catch (error) {
            console.error("Error al obtener vacaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="surface-card p-1 md:p-3 shadow-2 border-round-xl">
    <DataTable 
        value={vacations} 
        size="small" 
        className="text-xs" // Texto pequeño general
        tableStyle={{ minWidth: '100%' }}
    >
        {/* Periodo: Corto */}
        <Column field="period" header="Per." style={{ width: '15%' }} />

        {/* Tipo: Truncado si es largo */}
        <Column 
            field="recordType" 
            header="Tipo" 
            style={{ width: '25%' }}
            body={(rowData) => {
            // Lógica de conversión
            if (rowData.recordType === 1 || rowData.recordType === "1") {
              return <span className="text-green-600 font-semibold">Abonadas</span>;
              } else if (rowData.recordType === 2 || rowData.recordType === "2") {
              return <span className="text-orange-600 font-semibold">Tomadas</span>;
              }
              // Valor por defecto por si llega algo distinto
            return <span>{rowData.recordType}</span>;
            }}
        />

        {/* Fechas: Formato extra corto dd/mm/aa */}
        <Column 
            header="Inicio" 
            style={{ width: '22%' }}
            body={(rowData) => new Date(rowData.fechaInicio).toLocaleDateString('es-MX', {day:'2-digit', month:'2-digit', year:'2-digit'})}
        />
        
        <Column 
            header="Fin" 
            style={{ width: '22%' }}
            body={(rowData) => new Date(rowData.fechaFinal).toLocaleDateString('es-MX', {day:'2-digit', month:'2-digit', year:'2-digit'})}
        />

        {/* NUEVO CAMPO: Días (En negrita para resaltar) */}
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
