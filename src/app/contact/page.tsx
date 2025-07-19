'use client';
import { Button, Checkbox, Textarea, TextInput, Notification, Loader } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Footer } from '../components/Footer';
import { useForm } from '@mantine/form';
import * as React from 'react';
import axios from 'axios';

export default function Contact() {
    const [agreed, setAgreed] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [notification, setNotification] = React.useState<{
        visible: boolean;
        type: 'success' | 'error';
        message: string;
    }>({ visible: false, type: 'success', message: '' });

    const formContact = useForm({
        mode: 'uncontrolled',
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            message: ""
        },
        transformValues: (values) => ({
            first_name: `${values.first_name}`,
            last_name: `${values.last_name}`,
            email: `${values.email}`,
            phone_number: `${values.phone_number}`,
            message: `${values.message}`
        })
    });

    const sendEmail = async (value: {
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        message: string;
    }) => {
        setLoading(true); // Activăm indicatorul de încărcare
        try {
            const response = await axios.post('/api/contact', value, { withCredentials: true });
            if (response.status === 200) {
                setNotification({
                    visible: true,
                    type: 'success',
                    message: 'Mesajul a fost trimis cu succes!',
                });
                formContact.reset(); // Resetăm formularul după succes
            }
        } catch (error) {
            console.log('Error sending email:', error);
            setNotification({
                visible: true,
                type: 'error',
                message: 'A apărut o eroare la trimiterea mesajului.',
            });
        } finally {
            setLoading(false); // Dezactivăm indicatorul de încărcare
        }
    };

    return (
        <div>
            <div className="h-screen flex items-center justify-center mb-80 md:mb-120">
                <div className="isolate h-screen bg-white px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Contacteaza-mă</h2>
                        <p className="mt-2 text-lg/8 text-gray-600">Voi raspunde cat de repede posibil la mesajul tău.</p>
                    </div>
                    <form
                        onSubmit={formContact.onSubmit((value) => sendEmail(value))}
                        className="mx-auto mt-16 max-w-xl sm:mt-20"
                    >
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="mt-2.5">
                                <TextInput
                                    label="Nume"
                                    id="first-name"
                                    name="first_name"
                                    type="text"
                                    required
                                    autoFocus={false}
                                    key={formContact.key('first_name')}
                                    {...formContact.getInputProps('first_name')}
                                    placeholder={"Ex: Partac"}
                                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500"
                                />
                            </div>
                            <div className="mt-2.5">
                                <TextInput
                                    label="Prenume"
                                    id="last-name"
                                    name="last_name"
                                    type="text"
                                    required
                                    autoFocus={false}
                                    key={formContact.key('last_name')}
                                    {...formContact.getInputProps('last_name')}
                                    placeholder={"Ex: Alexis-Matei"}
                                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <div className="mt-2.5">
                                    <TextInput
                                        label='Email'
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoFocus={false}
                                        key={formContact.key('email')}
                                        {...formContact.getInputProps('email')}
                                        placeholder={"Ex: exemplu@gmail.com"}
                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <div className="mt-2.5">
                                    <TextInput
                                        label="Numar de telefon"
                                        id="phone-number"
                                        name="phone_number"
                                        required
                                        autoFocus={false}
                                        key={formContact.key('phone_number')}
                                        {...formContact.getInputProps('phone_number')}
                                        type="text"
                                        placeholder="+40"
                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <div className="mt-2.5">
                                    <Textarea
                                        id="message"
                                        name="message"
                                        required
                                        key={formContact.key('message')}
                                        {...formContact.getInputProps('message')}
                                        placeholder={"Lasa aici mesajul tau"}
                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        defaultValue={''}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-x-4 sm:col-span-2">
                                <Checkbox
                                    className="text-sm/6 text-gray-600"
                                    onChange={() => setAgreed(!agreed)}
                                    c={"#b756a6"} 
                                    color={"#b756a6"} 
                                    required
                                    label="Sunt de-acord cu termenii si conditiile."
                                />
                            </div>
                        </div>
                        <br />
                        <div className="mt-10">
                            <Button
                                type="submit"
                                variant="filled"
                                color={"#b756a6"}
                                disabled={!agreed || loading}
                                className="block w-full rounded-md color-theme px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-300 hover:text-white  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {loading ? <Loader size="sm" color="white" /> : 'Trimite'}
                            </Button>
                        </div>
                    </form>
                    <br /><br /><br />
                </div>
            </div>

            {/* Notificare */}
            {notification.visible && (
                <div className="fixed bottom-4 right-4 z-50">
                    <Notification
                        icon={notification.type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />}
                        color={notification.type === 'success' ? 'teal' : 'red'}
                        title={notification.type === 'success' ? 'Succes!' : 'Eroare!'}
                        onClose={() => setNotification({ ...notification, visible: false })}
                    >
                        {notification.message}
                    </Notification>
                </div>
            )}

            <Footer />
        </div>
    );
}