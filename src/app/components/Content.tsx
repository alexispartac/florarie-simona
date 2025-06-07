'use client'
import React from 'react'
import { motion } from "motion/react";
import { AuroraBackground } from "./ui/aurora-background";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { useProductsGroupedByCategory } from './hooks/fetchProductsGroupedByCategory';
import Link from 'next/link';
import { Loader } from '@mantine/core';


export function InfiniteMovingCardsDemo() {
    const { data: groupedProducts, isLoading, isError } = useProductsGroupedByCategory();
    const testimonials = groupedProducts
    ? Object.keys(groupedProducts).map((category) => ({ title: category }))
    : [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" size="lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>A apărut o eroare la încărcarea produselor.</p>
            </div>
        );
    }

    return (
        <div className="h-[30rem] rounded-md flex flex-col antialiased bg-white dark:bg-white dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="fast"
        />
        </div>
    );
}

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
                    Descoperă noua colectie de flori.
                </div>
                <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
                    Flori care vorbesc sufletului.
                </div>
                <button className="bg-white content dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
                    <Link href="/features">
                        Descoperă
                    </Link>
                </button>
            </motion.div>
        </AuroraBackground>
    );
}

export const Delivery = () => {
    return (
        <div className="bg-white py-10 px-6 mt-10 rounded-lg shadow-lg md:px-40">
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
        <div style={{ backgroundImage: "url('/dashbordflower.jpg')"}} className="md:pt-60 md:max-w-xl bg-cover bg-center max-w-xs mx-auto p-4 shadow-lg text-center transition-transform duration-300 ease-in-out hover:scale-110 md:h-[400px]">
            <h3 className="text-lg important font-semibold mt-2 max-w-[5rem] shadow-2xl m-auto bg-amber-100">Ofertă!</h3>
            <p className="text-white">
                Florile spun mai mult decât cuvintele. Alege un buchet minunat pentru
                cei dragi!
            </p>
            <a
                href="features/Promotions"
                className="inline-block mt-3 px-4 py-2 bg-white content opacity-80 dark:bg-white w-fit text-white dark:text-black transition duration-300"
            >
                Comandă acum
            </a>
        </div>
        <div style={{ backgroundImage: "url('/promoflower.jpg')" }} className="md:pt-60 md:max-w-xl bg-cover bg-center max-w-xs mx-auto p-4 shadow-lg text-center transition-transform duration-300 ease-in-out hover:scale-110">
            <h3 className="text-lg important font-semibold mt-2 shadow-2xl m-auto bg-amber-100">Descopera ofertele saptamanii!</h3>
            <p className="text-white">
             Această săptămână îți aduce buchete la prețuri imbatabile, gata să transforme orice moment într-o amintire de neuitat.
            </p>
            <a
                href="features/Promotii%20saptamanale"
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
                    Poezia florilor by Simona
                </h1>
                <p className="mb-20 text-center text-md text-zinc-500">
                    „În fiecare petală se ascunde o poveste, iar în fiecare floare, un vis.🌸✨ Împreună, scriem povești parfumate.”
                </p>
            </motion.div>
            <AuroraBackgroundDemo />
            <NewOfers />           
            <InfiniteMovingCardsDemo />
            <Delivery />
        </div>
    );
};

export default Content
