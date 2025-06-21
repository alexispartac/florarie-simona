'use client';

import { TextInput, Button, Group, Notification, Avatar, Loader, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useUser } from "../components/ContextUser";
import React, { useState, useCallback } from "react";

const URL_UPDATE_USER = "/api/users";

type UserFormValues = {
    name: string;
    surname: string;
    email: string;
    phone?: string;
    address?: string;
    password: string;
    avatar?: string;
    id: string;
    createdAt?: string;
    order: number;
};

const UserForm = React.memo(({ form }: { form: ReturnType<typeof useForm<UserFormValues>> }) => {
    const [notification, setNotification] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // Starea pentru loader
    const [modalOpened, setModalOpened] = useState(false); // Starea pentru modal
    const { setUser } = useUser();

    const handleUpdateUser = useCallback(async () => {
        setLoading(true); // Activează loader-ul
        try {
            const response = await axios.put(URL_UPDATE_USER, form.values);
            if (response.status === 200) {
                setNotification("Datele au fost actualizate cu succes!");
                setUser((prev) => ({
                    ...prev,
                    userInfo: {
                        ...prev.userInfo,
                        ...form.values,
                    },
                }));
            } else {
                setNotification("A apărut o eroare la actualizarea datelor.");
            }
        } catch (error) {
            console.error("Error updating user data:", error);
            setNotification("A apărut o eroare. Te rugăm să încerci din nou.");
        } finally {
            setLoading(false); 
            setModalOpened(false); 
            setTimeout(() => setNotification(null), 2000);
        }
    }, [form.values]);

    const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                form.setFieldValue("avatar", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    return (
        <>
            {notification && (
                <Notification
                    color="green"
                    onClose={() => setNotification(null)}
                    className="mt-4"
                    style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}
                >
                    {notification}
                </Notification>
            )}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setModalOpened(true); // Deschide modalul la apăsarea butonului
                }}
            >
                <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
                    {!form.values.avatar ? (
                        <Avatar size={50} radius="xl" alt={`${form.values.name} ${form.values.surname}`} />
                    ) : (
                        <Avatar
                            src={form.values.avatar}
                            alt="Avatar"
                            className="w-24 h-24 mb-4"
                        />
                    )}
                    <span className="text-blue-500">Schimbă avatar</span>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                    id="avatar-upload"
                />
                <TextInput w={'99%'} label="Nume" {...form.getInputProps("name")} />
                <TextInput w={'99%'} label="Prenume" {...form.getInputProps("surname")} />
                <TextInput w={'99%'} label="Email" type="email" {...form.getInputProps("email")} disabled />
                <TextInput w={'99%'} label="Telefon" placeholder="Ex: 0799999999" type="tel" {...form.getInputProps("phone")} />
                <TextInput w={'99%'} label="Adresa" placeholder="Ex: jud. loc. str. nr." {...form.getInputProps("address")} />
                <TextInput w={'99%'} label="Parolă" type="password" placeholder="*********" {...form.getInputProps("password")} />
                <TextInput w={'99%'} label="ID Utilizator" value={form.values.id} disabled />
                <TextInput w={'99%'} label="Data creării contului" value={form.values.createdAt} disabled />
                <TextInput w={'99%'} label="Număr de comenzi" value={form.values.order?.toString() || "0"} disabled />
                <Group mt="md">
                    <Button type="submit" color="blue" disabled={loading}>
                        {loading ? <Loader size="xs" color="white" /> : "Actualizează datele"}
                    </Button>
                </Group>
            </form>

            {/* Modal de confirmare */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Confirmare modificare date"
                centered
            >
                <p>Ești sigur că dorești să modifici datele?</p>
                <Group mt="md">
                    <Button variant="default" onClick={() => setModalOpened(false)}>
                        Anulează
                    </Button>
                    <Button color="blue" onClick={handleUpdateUser} disabled={loading}>
                        {loading ? <Loader size="xs" color="white" /> : "Confirmă"}
                    </Button>
                </Group>
            </Modal>
        </>
    );
});

UserForm.displayName = "UserForm";

const UserPage = () => {
    const { user } = useUser();
    const form = useForm<UserFormValues>({
        initialValues: {
            name: user.userInfo.name,
            surname: user.userInfo.surname,
            email: user.userInfo.email,
            phone: user.userInfo.phone,
            address: user.userInfo.address,
            password: user.userInfo.password,
            avatar: user.userInfo.avatar,
            id: user.userInfo.id,
            createdAt: user.userInfo.createdAt,
            order: user.userInfo.order || 0,
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email invalid"),
            phone: (value) => (/^\d+$/.test(value ?? "") ? null : "Număr de telefon invalid"),
        },
    });

    React.useEffect(() => {
        form.setValues({
            name: user.userInfo.name,
            surname: user.userInfo.surname,
            email: user.userInfo.email,
            phone: user.userInfo.phone,
            address: user.userInfo.address,
            password: user.userInfo.password,
            avatar: user.userInfo.avatar,
            id: user.userInfo.id,
            createdAt: user.userInfo.createdAt,
            order: user.userInfo.order || 0,
        });
    }, [user]);

    if (!user.userInfo.name) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" size="lg" />
            </div>
        );
    }

    return (
        <div className="my-30 mx-auto" style={{ maxWidth: 600, padding: "20px" }}>
            <h1 className="text-3xl font-bold py-5">Contul tău de utilizator</h1>
            <UserForm form={form} />
        </div>
    );
};

export default UserPage;



