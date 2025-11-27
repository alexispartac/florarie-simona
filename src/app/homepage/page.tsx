// src/app/homepage/page.tsx
'use client';
import { Footer } from "../components/Footer";
import Content from "../components/Content";
import PopUp from "../components/PopUp";
import React from "react";
import Advertisement from "../components/Advertisement";

export default function Home() {
  return (
    <div>
      <Advertisement 
        imageSrc="/Christmas.webp" // Make sure this image exists in your public folder
        buttonText="Vezi ofertele de Crăciun"
        buttonLink="/arrangements/Christmas%20decorations"
      />
      <PopUp />
      <Content />
      <Footer />
    </div>
  );
}