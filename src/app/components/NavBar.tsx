"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../components/ui/resizable-navbar";
import Link from "next/link";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, TextInput, Group, Checkbox, Anchor, CopyButton, Tooltip, ActionIcon, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAt, IconCheck, IconCopy, IconFlower, IconShoppingCart } from "@tabler/icons-react";
import { useCookies } from "react-cookie";
import { useUser } from "./ContextUser";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from 'uuid';
import { motion } from "motion/react";

const URL_SIGN = "http://localhost:3000/api/users";
const URL_LOGIN = "http://localhost:3000/api/users/login";
const URL_VERIFY_TOKEN = "http://localhost:3000/api/users/login/verify-token";

const ForgotPasswordModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email'); // Etapele: email, verificare, resetare parolă

  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/api/users/login/forgot-password', { email });
      if (response.status === 200) {
        setMessage('Codul de resetare a fost trimis pe email.');
        setStep('verify'); // Trecem la etapa de verificare
      }
    } catch (err) {
      console.error(err);
      setError('A apărut o eroare.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/api/users/login/verify-code', { email, code });
      if (response.status === 200) {
        setMessage('Codul a fost verificat cu succes!');
        setStep('reset'); // Trecem la etapa de resetare a parolei
      }
    } catch (err) {
      console.error(err);
      setError('Codul este invalid sau a expirat.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Parolele nu coincid.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/users/login/reset-password', { email, newPassword });
      if (response.status === 200) {
        setMessage('Parola a fost resetată cu succes!');
        close(); // Închidem modalul după resetare
      }
    } catch (err) {
      console.error(err);
      setError('A apărut o eroare la resetarea parolei.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Anchor pentru deschiderea modalului */}
      <Anchor onClick={open} size="xs">
        Ai uitat parola?
      </Anchor>

      {/* Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          step === 'email'
            ? 'Resetare Parolă'
            : step === 'verify'
            ? 'Verificare Cod'
            : 'Setare Parolă Nouă'
        }
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {step === 'email' && (
          <div>
            <TextInput
              label="Email"
              placeholder="Introdu adresa ta de email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              onClick={handleForgotPassword}
              className="mt-4"
              fullWidth
              disabled={loading || !email}
            >
              {loading ? <Loader size="sm" /> : 'Trimite Codul'}
            </Button>
            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        )}

        {step === 'verify' && (
          <div>
            <TextInput
              label="Cod de verificare"
              placeholder="Introdu codul primit pe email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Button
              onClick={handleVerifyCode}
              className="mt-4"
              fullWidth
              disabled={loading || !code}
            >
              {loading ? <Loader size="sm" /> : 'Verifică Codul'}
            </Button>
            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        )}

        {step === 'reset' && (
          <div>
            <TextInput
              label="Parolă Nouă"
              placeholder="Introdu parola nouă"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextInput
              label="Confirmare Parolă"
              placeholder="Confirmă parola nouă"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-4"
            />
            <Button
              onClick={handleResetPassword}
              className="mt-4"
              fullWidth
              disabled={loading || !newPassword || !confirmPassword}
            >
              {loading ? <Loader size="sm" /> : 'Resetează Parola'}
            </Button>
            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        )}
      </Modal>
    </>
  );
};

const AuthModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [check, setCheck] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(['login']);
  const { user, setUser } = useUser();
  const [typeAuth, setTypeAuth] = useState<{ type: 'login' | 'signin' }>({ type: 'login' });
  const [mounted, setMounted] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signUp(
    data: {
      id: string;
      name: string;
      surname: string;
      email: string;
      password: string;
    }
  ) {
    setLoading(true);
    try {
      const response = await axios.post(URL_SIGN, data);
      if (mounted && (response.status === 200 || response.status === 201)) {
        login({
          email: data.email, password: data.password
        });
        formSignUp.reset();
        close();
      }
    } catch (error: unknown) {
      formSignUp.reset();
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response === "object" &&
        (error as { response?: { status?: number } }).response !== null &&
        "status" in (error as { response?: { status?: number } }).response!
      ) {
        if ((error as { response: { status: number } }).response.status === 409) {
          setLoginError("Există deja un cont cu acest email.");
        } else {
          setLoginError("Eroare la înregistrare.");
        }
      } else {
        setLoginError("Eroare la înregistrare.");
      }
      console.log('Error signing up', error);
    } finally {
      setLoading(false);
    }
  }

  const login = useCallback(
    async (data: { email: string; password: string }) => {
        if (user.isAuthenticated) return;
        setLoginError(null);
        setLoading(true);
        try {
            const response = await axios.post(URL_LOGIN, data);
            if (mounted && response.status === 200) {
                setUser({
                    userInfo: {
                        id: response.data.user.id,
                        name: response.data.user.name,
                        surname: response.data.user.surname,
                        email: response.data.user.email,
                        phone: response.data.user.phone,
                        address: response.data.user.address,
                        order: response.data.user.order,
                        createdAt: response.data.user.createdAt,
                        password: '',
                    },
                    isAuthenticated: true,
                });
                setCookie('login', response.data.token, { path: '/' });
                close();
            }
        } catch (error) {
            console.error('Error logging in', error);
            setLoginError("Eroare la autentificare.");
        } finally {
            setLoading(false);
        }
    },
    [mounted, setUser, setCookie, close, user.isAuthenticated]
);

  const handleLogout = useCallback(() => {
    removeCookie("login", { path: '/' });
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
      },
      isAuthenticated: false,
    });
  }, [removeCookie, setUser]);

  const verifyToken = useCallback(() => {
    const token = cookies.login;
    if (token && !user.isAuthenticated) {
      axios.post(URL_VERIFY_TOKEN, { token })
        .then(response => {
          if (response.status === 200) {
            const decoded: { email: string; password: string; } = jwtDecode(token);
            login({ email: decoded.email, password: decoded.password });
          }
        })
        .catch(error => {
          console.error('Error verifying token', error);
          handleLogout();
        });
    } 
  }, [cookies.login, user.isAuthenticated, login, handleLogout]);

  useEffect(() => {
    if (!user.isAuthenticated) {
        setMounted(true);
        verifyToken();
  }

}, [verifyToken, user.isAuthenticated]);

  const formSignUp = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    transformValues: (values) => ({
      name: `${values.name}`,
      surname: `${values.surname}`,
      email: `${values.email}`,
      password: `${values.password}`,
      confirmPassword: `${values.confirmPassword}`
    })
  });
  const formLogIn = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    transformValues: (values) => ({
      email: `${values.email}`,
      password: `${values.password}`
    })
  });

  function handleSignUp(event: React.FormEvent) {
    event.preventDefault();
    setLoginError(null);
    const { name, surname, email, password, confirmPassword } = formSignUp.getValues();
    if (password !== confirmPassword) {
      setLoginError("Parolele nu coincid!");
      return;
    }
    const id = uuidv4();
    signUp({ id, name, surname, email, password });
  }

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoginError(null);
    const { email, password } = formLogIn.getValues();
    login({ email, password });
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Authentication"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {loading && (
          <Group justify="center" my="md">
            <Loader color="blue" />
          </Group>
        )}
        {(typeAuth.type === 'signin' &&
          <form
            className="flex flex-col gap-4 my-5"
            onSubmit={handleSignUp}
          >
            <Group>
              <TextInput
                w={'47%'}
                label='Nume'
                required
                placeholder="Ex: Partac"
                key={formSignUp.key('name')}
                {...formSignUp.getInputProps('name')}
              />
              <TextInput
                w={'47%'}
                label='Prenume'
                required
                placeholder="Ex: Alexis"
                key={formSignUp.key('surname')}
                {...formSignUp.getInputProps('surname')}
              />
            </Group>
            <TextInput
              w={'99%'}
              leftSection={<IconAt size={16} />}
              type="email"
              label='Email'
              required
              placeholder="Ex:matei.partac45@gmail.com"
              key={formSignUp.key('email')}
              {...formSignUp.getInputProps('email')}
            />
            <TextInput
              w={'99%'}
              label='Parola'
              required
              placeholder="Parola"
              type="password"
              autoComplete="off"
              key={formSignUp.key('password')}
              {...formSignUp.getInputProps('password')}
            />
            <TextInput
              w={'99%'}
              label='Confirmare parola'
              required
              placeholder="Parola"
              type="password"
              autoComplete="off"
              key={formSignUp.key('confirmPassword')}
              {...formSignUp.getInputProps('confirmPassword')}
            />
            <Checkbox
              label="Sunt de-acord cu termenii si conditiile"
              checked={check}
              onChange={(event) => setCheck(event.currentTarget.checked)}
            />
            {loginError && (
              <div style={{ color: 'red', fontSize: 14, marginBottom: 8 }}>
                {loginError}
              </div>
            )}
            <Group justify="space-between">
              <Anchor onClick={() => setTypeAuth({ type: 'login' })} size="xs">
                Ai deja un cont? Login
              </Anchor>
              <Button
                type="submit"
                disabled={
                  loading ||
                  !check ||
                  formSignUp.getValues().password !== formSignUp.getValues().confirmPassword
                }
              >Sign in</Button>
            </Group>
          </form>)}
        {(typeAuth.type === 'login' &&
          <form
            className="flex flex-col gap-4 my-5"
            onSubmit={handleLogin}
          >
            <TextInput
              w={'99%'}
              leftSection={<IconAt size={16} />}
              label='Email'
              type="email"
              required
              placeholder="Ex: matei.partac45@gmail.com"
              key={formLogIn.key('email')}
              {...formLogIn.getInputProps('email')}
            />
            <TextInput
              w={'99%'}
              label='Parola'
              required
              placeholder="Parola"
              type="password"
              autoComplete="off"
              key={formLogIn.key('password')}
              {...formLogIn.getInputProps('password')}
            />
            {loginError && (
              <div style={{ color: 'red', fontSize: 14, marginBottom: 8 }}>
                {loginError}
              </div>
            )}
            <Group justify="space-between">
              <Anchor onClick={() => setTypeAuth({ type: 'signin' })} size="xs">
                Nu ai cont? SignUp
              </Anchor>
              <ForgotPasswordModal />
              <Button
                type="submit"
                disabled={loading}
              >Login</Button>
            </Group>
          </form>)}
      </Modal>
      {user.isAuthenticated && user.userInfo.email === "matei.partac45@gmail.com" && (
        <Button variant="transparent" p={0} color="red">
          <Link href="/admin">
            <IconFlower size={22} />
          </Link>
        </Button>
      )}
      {user.userInfo.email !== "matei.partac45@gmail.com" &&
        <Button variant="transparent" p={0} color="red">
          <Link href="/cart">
            <IconShoppingCart size={22} />
          </Link>
        </Button>
      }
      {mounted && (
        cookies.login ? (
          <Button variant="transparent" color="red" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <NavbarButton variant="secondary" onClick={open}>Login</NavbarButton>
        )
      )}
    </>
  );
}

const CallModal = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened}
        onClose={close}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
        <Group px={4}>
          <p className="w-[80%]"> 0772055889 </p>
          <CopyButton value="0772055889" timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Modal>

      <Button variant="transparent" color="red" onClick={open}>
        Suna-ma
      </Button>
    </>
  );
}
const URL_COMPOSED_CATEGORIES = 'http://localhost:3000/api/products-composed-categories';
export function NavbarDemo({ children }: { children: React.ReactNode }) {
  const [composedCategories, setComposedCategories] = useState<{ name: string, link: string }[]>([]);


  const fetchComposedCategories = async () => {
    try {
      const response = await axios.get(URL_COMPOSED_CATEGORIES);
      if (response.status === 200) {
        setComposedCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching composed categories', error);
    }
  };

  useEffect(() => {
    fetchComposedCategories();
  }, []);

  const groupCategoriesByLink = (categories: { name: string; link: string }[]) => {
    const grouped: Record<string, { name: string; link: string }[]> = {};

    categories.forEach((category) => {
      if (!grouped[category.link]) {
        grouped[category.link] = [];
      }
      grouped[category.link].push(category);
    });

    return grouped;
  };

  const groupedCategories = groupCategoriesByLink(composedCategories);

  const navItems = [
    {
      name: "Buchete",
      link: "bouquets",
      category: groupedCategories["bouquets"] || [],
    },
    {
      name: "Aranjamente florale",
      link: "arrangements",
      category: groupedCategories["arrangements"] || [],
    },
    {
      name: "Ocazii și evenimente",
      link: "occasion&events",
      category: groupedCategories["occasion&events"] || [],
    },
    {
      name: "Cadouri",
      link: "gifts",
      category: groupedCategories["gifts"] || [],
    },
    {
      name: "Noutati",
      link: "features",
      category: groupedCategories["features"] || [],
    },
    {
      name: "Blog",
      link: "blog",
      category: [],
    },
    {
      name: "Contact",
      link: "contact",
      category: [],
    },
  ];


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className={`relative w-full var(--background)`}>
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <AuthModal />
            <CallModal />
          </div>
        </NavBody>
        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <div
                onMouseLeave={() => setHovered(null)}
                key={`mobile-link-${idx}`}
              >
                <Link
                  onMouseEnter={() => setHovered(idx)}
                  href={`/${item.link}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-800 dark:text-neutral-600"
                >
                  <span className="block">{item.name}</span>
                </Link>
                {hovered === idx && idx < 5 && (
                  <motion.div
                    layoutId="hovered"
                    className="relative text-[100%] flex flex-col text-start font-serif px-5 py-3 w-full bg-white dark:white "
                  >
                    {
                      item.category?.map((category, idx) => (
                        <Link key={idx} className="py-[4px]" href={`/${category.link}/${category.name}`}>{category.name}</Link>
                      ))
                    }
                  </motion.div>
                )}
              </div>
            ))}
            <div className="flex w-full flex-col gap-4">
              <AuthModal />
              <CallModal />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {children}
    </div>
  );
}
