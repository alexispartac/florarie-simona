'use client';
import React, { useEffect, useState } from 'react'
import { SidebarDemo } from '../components/SideBar'
import { Modal, Button, Group, Select } from '@mantine/core'
import { ClientProps } from '../types';

const sortOptions = [
    { value: 'createdAt', label: 'Data creare' },
    { value: 'orders', label: 'Număr comenzi' },
];

const orderOptions = [
    { value: 'asc', label: 'Crescător' },
    { value: 'desc', label: 'Descrescător' },
];

const ClientRow = ({ client }: { client: ClientProps }) => {
    const [opened, setOpened] = useState(false);

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={`Detalii client: ${client.name} ${client.surname}`}
                centered
            >
                <div className="flex flex-col gap-2">
                    <div><b>Creat:</b> {client.createdAt}</div>
                    <div><b>Nume:</b> {client.name}</div>
                    <div><b>Prenume:</b> {client.surname}</div>
                    <div><b>Email:</b> {client.email}</div>
                    <div><b>Telefon:</b> {client.phone}</div>
                    <div><b>Adresă:</b> {client.address}</div>
                    <div><b>Număr comenzi:</b> {client.orders}</div>
                </div>
                <Group justify="flex-end" mt="md">
                    <Button onClick={() => setOpened(false)}>Închide</Button>
                </Group>
            </Modal>
            <div className="flex flex-row justify-between items-center border-b py-2">
                <span className="w-1/4">{client.name}</span>
                <span className="w-1/4">{client.surname}</span>
                <span className="w-1/4">{client.email}</span>
                <div className="w-1/4 flex justify-end">
                    <Button variant="outline" color="blue" onClick={() => setOpened(true)}>
                        Detalii
                    </Button>
                </div>
            </div>
        </>
    );
};

const URL_USERS = '/api/users';
const Page = () => {
    const [clients, setClients] = useState<ClientProps[]>([]);
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        // Fetch clients from API
        const fetchClients = async () => {
            const response = await fetch(URL_USERS);
            const data = await response.json();
            setClients(data);
        };
        fetchClients();
    }, []);

    // Sortare clienți după opțiuni
    const sortedClients = [...clients].sort((a, b) => {
        let aValue: number | string = '';
        let bValue: number | string = '';
        if (sortBy === 'createdAt') {
            aValue = a.createdAt;
            bValue = b.createdAt;
        } else if (sortBy === 'orders') {
            // Dacă orders e number sau array
            aValue = Array.isArray(a.orders) ? a.orders.length : a.orders;
            bValue = Array.isArray(b.orders) ? b.orders.length : b.orders;
        }
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <SidebarDemo>
            <div className="flex flex-1">
                <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex gap-2">
                        <div
                            className="h-20 w-full text-center py-7 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
                        >
                            <h1>CONTURI DE UTILIZATORI</h1>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-4 mb-2">
                        <Select
                            label="Sortează după"
                            data={sortOptions}
                            value={sortBy}
                            onChange={value => setSortBy(value || 'createdAt')}
                            className="w-48"
                        />
                        <Select
                            label="Ordine"
                            data={orderOptions}
                            value={order}
                            onChange={value => setOrder((value as 'asc' | 'desc') || 'desc')}
                            className="w-48"
                        />
                    </div>
                    <div className="flex flex-row justify-between font-bold border-b py-2 mt-6">
                        <span className="w-1/4">Nume</span>
                        <span className="w-1/4">Prenume</span>
                        <span className="w-1/4">Email</span>
                        <span className="w-1/4 text-right">Acțiuni</span>
                    </div>
                    <div className="flex flex-col">
                        {sortedClients.map(client => (
                            <ClientRow key={client.id} client={client} />
                        ))}
                    </div>
                </div>
            </div>
        </SidebarDemo>
    )
}

export default Page