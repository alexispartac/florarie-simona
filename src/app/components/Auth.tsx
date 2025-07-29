'use client';
import { Modal, Button, TextInput, Group, Checkbox, Anchor, Loader, Avatar, Badge, PasswordInput } from '@mantine/core';
import { IconAt, IconFlower, IconShoppingCart, IconUser } from "@tabler/icons-react";
import React, { useCallback, useState, useMemo } from "react";
import { ForgotPasswordModal } from "./ForgotPassword";
import { NavbarButton } from "./ui/resizable-navbar";
import { useUser } from './context/ContextUser';
import { useDisclosure } from '@mantine/hooks';
import { useCookies } from "react-cookie";
import { useForm } from '@mantine/form';
import { v4 as uuidv4 } from 'uuid';
import Link from "next/link";
import axios from "axios";

const URL_LOGIN = "/api/users/login";
const URL_SIGN = "/api/users";
const URL_SEND_CONFIRM_EMAIL = "/api/users/send-confirm-email";

export interface FormValues {
    surname: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

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
    const [successModalOpened, setSuccessModalOpened] = useState(false); 
    const [successMessage, setSuccessMessage] = useState<string>('');
    const logout = useHandleLogout();
    const cartItemCount = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems') || '[]').length : 0;

    const formSignUp = useForm<FormValues>({
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        initialValues: {
            name: '',
            surname: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        initialErrors: {
            name: '',
            surname: '',
            email: '',
            password: '',
            confirmPassword: '',
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
            confirmPassword: (value, values) => {
                if (value !== values.password) {
                    return 'Parolele nu coincid!';
                }
                return null;
            },
            email: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Email invalid!';
                }
                return null;
            },
        },
    });

    const formLogIn = useForm({
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        initialValues: {
            email: '',
            password: '',
        },
        initialErrors: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Email invalid!';
                }
                return null;
            },
            password: (value) => {
                if (!value || value.trim() === '') {
                    return 'Parola este obligatorie!';
                }
                return null;
            },
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
                setSuccessModalOpened(true); 
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
                setSuccessModalOpened(true);                                    
                close(); 
                axios.post(URL_SEND_CONFIRM_EMAIL, {
                    clientEmail: data.email,
                    clientName: `${data.name} ${data.surname}`,
                });
            }

        } catch (error) {
            console.log('Error signing up', error);
            setLoginError("Eroare la înregistrare. Verifică datele introduse.");
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

    // Dezabonare de la newsletter
    const unsubscribeFromNewsletter = useCallback(async (email: string) => {
        try {
            const response = await axios.delete('/api/newsletter', { data: { email } });
            const data = response.data;
            if (response.status !== 200) {
                throw new Error(data.message || 'Eroare la dezabonare.');
            }
            if (response.status === 200) {
                setSuccessMessage('Email-ul a fost dezabonat cu succes de la newsletter.');
                setSuccessModalOpened(true);
            } else {
                setLoginError(data.message || 'Eroare la dezabonare.');
                setLoginError('');
            }
        } catch (error) {
            console.error('Error unsubscribing from newsletter:', error);
            setLoginError('Eroare la dezabonare. Încearcă din nou mai târziu.');
        }
    }, []);

    const renderForm = useMemo(() => {
        if (!user.isAuthenticated && typeAuth === 'signin') {
            return (
                <form className="flex flex-col gap-4 my-5" onSubmit={handleSignUp}>
                    <Group>
                        <TextInput w={'47%'} label='Nume' required placeholder="Ex: your-name" {...formSignUp.getInputProps('name')} />
                        <TextInput w={'47%'} label='Prenume' required placeholder="Ex: your-firstname" {...formSignUp.getInputProps('surname')} />
                    </Group>
                    <TextInput w={'99%'} leftSection={<IconAt size={16} />} type="email" label='email' required placeholder="Ex: your-email@example.com" {...formSignUp.getInputProps('email')} />
                    <PasswordInput w={'99%'} label='Parola' required placeholder="password" type="password" autoComplete="off" {...formSignUp.getInputProps('password')} />
                    <TextInput w={'99%'} label='Confirmare parola' required placeholder="password" type="password" autoComplete="off" {...formSignUp.getInputProps('confirmPassword')} />
                    <Group>
                        <Checkbox c={"#b756a6"} color={"#b756a6"} checked={check} onChange={(event) => setCheck(event.currentTarget.checked)} />
                        <span className='text-sm'>Sunt de acord cu <Anchor href="/terms&conditions" target="_blank" c={"#b756a6"}>Termenii și condițiile</Anchor> </span>
                    </Group>
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
                    <TextInput w={'99%'} leftSection={<IconAt size={16} />} label='Email' type="email" required placeholder="your-email@example.com" {...formLogIn.getInputProps('email')} />
                    <PasswordInput w={'99%'} label='Parola' required placeholder="password" type="password" autoComplete="off" {...formLogIn.getInputProps('password')} />
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
                    <Anchor component={Link} onClick={() => close()} href='/your-orders' c={"#b756a6"} > Vezi Comenzile</Anchor>
                    <Button variant="subtle" color="#b756a6" onClick={() => unsubscribeFromNewsletter(user.userInfo.email)}>
                        Dezabonare de la newsletter
                    </Button>
                    <Button variant="filled" color="#b756a6" onClick={() => { logout(); close(); }}>Deconectare</Button>
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
                    <Button color='#b756a6' onClick={() => setSuccessModalOpened(false)}>OK</Button>
                </Group>
            </Modal>
            <div className='grid grid-cols-2'>
                <NavbarButton as={"div"} variant="secondary" className='flex h-[34px] items-center justify-center'>
                    {user.isAuthenticated && user.userInfo.email === "matei.partac45@gmail.com"
                        ? (
                            <Button variant="transparent" p={0} color="red">
                                <Link href="/admin"><IconFlower size={18} /></Link>
                            </Button>
                        ) : (
                            <div className="relative flex flex-col">
                                {cartItemCount > 0 && (
                                    <Badge
                                        color="red"
                                        size="xs"
                                        className="absolute top-1 -right-3"
                                    >
                                        {cartItemCount}
                                    </Badge>
                                )}
                                <Button variant="transparent" p={0} color="red">
                                    <Link href="/cart" className="relative inline-block"><IconShoppingCart size={18} /></Link>
                                </Button>
                            </div>
                        )
                    }
                </NavbarButton>
                <NavbarButton variant="secondary" onClick={open} className='flex items-center justify-center h-[34px]'>
                    {user.isAuthenticated ? <IconUser color='blue' size={18} /> : <IconUser size={18} />}
                </NavbarButton>

            </div>
        </>
    );
});

AuthModal.displayName = "AuthModal";