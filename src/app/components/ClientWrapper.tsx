'use client';
import React from 'react';
import { useStore } from './context/StoreContext';
import GlobalMessage from './GlobalMessage';
import { AutoConnectWithToken } from './AutoConnectWithToken';
import { RestrictedComponents } from './RestrictedComponents';
import CookieConsentBanner from './CookieConsent';

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isClosed } = useStore();

  return (
    <>
      {isClosed ? (
        <GlobalMessage />
      ) : (
        <>
          <AutoConnectWithToken />
          <RestrictedComponents>{children}</RestrictedComponents>
          <CookieConsentBanner />
        </>
      )}
    </>
  );
};

export default ClientWrapper;