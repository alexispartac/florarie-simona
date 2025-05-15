'use client'
import React from 'react'
import { motion } from "motion/react";
import { AuroraBackground } from "./ui/aurora-background";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[30rem] rounded-md flex flex-col antialiased bg-white dark:bg-white dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    title: "Categorie 1",
  },
  {
    title: "Categorie 2",
  },
  {
    title: "Categorie 3",
  },
  {
    title: "Categorie 4",
  },
  {
    title: "Categorie 5",
  },
];


export function AuroraBackgroundDemo() {
    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative flex flex-col gap-4 items-center justify-center px-4"
            >
                <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
                    Descoperă intreaga colectie de flori.
                </div>
                <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
                    Flori care vorbesc sufletului.
                </div>
                <button className="bg-white content dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
                    Descoperă
                </button>
            </motion.div>
        </AuroraBackground>
    );
}

const Delivery = () => {
    return (
        <div className="bg-white py-10 px-6 mt-10 rounded-lg shadow-lg md:px-30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-30 text-gray-800">

                {/* Livrare Same Day */}
                <div className="flex items-center space-x-4">
                    <div className="text-3xl">🚚</div>
                    <div>
                        <h3 className="font-bold text-lg">Livrare same day</h3>
                        <p className="text-sm">Livrare flori cadou, buchete de flori, aranjamente florale cu livrare în aceeași zi prin curieri proprii.</p>
                    </div>
                </div>

                {/* Livrare Gratuită */}
                <div className="flex items-center space-x-4">
                    <div className="text-3xl">🚛</div>
                    <div>
                        <h3 className="font-bold text-lg">Livrare gratuită</h3>
                        <p className="text-sm">Livrare gratuită de flori în orice localitățe din România.</p>
                    </div>
                </div>

                {/* Garanție 100% Mulțumit */}
                <div className="flex items-center space-x-4">
                    <div className="text-3xl">❤️</div>
                    <div>
                        <h3 className="font-bold text-lg">Garanție 100% Mulțumit</h3>
                        <p className="text-sm">Ești mulțumit 100% de comanda ta de flori sau primești integral banii înapoi.</p>
                    </div>
                </div>

                {/* Livrare Express București */}
                <div className="flex items-center space-x-4">
                    <div className="text-3xl">⏳</div>
                    <div>
                        <h3 className="font-bold text-lg">Livrare Express In Judetul Neamt</h3>
                        <p className="text-sm">Livrăm florile comandate online în maximum 2 ore, oriunde în Judetul Neamt.</p>
                    </div>
                </div>

            </div>
            <div className="mt-10 text-center">
                <button className="bg-white text-2xl color-theme dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
                Flori deosebite pentru momente de neuitat! Livrare rapida in Romania si garantie 100% la orice comanda
                </button>
            </div>
        </div>
    )
}

const NewOfers = () => {
  return (
    <div className='grid md:grid-cols-2 grid-cols-1 gap-y-20 gap-6 mt-20 mx-5 md:px-20 md:my-40'>
        <div style={{ backgroundImage: "url('flower.jpeg')"}} className="md:pt-60 md:max-w-xl bg-cover bg-center max-w-xs mx-auto p-4 shadow-lg text-center transition-transform duration-300 ease-in-out hover:scale-110 md:h-[400px]">
            <h3 className="text-lg important font-semibold mt-2">Ofertă!</h3>
            <p className="text-white">
                Florile spun mai mult decât cuvintele. Alege un buchet minunat pentru
                cei dragi!
            </p>
            <a
                href="#"
                className="inline-block mt-3 px-4 py-2 bg-white content opacity-80 dark:bg-white w-fit text-white dark:text-black transition duration-300"
            >
                Comandă acum
            </a>
        </div>
        <div style={{ backgroundImage: "url('flower.jpeg')" }} className="md:pt-60 md:max-w-xl bg-cover bg-center max-w-xs mx-auto p-4 shadow-lg text-center transition-transform duration-300 ease-in-out hover:scale-110">
            <h3 className="text-lg important font-semibold mt-2">Descopera ofertele saptamanii!</h3>
            <p className="text-white">
             Această săptămână îți aduce buchete la prețuri imbatabile, gata să transforme orice moment într-o amintire de neuitat.
            </p>
            <a
                href="#"
                className="inline-block mt-3 px-4 py-2  bg-white content opacity-80 dark:bg-white w-fit text-white dark:text-black transition duration-300"
            >
                Comandă acum
            </a>
        </div>
    </div>
  );
};


const Content = () => {
    return (
        <div className="relative container mx-auto pt-24">
            <motion.div
                className='h-120 px-4 '
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
            >
                <h1 className="mb-4 mt-22 text-center text-6xl font-bold">
                    Descoperă lumea florilor by Simona
                </h1>
                <p className="mb-20 text-center text-md text-zinc-500">
                    {/* Flori care vorbesc sufletului.🌸✨
                    Bucuria naturii, livrată cu dragoste. */}
                    „În fiecare petală se ascunde o poveste, iar în fiecare floare, un vis.🌸✨ Împreună, scriem povești parfumate.”
                </p>
            </motion.div>
            <AuroraBackgroundDemo />
            <NewOfers />           
            {/* <div className="flex flex-col md:flex-row items-center justify-between h-150 w-full bg-gradient-to-r from-purple-200 via-pink-200 to-red-200 py-30 mt-40 gap-10 rounded-lg shadow-xl p-6">
                <motion.div
                    className="w-[50%] px-30 text-xl leading-8 indent-6 font-light bg-white/20 backdrop-blur-md rounded-lg p-6 shadow-lg"
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                >
                    <p>
                        „Într-un colț al lumii, unde natura își țese magia, florile își încep dansul în razele blânde ale dimineții.
                        Fiecare petală e un șoaptă a trecutului, o amintire păstrată în culori și parfumuri. În mâinile celor care le aleg cu grijă,
                        florile devin mesageri ai iubirii, ai bucuriei și ai speranței.”
                    </p>
                    <p className="mt-4">
                        „Fie că sunt dăruite pentru a celebra un început sau pentru a păstra vie o amintire, florile spun povești fără cuvinte.
                        Iar noi, cei care le alegem, le îngrijim și le dăruim, devenim parte din aceste povești. Împreună, continuăm să scriem istoria fiecărei petale,
                        să aducem frumusețea naturii mai aproape de suflete.”
                    </p>
                </motion.div>
                <motion.div
                    className="w-[50%] px-20"
                    initial={{ opacity: 0.0, y: 40, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                >
                    <div className="flex justify-center">
                        <img src="/flower.jpeg" alt="Flower" className="w-1/2 h-auto rounded-lg shadow-lg" />
                    </div>
                </motion.div>

            </div> */}
            <InfiniteMovingCardsDemo />
            <Delivery />
        </div>
    );
};

export default Content