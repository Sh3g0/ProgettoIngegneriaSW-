'use client';
import { useJwtPayload } from '@/components/useJwtPayload';
import NotificheClienteComponent from '@/components/notificheClienteComponent';
import Banner from '@/components/Banner';

export default function NotificheCliente() {
    const userInfo = useJwtPayload();

    if (!userInfo) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-gray-600">Caricamento dati utente...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gray-50 px-4 py-6 lg:px-12">
            {/* Banner in alto */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Banner />
            </div>

            {/* Spazio sotto al banner */}
            <div className="pt-24">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Le tue prenotazioni confermate</h1>

                <NotificheClienteComponent idCliente={Number(userInfo.id)} />
            </div>
        </div>
    );
}