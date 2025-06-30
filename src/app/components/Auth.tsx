'use client';
import { Modal, Button, TextInput, Group, Checkbox, Anchor, Loader, Avatar } from '@mantine/core';
import { IconAt, IconFlower, IconShoppingCart, IconUser } from "@tabler/icons-react";
import React, { useCallback, useState, useMemo } from "react";
import { ForgotPasswordModal } from "./ForgotPassword";
import { NavbarButton } from "./ui/resizable-navbar";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useCookies } from "react-cookie";
import { useUser } from "./ContextUser";
import { v4 as uuidv4 } from 'uuid';
import Link from "next/link";
import axios from "axios";

const URL_LOGIN = "/api/users/login";
const URL_SIGN = "/api/users";

export const useHandleLogout = () => {
    const [, setCookie] = useCookies(['login']);
    const { setUser } = useUser();

    const logout = useCallback(() => {
        setCookie('login', '', { path: '/', maxAge: -1 });
        setUser({
            userInfo: {
                id: '',
                name: '',
                surname: '',
                email: '',
                password: '',
                phone: '',
                address: '',
                order: 0,
                createdAt: '',
                avatar: '',
            },
            isAuthenticated: false,
        });
    }, [setUser, setCookie]);

    return logout;
};

export const AuthModal = React.memo(() => {
    const [opened, { open, close }] = useDisclosure(false);
    const [check, setCheck] = useState(false);
    const [, setCookie] = useCookies(['login']);
    const { user, setUser } = useUser();
    const [typeAuth, setTypeAuth] = useState<'login' | 'signin'>('login');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successModalOpened, setSuccessModalOpened] = useState(false); // Modal pentru mesajul de succes
    const [successMessage, setSuccessMessage] = useState<string>(''); // Mesajul de succes
    const logout = useHandleLogout();

    const formSignUp = useForm({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const formLogIn = useForm({
        initialValues: {
            email: '',
            password: '',
        },
    });

    const login = useCallback(async (data: { email: string; password: string }) => {
        if (user.isAuthenticated) return;
        if (!data.email || !data.password) {
            setLoginError("Email și parola sunt obligatorii.");
            return;
        }
        setLoginError(null);
        setLoading(true);
        try {
            const response = await axios.post(URL_LOGIN, data);
            if (response.status === 200) {
                setUser({
                    userInfo: response.data.user,
                    isAuthenticated: true,
                });
                setCookie('login', response.data.token, { path: '/' });
                setSuccessMessage('Autentificare reușită! Bine ai venit!');
                setSuccessModalOpened(true); // Deschide modalul de succes
                close();
            }
        } catch (error) {
            console.log('Error logging in', error);
            setLoginError("Eroare la autentificare.");
        } finally {
            setLoading(false);
        }
    }, [setUser, setCookie, close, user.isAuthenticated]);

    const signup = useCallback(async (data: { id: string; name: string; surname: string; email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await axios.post(URL_SIGN, data);
            if (response.status === 200 || response.status === 201) {
                login({ email: data.email, password: data.password });
                formSignUp.reset();
                setSuccessMessage('Înregistrare reușită! Bine ai venit!');
                setSuccessModalOpened(true); // Deschide modalul de succes
                close();
            }
        } catch (error) {
            console.log('Error signing up', error);
            setLoginError("Eroare la înregistrare.");
        } finally {
            setLoading(false);
        }
    }, [login, close, formSignUp]);

    const handleSignUp = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        setLoginError(null);
        const { name, surname, email, password, confirmPassword } = formSignUp.values;
        if (password !== confirmPassword) {
            setLoginError("Parolele nu coincid!");
            return;
        }
        signup({ id: uuidv4(), name, surname, email, password });
    }, [signup, formSignUp]);

    const handleLogin = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        setLoginError(null);
        const { email, password } = formLogIn.values;
        login({ email, password });
        formLogIn.reset();
    }, [login, formLogIn]);

    const renderForm = useMemo(() => {
        if (!user.isAuthenticated && typeAuth === 'signin') {
            return (
                <form className="flex flex-col gap-4 my-5" onSubmit={handleSignUp}>
                    <Group>
                        <TextInput autoFocus={false} w={'47%'} label='Nume' required placeholder="Ex: Partac" {...formSignUp.getInputProps('name')} />
                        <TextInput autoFocus={false} w={'47%'} label='Prenume' required placeholder="Ex: Alexis" {...formSignUp.getInputProps('surname')} />
                    </Group>
                    <TextInput autoFocus={false} w={'99%'} leftSection={<IconAt size={16} />} type="email" label='Email' required placeholder="Ex: matei.partac45@gmail.com" {...formSignUp.getInputProps('email')} />
                    <TextInput autoFocus={false} w={'99%'} label='Parola' required placeholder="Parola" type="password" autoComplete="off" {...formSignUp.getInputProps('password')} />
                    <TextInput autoFocus={false} w={'99%'} label='Confirmare parola' required placeholder="Parola" type="password" autoComplete="off" {...formSignUp.getInputProps('confirmPassword')} />
                    <Checkbox c={"#b756a6"} color={"#b756a6"} label="Sunt de-acord cu termenii si conditiile" checked={check} onChange={(event) => setCheck(event.currentTarget.checked)} />
                    {loginError && <div style={{ color: 'red', fontSize: 14, marginBottom: 8 }}>{loginError}</div>}
                    <Group justify="space-between">
                        <Anchor c={"#b756a6"} onClick={() => setTypeAuth('login')} size="xs">Ai deja un cont? Login</Anchor>
                        <Button type="submit" variant='filled' color='#b756a6' disabled={loading || !check}>Sign in</Button>
                    </Group>
                </form>
            );
        } else if (!user.isAuthenticated && typeAuth === 'login') {
            return (
                <form className="flex flex-col gap-4 my-5" onSubmit={handleLogin}>
                    <TextInput autoFocus={false} w={'99%'} leftSection={<IconAt size={16} />} label='Email' type="email" required placeholder="Ex: matei.partac45@gmail.com" {...formLogIn.getInputProps('email')} />
                    <TextInput autoFocus={false} w={'99%'} label='Parola' required placeholder="Parola" type="password" autoComplete="off" {...formLogIn.getInputProps('password')} />
                    {loginError && <div style={{ color: 'red', fontSize: 14, marginBottom: 8 }}>{loginError}</div>}
                    <Group justify="space-between">
                        <Anchor c={"#b756a6"} onClick={() => setTypeAuth('signin')} size="xs">Nu ai cont? SignUp</Anchor>
                        <ForgotPasswordModal />
                        <Button type="submit" variant='filled' color='#b756a6' disabled={loading}>Login</Button>
                    </Group>
                </form>
            );
        } else if (user.isAuthenticated) {
            return (
                <div className="flex flex-col gap-4 my-5">
                    <Group>
                        <Avatar size={50} radius="xl" src={user.userInfo.avatar} alt={`${user.userInfo.name} ${user.userInfo.surname}`} />
                        <div>
                            <h1 className="text-lg font-bold">Salut, </h1>
                            <h3>{user.userInfo.name} {user.userInfo.surname}</h3>
                        </div>
                    </Group>
                    <Anchor component={Link} onClick={() => close()} href='/user' c={"#b756a6"} > Actualizeaza Profilul</Anchor>
                    <Group justify="space-between">
                        <Button color='#b756a6' onClick={() => { logout(); close(); setLoginError(null); setTypeAuth('login'); }}>Deconectare</Button>
                    </Group>
                </div>
            );
        }
    }, [user.isAuthenticated, user.userInfo.avatar, user.userInfo.name, user.userInfo.surname, typeAuth, handleSignUp, formSignUp, check, loginError, loading, handleLogin, formLogIn, logout, close]);

    return (
        <>
            <Modal opened={opened} onClose={close} title="Cont de utilizator" withCloseButton={true} centered overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
                {loading && <Group justify="center" my="md"><Loader color="blue" /></Group>}
                {renderForm}
            </Modal>
            <Modal
                opened={successModalOpened}
                onClose={() => setSuccessModalOpened(false)}
                centered
                overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
            >
                <p className='flex justify-center'>{successMessage}</p>
                <Group justify="center" mt="md">
                    <Button onClick={() => setSuccessModalOpened(false)}>OK</Button>
                </Group>
            </Modal>
            {user.isAuthenticated && user.userInfo.email === "matei.partac45@gmail.com" && (
                <Button variant="transparent" p={0} color="red">
                    <Link href="/admin"><IconFlower size={18} /></Link>
                </Button>
            )}
            {user.userInfo.email !== "matei.partac45@gmail.com" && (
                <Button variant="transparent" p={0} color="red">
                    <Link href="/cart"><IconShoppingCart size={18} /></Link>
                </Button>
            )}
            <NavbarButton variant="secondary" onClick={open}>
                {
                    user.isAuthenticated ?
                        <IconUser color='blue' size={18} /> :
                        <IconUser size={18} />
                }
            </NavbarButton>
        </>
    );
});

AuthModal.displayName = "AuthModal";