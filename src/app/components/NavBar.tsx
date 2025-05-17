"use client";
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
import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, TextInput, Group, Checkbox, Anchor} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAt } from "@tabler/icons-react";

const AuthModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [check, setCheck] = useState<boolean>(false);
  const [typeAuth, setTypeAuth] = useState<{ type: 'login' | 'signin'}>({
    type: 'login'
  });
  const formSignUp = useForm({
    mode:'uncontrolled',
    initialValues:{
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
  })
  const formLogIn = useForm({
    mode:'uncontrolled',
    initialValues:{
        email: '',
        password: '',
    },
    transformValues: (values) => ({
        email: `${values.email}`,
        password: `${values.password}`
    })
  })

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
        {( typeAuth.type === 'signin' &&
        <form 
          className="flex flex-col gap-4 my-5"
          onSubmit={ formSignUp.onSubmit(() => { 
            console.log(formSignUp.getValues());
            return close();
          })}
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
          <Group justify="space-between">
            <Anchor onClick={() => setTypeAuth({ type : 'login'})} size="xs">
              Ai deja un cont? Login
            </Anchor>
            <Button 
              type="submit" 
              disabled={
                !check ||
                formSignUp.getValues().password !== formSignUp.getValues().confirmPassword
              }
              onClick={close}
              >Sign in</Button>
          </Group>
          
        </form> )}
        {( typeAuth.type === 'login' && 
        <form
          className="flex flex-col gap-4 my-5"
          onSubmit={ formLogIn.onSubmit(() => { 
            console.log(formLogIn.getValues());
            return close();
          })}
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
            <Group justify="space-between">
              <Anchor onClick={() => setTypeAuth({ type: 'signin' })} size="xs">
                Nu ai cont? SignUp
              </Anchor>
              <Button
                type="submit"
              >Login</Button>
            </Group>

        </form>)}
          
      </Modal>
      <NavbarButton variant="secondary" onClick={open}>Login</NavbarButton>
      
    </>
  );
}

export function NavbarDemo({ children } : { children: React.ReactNode}) {
  const navItems = [
      {
          name: "Buchete",
          link: "bouquets",
          category: [
              {
                  name: "Buchete de aniversare",
                  link: "bouquets/anniversary",
              },
              {
                  name: "Buchete de graduatie",
                  link: "bouquets/graduation",
              },
              {
                  name: "Buchete personalizate",
                  link: "bouquets/custom",
              },
          ]
      },
      {
          name: "Aranjamente florale",
          link: "arrangements",
          category: [
              {
                  name: "Aranjamente florale personalizate",
                  link: "arrangements/custom",
              },
          ]
      },
      {
          name: "Ocazii si evenimente",
          link: "occasion&events",
          category: [
              {
                  name: "Ocazii si evenimente personalizate",
                  link: "occasion&events/custom",
              },
          ]
      },
      {
          name: "Cadouri",
          link: "gifts",
          category: [
              {
                  name: "Cadouri personalizate",
                  link: "gifts/custom",
              },
          ]
      },
      {
          name: "Noutati",
          link: "features",
          category: []
      },
      {
          name: "Despre",
          link: "about",
          category: []
      },
      {
          name: "Contact",
          link: "contact",
          category: []
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
            <NavbarButton variant="primary">Sună-mă</NavbarButton>
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
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-800 dark:text-neutral-600"
                >
                  <span className="block">{item.name}</span>
                </Link>
                {hovered === idx && idx < 4 && (
                  <motion.div
                    layoutId="hovered"
                    className="relative font-extrabold text-[100%] flex flex-col text-start font-serif px-5 py-3 w-full bg-white dark:white "
                  >
                    {
                      item.category?.map((category, idx) => (
                        <Link key={idx} className="py-[4px]" href={`/${item.link}/${category.name}`}>{category.name}</Link>
                      ))
                    }
                  </motion.div>
                )}
              </div>
            ))}
            <div className="flex w-full flex-col gap-4">
              <AuthModal /> 
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {children}
    </div>
  );
}
