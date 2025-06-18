'use client';
import React, { useState } from 'react';
import { Modal, Button, TextInput, Loader, Anchor } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';

const URL_FORGOT_PASSWORD = "/api/users/login/forgot-password";

export const ForgotPasswordModal = () => {
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email'); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(URL_FORGOT_PASSWORD, { email });
      if (response.status === 200) {
        setMessage('Codul de resetare a fost trimis pe email.');
        setStep('verify'); 
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
        setStep('reset'); 
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
        close(); 
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
      <Anchor onClick={open} size="xs">
        Ai uitat parola?
      </Anchor>
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
              autoFocus={false}
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
              autoFocus={false}
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
              autoFocus={false}
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
              autoFocus={false}
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