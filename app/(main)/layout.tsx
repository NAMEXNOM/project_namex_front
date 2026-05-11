'use client'
import MainLayout from '../../components/MainLayout'; // Ajusta los puntos según tu carpeta

export default function LayoutPrivado({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}
