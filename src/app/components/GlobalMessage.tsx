'use client';
import React from 'react';
import { useStore } from './../components/context/StoreContext';
import { Button, Group, Modal, TextInput } from '@mantine/core';
import { useUser } from './context/ContextUser';
import { useDisclosure } from '@mantine/hooks';
import { IconAt, IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const URL_LOGIN = "/api/users/login";

const GlobalMessage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { isClosed, closePeriod, setIsClosed } = useStore();
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [successModalOpened, setSuccessModalOpened] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string>('');
  const { setUser } = useUser();
  const router = useRouter();

  const formLogIn = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });

  if (!isClosed || !closePeriod) return null;

  const handleLogin = async (data: { email: string; password: string }) => {
    if (!data.email || !data.password) {
      setLoginError("Email și parola sunt obligatorii.");
      return;
    }

    if (data.email !== "matei.partac45@gmail.com") {
      setLoginError("Nu aveți permisiunea de a accesa această pagină.");
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
        setSuccessMessage('Autentificare reușită! Bine ai venit!');
        setIsClosed(false); 
        setSuccessModalOpened(true);
        close();
        return router.push('/'); 
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError("Eroare la autentificare.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError(null);
    const { email, password } = formLogIn.values;
    handleLogin({ email, password });
    formLogIn.reset();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white text-white fixed top-0 left-0 w-full h-full z-50">
      {/* Mesaj de succes */}
      <Modal
        opened={successModalOpened}
        onClose={() => setSuccessModalOpened(false)}
        centered
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <p className="flex justify-center">{successMessage}</p>
        <Group justify="center" mt="md">
          <Button color="#b756a6" onClick={() => setSuccessModalOpened(false)}>
            OK
          </Button>
        </Group>
      </Modal>

      {/* Mesaj global */}
      <div className="fixed top-0 left-0 w-full bg-[#b756a5] text-white text-center py-2 z-50">
        Magazinul este închis până la data de <br /> { closePeriod }.
      </div>

      {/* Mesaj de închidere */}
      <div className="flex flex-col items-center justify-center mt-10 text-[#b756a5]">
        <h1 className="text-2xl font-bold mb-4">
          Magazinul este închis!
          <button onClick={open}> 🥲 </button>
        </h1>
        <p className="text-lg">Vă mulțumim pentru înțelegere!</p>
        <p>Dacă aveți întrebări contactați: 0772055889</p>
        <Group className="mt-4">
          <Link href="https://www.facebook.com/people/Simona-Buz%C4%83u/100009279287640/" className="hover:text-gray-300"><IconBrandFacebook /></Link>
          <Link href="https://www.instagram.com/poeziaflorilor/" className="hover:text-gray-300"><IconBrandInstagram /></Link>
        </Group> 
      </div>

      {/* Modal de autentificare */}
      <Modal
        opened={opened}
        onClose={close}
        title="Admin Login"
        centered
        size="lg"
      >
        <div className="text-center">
          <p>Perioada de închidere este până la data de {closePeriod}.</p>
          <form className="flex flex-col gap-4 my-5" onSubmit={handleSubmit}>
            <TextInput
              autoFocus={false}
              w="99%"
              leftSection={<IconAt size={16} />}
              label="Email"
              type="email"
              required
              placeholder="Ex: matei.partac45@gmail.com"
              {...formLogIn.getInputProps('email')}
            />
            <TextInput
              autoFocus={false}
              w="99%"
              label="Parola"
              required
              placeholder="Parola"
              type="password"
              autoComplete="off"
              {...formLogIn.getInputProps('password')}
            />
            {loginError && (
              <div style={{ color: 'red', fontSize: 14, marginBottom: 8 }}>
                {loginError}
              </div>
            )}
            <Group justify="space-between">
              <Button onClick={close} color='red' className="mt-4 text-white px-4 py-2 rounded">
                Închide
              </Button>
              <Button type="submit" variant="filled" color="#b756a6" disabled={loading}>
                Login
              </Button>
            </Group>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default GlobalMessage;
