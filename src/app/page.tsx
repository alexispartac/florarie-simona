'use client';
import { Footer } from "./components/Footer";
import Content from "./components/Content";
import PopUp from "./components/PopUp";
import React from "react";


export default function Home() {

  return (
    <div>
      <PopUp />
      <Content />
      <Footer />
    </div>
  );
}
