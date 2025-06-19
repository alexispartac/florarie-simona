'use client';

import { TextInput, Button, Group, Notification, Avatar } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useUser } from "../components/ContextUser";
import { useState } from "react";

const URL_UPDATE_USER = "/api/users";

const UserPage = () => {
    const [notification, setNotification] = useState<string | null>(null);
    const { user } = useUser();
    console.log(user)
    const form = useForm({
        initialValues: {
            name: user.userInfo.name ?? "",
            surname: user.userInfo.surname ?? "",
            email: user.userInfo.email ?? "",
            phone: user.userInfo.phone ?? "",
            address: user.userInfo.address ?? "",
            password: user.userInfo.password ?? "",
            avatar: user.userInfo.avatar ?? "",
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email invalid"),
            phone: (value) => (/^\d+$/.test(value) ? null : "Număr de telefon invalid"),
        },
    });


    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.put(URL_UPDATE_USER, form.values);
            if (response.status === 200) {
                setNotification("Datele au fost actualizate cu succes!");
            } else {
                setNotification("A apărut o eroare la actualizarea datelor.");
            }
        } catch (error) {
            console.error("Error updating user data:", error);
            setNotification("A apărut o eroare. Te rugăm să încerci din nou.");
        }
    };

    return (
        <div className="my-30" style={{ maxWidth: 600, padding: "20px" }}>
            <h1 className="text-3xl font-bold py-5">Contul tău de utilizator</h1>
            <form onSubmit={handleUpdateUser}>
                <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
                    {
                        !form.values.avatar ? (
                            <Avatar size={50} radius="xl" alt={`${user.userInfo.name} ${user.userInfo.surname}`} />
                        ) : (
                            <Avatar
                                src={form.values.avatar}
                                alt="Avatar"
                                className="w-24 h-24 mb-4"
                            />
                        )
                    }
                    <span className="text-blue-500">Schimbă avatar</span>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                form.setFieldValue("avatar", reader.result as string);
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                    style={{ display: "none" }}
                    id="avatar-upload"
                />
                <TextInput
                    w={'99%'}
                    label="Nume"
                    value={user.userInfo.name}
                    {...form.getInputProps("name")}
                />
                <TextInput
                    w={'99%'}
                    label="Prenume"
                    value={user.userInfo.surname}
                    {...form.getInputProps("surname")}
                />
                <TextInput
                    w={'99%'}
                    label="Email"
                    type="email"
                    value={user.userInfo.email}
                    {...form.getInputProps("email")}
                />
                <TextInput
                    w={'99%'}
                    label="Telefon"
                    type="tel"
                    value={user.userInfo.phone}
                    {...form.getInputProps("phone")}
                />
                <TextInput
                    w={'99%'}
                    label="Adresa"
                    value={user.userInfo.address}
                    {...form.getInputProps("address")}
                />
                <TextInput
                    w={'99%'}
                    label="Parolă"
                    type="password"
                    {...form.getInputProps("password")}
                />
                <TextInput
                    w={'99%'}
                    label="ID Utilizator"
                    value={user.userInfo.id}
                    disabled
                />
                <TextInput
                    w={'99%'}
                    label="Data creării contului"
                    value={user.userInfo.createdAt}
                    disabled
                />
                <TextInput
                    w={'99%'}
                    label="Număr de comenzi"
                    value={ user.userInfo.order && user.userInfo.order.toString() || "0"}
                    disabled
                />
                <Group mt="md">
                    <Button type="submit" color="blue">
                        Actualizează datele
                    </Button>
                </Group>
            </form>
            {notification && (
                <Notification
                    color="green"
                    onClose={() => setNotification(null)}
                    className="mt-4"
                >
                    {notification}
                </Notification>
            )}
        </div>
    );
};

export default UserPage;

