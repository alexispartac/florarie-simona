'use client';

import { TextInput, Button, Group, Notification, Loader, Modal, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useUser } from "../components/context/ContextUser";
import React, { useState, useCallback } from "react";

const URL_UPDATE_USER = "/api/users";

type UserFormValues = {
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    id: string;
    createdAt: string;
    order: number;
};

const UserForm = React.memo(({ form }: { form: ReturnType<typeof useForm<UserFormValues>> }) => {
    const [notification, setNotification] = useState<string | null>(null);
const [loading, setLoading] = useState(false); // Starea pentru loader
    const [modalOpened, setModalOpened] = useState(false); // Starea pentru modal
    const { user, setUser } = useUser();
    const [formValues, setFormValues] = useState<{ name: string; surname: string; email: string; phone: string; address: string; password: string;}>();

    const handleUpdateUser = useCallback(async (formValues: { name: string; surname: string; email: string; phone: string; address: string; password: string; }) => {
        setLoading(true);
        try {
            const response = await axios.put(URL_UPDATE_USER, { id: user.userInfo.id, ...formValues });
            if (response.status === 200) {
                setNotification("Datele au fost actualizate cu succes!");
                setUser((prev) => ({
                    ...prev,
                    userInfo: {
                        ...prev.userInfo,
                        ...formValues,
                    },
                }));
            } else {
                setNotification("A apărut o eroare la actualizarea datelor.");
            }
        } catch (error) {
            console.log("Error updating user data:", error);
            setNotification("A apărut o eroare. Te rugăm să încerci din nou.");
        } finally {
            setLoading(false);
            setModalOpened(false);
            setTimeout(() => setNotification(null), 2000);
        }
    }, [form.values]);

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
                onSubmit={form.onSubmit(({ name, surname, email, phone, address, password }) => {
                    setFormValues({ name, surname, email, phone, address, password });
                    setModalOpened(true); // Deschide modalul la apăsarea butonului
                })}
            >
                <TextInput w={'99%'} label="Nume" {...form.getInputProps("name")} />
                <TextInput w={'99%'} label="Prenume" {...form.getInputProps("surname")} />
                <TextInput w={'99%'} label="Email" type="email" {...form.getInputProps("email")} disabled />
                <TextInput w={'99%'} label="Numar de telefon" placeholder="Ex: 0799999999" type="tel" {...form.getInputProps("phone")} />
                <TextInput w={'99%'} label="Adresa" placeholder="Ex: jud. loc. str. nr." {...form.getInputProps("address")} />
                <PasswordInput w={'99%'} label="Parola" type="password" placeholder="password" {...form.getInputProps("password")} />
                <TextInput w={'99%'} label="User ID" value={form.values.id} disabled />
                <TextInput w={'99%'} label="Data crearii contului" value={form.values.createdAt} disabled />
                <TextInput w={'99%'} label="Numarul de comenzi" value={form.values.order?.toString() || "0"} disabled />
                <Group mt="md">
                    <Button type="submit" color='#b756a6' disabled={loading}>
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
                    <Button variant="default" color='#b756a6' onClick={() => setModalOpened(false)}>
                        Anulează
                    </Button>
                    <Button
                        color="#b756a6"
                        onClick={() => formValues && handleUpdateUser(formValues)}
                        disabled={loading || !formValues}
                    >
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
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        initialValues: {
            name: user.userInfo.name,
            surname: user.userInfo.surname,
            email: user.userInfo.email,
            phone: user.userInfo.phone || "",
            address: user.userInfo.address || "",
            password: user.userInfo.password,
            id: user.userInfo.id,
            createdAt: user.userInfo.createdAt || new Date().toISOString(),
            order: user.userInfo.orders || 0,
        },
        initialErrors: {
            name: '',
            surname: '',
            phone: '',
            address: '',
            password: '',
        },
        validate: {
            name: (value) => {
                if (!value || value.trim() === '') {
                    return 'Numele este obligatoriu!';
                }
                if (value.length < 4) {
                    return 'Numele trebuie să aibă cel puțin 4 caractere!';
                }
                return null;
            },

            surname: (value) => {
                if (!value || value.trim() === '') {
                    return 'Prenumele este obligatoriu!';
                }
                if (value.length < 4) {
                    return 'Prenumele trebuie să aibă cel puțin 4 caractere!';
                }
                return null;
            },

            password: (value) => {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
                if (!passwordRegex.test(value)) {
                    return 'Password must be at least 12 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
                }
                return null;
            },
            phone: (value) => (/^\d+$/.test(value ?? "") ? null : "Număr de telefon invalid"),
            address: (value) => (value && value.trim() !== '' ? null : "Adresa este obligatorie"),
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
            id: user.userInfo.id,
            createdAt: user.userInfo.createdAt,
            order: user.userInfo.orders || 0,
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



