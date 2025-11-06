'use client';
import React, { useState } from 'react';
import { SidebarDemo } from '../components/SideBar';
import { Modal, Button, Group, Select, TextInput, Loader } from '@mantine/core';
import { useUsers } from '@/app/components/hooks/fetchUsers';
import { User } from '@/app/types/user';

interface ClientProps {
    id: string,
    name: string,
    surname: string,
    email: string,
    phone: string,
    address: string,
    orders: number,
    createdAt: string,
}

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
                    <div><b>Nume:</b> {client.name} {client.surname}</div>
                    <div><b>Email:</b> {client.email}</div>
                    <div><b>Telefon:</b> {client.phone}</div>
                    <div><b>Adresă:</b> {client.address}</div>
                </div>
                <Group justify="flex-end" mt="md">
                    <Button onClick={() => setOpened(false)}>Închide</Button>
                </Group>
            </Modal>
            <div className="flex flex-col sm:flex-row justify-between items-center border-b py-2">
                <span className="w-full sm:w-1/4 text-center sm:text-left">{client.name} {client.surname}</span>
                <span className="w-full sm:w-1/4 text-center sm:text-left">{client.email}</span>
                <div className="w-full sm:w-1/4 flex justify-center sm:justify-end">
                    <Button variant="outline" color="blue" onClick={() => setOpened(true)}>
                        Detalii
                    </Button>
                </div>
            </div>
        </>
    );
};

const Page = () => {
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const { data: clients, isLoading, isError } = useUsers();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" size="lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>A apărut o eroare la încărcarea datelor.</p>
            </div>
        );
    }

const filteredClients = clients.filter(( client : User )=>
        `${client.name} ${client.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedClients = [...filteredClients].sort((a, b) => {
        let aValue: number | string = '';
        let bValue: number | string = '';
        if (sortBy === 'createdAt') {
            aValue = a.createdAt;
            bValue = b.createdAt;
        } else if (sortBy === 'orders') {
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
                <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="text-center py-4 bg-gray-100 dark:bg-neutral-800 rounded-lg">
                        <h1 className="text-lg font-bold">CONTURI DE UTILIZATORI</h1>
                        <p>NUMAR DE CLIENTI: {clients.length} </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-2">
                        <TextInput
                            label="Caută după nume"
                            placeholder="Ex: Ion Popescu"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-48"
                        />
                        <Select
                            label="Sortează după"
                            data={sortOptions}
                            value={sortBy}
                            onChange={value => setSortBy(value || 'createdAt')}
                            className="w-full sm:w-48"
                        />
                        <Select
                            label="Ordine"
                            data={orderOptions}
                            value={order}
                            onChange={value => setOrder((value as 'asc' | 'desc') || 'desc')}
                            className="w-full sm:w-48"
                        />
                    </div>
                    <div className="hidden sm:flex flex-row justify-between font-bold border-b py-2 mt-6">
                        <span className="w-1/4">Nume</span>
                        <span className="w-1/4">Prenume</span>
                        <span className="w-1/4">Email</span>
                        <span className="w-1/4 text-right">Acțiuni</span>
                    </div>
                    <div className="flex flex-col overflow-y-auto h-[calc(100vh-400px)]">
                        {sortedClients.map(client => (
                            <ClientRow key={client.id} client={client} />
                        ))}
                    </div>
                </div>
            </div>
        </SidebarDemo>
    );
};

export default Page;