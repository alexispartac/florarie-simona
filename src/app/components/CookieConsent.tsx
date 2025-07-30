'use client';
import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { Anchor } from '@mantine/core';

const CookieConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept toate cookies"
      declineButtonText="Respinge"
      enableDeclineButton
      cookieName="florarie-simona-cookie-consent"
      expires={365} // Cookie-ul de consimțământ expiră în 1 an
      style={{
        background: "rgba(0, 0, 0, 0.85)",
        fontSize: "14px",
        padding: "20px",
        zIndex: 9999,
      }}
      buttonStyle={{
        background: "#b756a6",
        color: "white",
        fontSize: "14px",
        borderRadius: "4px",
        border: "none",
        padding: "10px 20px",
        margin: "0 10px",
        cursor: "pointer",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "white",
        fontSize: "14px",
        borderRadius: "4px",
        border: "1px solid white",
        padding: "10px 20px",
        margin: "0 10px",
        cursor: "pointer",
      }}
      onAccept={(acceptedByScrolling) => {
        if (acceptedByScrolling) {
          console.log("Cookies acceptate prin scroll");
        } else {
          console.log("Cookies acceptate prin click");
        }
        // Aici poți adăuga logica pentru activarea cookie-urilor
        enableAnalytics();
      }}
      onDecline={() => {
        console.log("Cookies respinse");
        // Aici poți adăuga logica pentru dezactivarea cookie-urilor
        disableAnalytics();
      }}
      acceptOnScroll={true}
      acceptOnScrollPercentage={20}
    >
      <span>
        🍪 Acest site folosește cookies pentru a îmbunătăți experiența ta de navigare. 
        Prin continuarea navigării, ești de acord cu utilizarea acestora. 
        <br />
        <Anchor 
          href="/cookie-policy" 
          target="_blank" 
          style={{ color: "#b756a6", textDecoration: "underline" }}
        >
          Citește Politica de Cookies
        </Anchor>
      </span>
    </CookieConsent>
  );
};

// Funcții helper pentru gestionarea analytics
const enableAnalytics = () => {
  // Activează Google Analytics, Facebook Pixel, etc.
  if (typeof window !== 'undefined') {
    // Exemplu: Google Analytics
    // gtag('consent', 'update', {
    //   'analytics_storage': 'granted'
    // });
    
    localStorage.setItem('cookies-analytics-enabled', 'true');
    console.log("Analytics activat");
  }
};

const disableAnalytics = () => {
  // Dezactivează toate cookie-urile de tracking
  if (typeof window !== 'undefined') {
    // Exemplu: Google Analytics
    // gtag('consent', 'update', {
    //   'analytics_storage': 'denied'
    // });
    
    localStorage.setItem('cookies-analytics-enabled', 'false');
    console.log("Analytics dezactivat");
  }
};

export default CookieConsentBanner;
