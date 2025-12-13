// src/app/homepage/page.tsx
'use client';
import { Footer } from "../components/Footer";
import Content from "../components/Content";
import PopUp from "../components/PopUp";
import React from "react";
import Advertisement from "../components/Advertisement";
import { getSeasonalAd } from "../components/seasonalAds";

export default function Home() {
  const seasonalAd = getSeasonalAd();

  return (
    <div>
      <Advertisement 
        imageSrc={seasonalAd.imageSrc}
        buttonText={seasonalAd.buttonText}
        buttonLink={seasonalAd.buttonLink}
      />
      <PopUp />
      <Content />
      <Footer />
    </div>
  );
}