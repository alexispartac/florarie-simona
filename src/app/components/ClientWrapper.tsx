'use client';

import React from 'react';
import { useStore } from './context/StoreContext';
import GlobalMessage from './GlobalMessage';
import { AutoConnectWithToken } from './AutoConnectWithToken';
import { RestrictedComponents } from './RestrictedComponents';
import AnimateForBegin from "./ui/animate-for-begin";

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isClosed } = useStore();

  return (
    <>
      {isClosed ? (
        <GlobalMessage />
      ) : (
        <>
          <AnimateForBegin />
          <AutoConnectWithToken />
          <RestrictedComponents>{children}</RestrictedComponents>
        </>
      )}
    </>
  );
};

export default ClientWrapper;