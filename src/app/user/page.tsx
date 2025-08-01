'use client';

import { TextInput, Button, Group, Notification, Avatar, Loader, Modal, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useUser } from "../components/context/ContextUser";
import React, { useState, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../components/lib/firebase"; // Importă configurația Firebase

const URL_UPDATE_USER = "/api/users";

type UserFormValues = {
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    avatar?: string;
    id: string;
    createdAt: string;
    order: number;
};

// Funcția pentru încărcarea imaginii în Firebase Storage
const uploadImageToFirebase = async (file: File, email: string): Promise<string> => {
    const storageRef = ref(storage, `image/avatars/${email}`); // Creează un path unic pentru imagine
    await uploadBytes(storageRef, file); // Încarcă imaginea în Firebase Storage
    const downloadURL = await getDownloadURL(storageRef); // Obține URL-ul imaginii
    return downloadURL;
};

// Funcția pentru ștergerea imaginii din Firebase Storage
const deleteImageFromFirebase = async (imagePath: string): Promise<void> => {
    try {
        const imageRef = ref(storage, imagePath); // Creează referința către imaginea din Firebase Storage
        await deleteObject(imageRef); // Șterge imaginea
        console.log(`Imaginea ${imagePath} a fost ștearsă cu succes din Firebase Storage.`);
    } catch (error) {
        console.log(`Eroare la ștergerea imaginii ${imagePath}:`, error);
    }
};

const UserForm = React.memo(({ form }: { form: ReturnType<typeof useForm<UserFormValues>> }) => {
    const [notification, setNotification] = useState<string | null>(null);
    const [addImage, setAddImage] = useState<boolean>(false); // Starea pentru încărcarea imaginii
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

    const handleAvatarChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLoading(true);
            setAddImage(true)
            try {
                const imageUrl = await uploadImageToFirebase(file, user.userInfo.email); // Încarcă imaginea în Firebase Storage
                setAddImage(false);
                form.setFieldValue("avatar", imageUrl); // Salvează URL-ul imaginii
            } catch (error) {
                console.log("Eroare la încărcarea avatarului:", error);
            } finally {
                setLoading(false);
            }
        }
    }, [form]);

    const handleDeleteAvatar = useCallback(async (imagePath: string) => {
        if (form.values.avatar) {
            setLoading(true);
            try {
                await deleteImageFromFirebase(imagePath); // Șterge imaginea din Firebase Storage
                form.setFieldValue("avatar", ""); // Elimină URL-ul imaginii din starea locală
            } catch (error) {
                console.log("Eroare la ștergerea avatarului:", error);
            } finally {
                setLoading(false);
            }
        }
    }, [form]);

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
                    <span className="text-[#b756a6]">Schimbă avatar</span>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                    id="avatar-upload"
                />
                {form.values.avatar && (
                    <Button
                        variant="filled"
                        color='#b756a6'
                        onClick={() => handleDeleteAvatar(form.values.avatar as string)}
                        disabled={loading}
                        size="xs"
                        className="m-2 block"
                    >
                        {loading && <Loader size="xs" color="white" />}
                        {!loading && (user.userInfo.avatar || form.values.avatar) && "Șterge avatar"}
                    </Button>
                )}
                {
                    !form.values.avatar && addImage && (
                        <Loader size="xs" mx={5} color="blue" className="mt-2" />
                    )
                }
                <TextInput w={'99%'} label="Last Name" {...form.getInputProps("name")} />
                <TextInput w={'99%'} label="First Name" {...form.getInputProps("surname")} />
                <TextInput w={'99%'} label="Email" type="email" {...form.getInputProps("email")} disabled />
                <TextInput w={'99%'} label="Phone" placeholder="Ex: 0799999999" type="tel" {...form.getInputProps("phone")} />
                <TextInput w={'99%'} label="Address" placeholder="Ex: jud. loc. str. nr." {...form.getInputProps("address")} />
                <PasswordInput w={'99%'} label="Password" type="password" placeholder="password" {...form.getInputProps("password")} />
                <TextInput w={'99%'} label="User ID" value={form.values.id} disabled />
                <TextInput w={'99%'} label="Account Creation Date" value={form.values.createdAt} disabled />
                <TextInput w={'99%'} label="Number of Orders" value={form.values.order?.toString() || "0"} disabled />
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
            avatar: user.userInfo.avatar,
            id: user.userInfo.id,
            createdAt: user.userInfo.createdAt || new Date().toISOString(),
            order: user.userInfo.order || 0,
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



