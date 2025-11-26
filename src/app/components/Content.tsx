'use client'
import { useProductsGroupedByCategory } from './hooks/fetchProductsGroupedByCategory';
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import ColourfulText from "./ui/colourful-text";
import { AuroraBackground } from "./ui/aurora-background";
import { Loader } from '@mantine/core';
import { motion } from "motion/react";
import Link from 'next/link';
import React from 'react'
import ReviewForm from './ReviewForm';
import Reviews from './Reviews';
import axios from 'axios';
import { IconBrandFacebook, IconBrandInstagram, IconBrandWhatsapp } from '@tabler/icons-react';

export function InfiniteMovingCardsDemo() {
    const { data: groupedProducts, isLoading, isError } = useProductsGroupedByCategory();
    const testimonials = groupedProducts
        ? Object.keys(groupedProducts).map((category) => ({ title: category }))
        : [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader color="#b756a6" size="xl" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-64 rounded-2xl p-8 mx-4" style={{ backgroundColor: '#fef2f2' }}>
                <div className="text-center">
                    <div className="text-4xl mb-4">🌸</div>
                    <p className="text-red-600 font-medium">A apărut o eroare la încărcarea categoriilor.</p>
                    <p className="text-gray-500 text-sm mt-2">Vă rugăm să reîncărcați pagina.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-24 px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block p-3 rounded-full mb-4"
                        style={{ backgroundColor: '#b756a64f' }}
                    >
                        <span className="text-3xl">🌸</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Categoriile Noastre
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Descoperă varietatea de aranjamente florale pentru fiecare ocazie specială
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 overflow-hidden">
                    <InfiniteMovingCards
                        items={testimonials}
                        direction="right"
                        speed="normal"
                    />
                </div>
            </motion.div>
        </div>
    );
}

const Story = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 my-20 md:mt-40">
            <div className="bg-white dark:bg-white dark:bg-grid-white/[0.05] rounded-lg p-6 md:p-10 lg:p-12">
                {/* Layout pentru desktop și mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Coloana text */}
                    <div className="order-2 lg:order-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0.0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: 0.5,
                                duration: 0.8,
                                ease: "easeInOut",
                            }}
                        >
                            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                La <span className="font-semibold" style={{ color: '#b756a6' }}>Buchetul Simonei</span>, credem că fiecare floare spune o poveste. Fondată din pasiunea pentru frumusețea naturii și dorința de a aduce bucurie în viețile oamenilor, florăria noastră a crescut de la o mică afacere locală la un nume de încredere în livrarea de flori proaspete și aranjamente florale spectaculoase.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0.0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: 0.7,
                                duration: 0.8,
                                ease: "easeInOut",
                            }}
                        >
                            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                Echipa noastră dedicată de florari talentați lucrează cu atenție pentru a crea buchete care să reflecte emoțiile și ocaziile speciale ale clienților noștri. Fiecare aranjament este realizat cu grijă, folosind doar cele mai proaspete flori, pentru a asigura calitatea și satisfacția deplină.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0.0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: 0.9,
                                duration: 0.8,
                                ease: "easeInOut",
                            }}
                        >
                            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                Ne mândrim cu serviciul nostru de livrare rapidă și fiabilă, asigurându-ne că fiecare comandă ajunge la destinație în condiții perfecte. Indiferent dacă este vorba de o aniversare, o zi de naștere sau pur și simplu dorința de a aduce un zâmbet pe fața cuiva drag, suntem aici pentru a transforma momentele speciale în amintiri de neuitat.
                            </p>
                        </motion.div>

                        {/* Call to action button */}
                        <motion.div
                            initial={{ opacity: 0.0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 1.1,
                                duration: 0.8,
                                ease: "easeInOut",
                            }}
                            className="pt-4"
                        >
                            <Link
                                href="/filtered-products"
                                className="inline-flex items-center gap-2 bg-[#b756a64f] text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <span>Descoperă Colecția</span>
                                <span>🌸</span>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Coloana imagine */}
                    <div className="order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0.0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: 0.6,
                                duration: 0.8,
                                ease: "easeInOut",
                            }}
                            className="relative w-full"
                        >
                            {/* Container pentru imagine cu efect decorativ */}
                            <div className="relative group w-full">
                                {/* Backdrop decorativ */}
                                <div className="absolute -inset-4 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300 blur-xl" style={{ background: 'linear-gradient(to right, #b756a64f, #b756a64f)' }}></div>

                                {/* Imaginea principală */}
                                <div className="relative bg-white p-2 rounded-2xl shadow-xl w-full">
                                    <img
                                        src="/promoflower.jpg"
                                        alt="Florăria Buchetul Simonei - Aranjamente florale profesionale"
                                        className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                                    />

                                    {/* Overlay decorativ */}
                                    <div className="absolute inset-2 rounded-xl bg-gradient-to-t from-pink-400/20 via-transparent to-transparent"></div>

                                    {/* Badge decorativ */}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-sm font-medium" style={{ color: '#b756a6' }}>🌸 Handmade cu dragoste</span>
                                    </div>
                                </div>
                            </div>

                            {/* Elemente decorative flotante */}
                            <motion.div
                                className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-60"
                                style={{ backgroundColor: '#b756a6' }}
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            <motion.div
                                className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full opacity-40"
                                style={{ backgroundColor: '#b756a6' }}
                                animate={{
                                    y: [0, 10, 0],
                                    rotate: [360, 180, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1,
                                }}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Statistici sau features în footer */}
                <motion.div
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 1.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="mt-16 pt-8 border-t border-pink-100"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-[#b756a6]">500+</div>
                            <div className="text-gray-600">Clienți mulțumiți</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-[#b756a6]">24/7</div>
                            <div className="text-gray-600">Suport disponibil</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-[#b756a6]">4.9★</div>
                            <div className="text-gray-600">Rating mediu</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

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
                <button className="bg-white content dark:bg-white rounded-sm h-[70px] w-[200px] text-white dark:text-black px-4 py-2">
                    <Link href="/features">
                        <p className="text-2xl font-bold">
                            Descoperă
                        </p>
                    </Link>
                </button>
            </motion.div>
        </AuroraBackground>
    );
}

export const Delivery = () => {
    return (
        <div className="my-24 px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block p-3 rounded-full mb-4"
                        style={{ backgroundColor: '#dcfce7' }}
                    >
                        <span className="text-3xl">🚚</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        De ce să alegi Buchetul Simonei?
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Servicii premium pentru experiențe de neuitat
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Livrare Gratuită */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#dcfce7' }}>
                                <span className="text-3xl">🚛</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Livrare gratuită</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Livrare gratuită de flori în comuna Tămășeni.
                            </p>
                        </motion.div>

                        {/* Garanție 100% Mulțumit */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#fecaca' }}>
                                <span className="text-3xl">❤️</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Garantam Prospetimea</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Produsele noastre sunt proaspete și de calitate superioară, garantând satisfacția clienților.
                                {/* Ești mulțumit 100% de comanda ta de flori sau primești integral banii înapoi. Satisfacția ta este prioritatea noastră. */}
                            </p>
                        </motion.div>

                        {/* Livrare Express */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#dbeafe' }}>
                                <span className="text-3xl">⏳</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Livrare Express în Tămășeni</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Livrăm florile comandate online în maximum 2 ore, oriunde în comuna Tămășeni și împrejurimi.
                            </p>
                        </motion.div>
                    </div>

                    {/* Call to action */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mt-16 text-center"
                    >
                        <div className="bg-[#b756a64f] text-white px-8 py-6 rounded-3xl shadow-sm max-w-4xl mx-auto">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                🌸 Flori deosebite pentru momente de neuitat! 🌸
                            </h3>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

const NewOfers = () => {
    return (
        <div className="my-24 px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block p-3 rounded-full mb-4"
                        style={{ backgroundColor: '#fef3c7' }}
                    >
                        <span className="text-3xl">✨</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Oferte Speciale
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Descoperă promoțiile noastre exclusive și economisește la cele mai frumoase aranjamente florale
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Card 1 - Simplist */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-50" style={{ background: 'linear-gradient(to bottom right, #b756a64f, #b756a64f)' }}></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#b756a64f' }}>
                                <span className="text-3xl">💐</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ofertă Specială!</h3>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Florile spun mai mult decât cuvintele. Alege un buchet minunat pentru cei dragi și bucură-te de reduceri!
                            </p>
                            <Link
                                href="/features/Promotii"
                                className="inline-flex items-center gap-2 bg-[#b756a64f] text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                <span>Comandă acum</span>
                                <span>🌸</span>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Card 2 - Simplist */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-20 h-20 rounded-full blur-2xl opacity-50" style={{ background: 'linear-gradient(to bottom right, #b756a64f, #b756a64f)' }}></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#b756a64f' }}>
                                <span className="text-3xl">🌹</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ofertele Săptămânii!</h3>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Această săptămână îți aduce buchete la prețuri imbatabile, gata să transforme orice moment într-o amintire de neuitat. <span className="font-bold" style={{ color: '#b756a6' }}>Timp limitat!</span>
                            </p>
                            <Link
                                href="/features/Promotii%20saptamanale"
                                className="inline-flex items-center gap-2 bg-[#b756a64f] text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                <span>Comandă acum</span>
                                <span>✨</span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

const URL_REVIEW = '/api/review';
const Content = () => {

    const handleSubmitedReview = async (values: { name: string; email: string; message: string }) => {
        try {
            const response = await axios.post(URL_REVIEW, values);
            if (response.status === 200) {
                console.log('Review submitted successfully:', response.data);
            } else {
                console.log('Unexpected response:', response);
            }
        } catch (error) {
            console.log('Error submitting review:', error);
        }
    };

    return (
        <div className="relative w-full pt-24 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    className="h-80"
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                >
                    <h1 className="mb-4 mt-18 md:mt-34 text-3xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-center">
                        Buchetul Simonei <br /> ~poezia <ColourfulText text="florilor" />~
                    </h1>

                    <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl text-zinc-500">
                        În fiecare petală se ascunde o poveste, iar în fiecare floare, un vis.🌸✨ Împreună, scriem povești parfumate.
                    </p>

                    {/* Social Media Section - Aranjat frumos */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
                        className="flex flex-col items-center justify-center space-y-4 mt-8 mb-16"
                    >
                        <p className="text-gray-600 text-lg font-medium">Ne găsiți și pe:</p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {/* Instagram */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                className="group"
                            >
                                <Link 
                                    href="https://www.instagram.com/poeziaflorilor/" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1"
                                >
                                    <IconBrandInstagram size={24} />
                                    <span className="font-semibold">Instagram</span>
                                </Link>
                            </motion.div>

                            {/* Facebook */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                className="group"
                            >
                                <Link 
                                    href="https://www.facebook.com/people/Simona-Buz%C4%83u/100009279287640/" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1"
                                >
                                    <IconBrandFacebook size={24} />
                                    <span className="font-semibold">Facebook</span>
                                </Link>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                className="group"
                            >
                                <p 
                                    className="flex items-center cursor-pointer gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1"
                                >
                                    <IconBrandWhatsapp size={24} />
                                    <span className="font-semibold">0769141250</span>
                                </p>
                            </motion.div>
                        </div>

                        {/* Decorative elements */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="flex items-center gap-3 mt-4"
                        >
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-pink-300"></div>
                            <span className="text-2xl">🌸</span>
                            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-pink-300"></div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Componentele îmbunătățite */}
            <Story />
            <AuroraBackgroundDemo />
            <NewOfers />
            <InfiniteMovingCardsDemo />

            {/* Secțiunea de recenzii - simplă */}
            <div className="my-24 px-4 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block p-3 rounded-full mb-4"
                            style={{ backgroundColor: '#dbeafe' }}
                        >
                            <span className="text-3xl">💬</span>
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Ce spun clienții noștri
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Feedback autentic de la cei care au ales Buchetul Simonei
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <ReviewForm
                            productTitle="Buchetul Simonei"
                            onSubmit={handleSubmitedReview}
                        />
                        <Reviews product={`Buchetul Simonei`} />
                    </div>
                </motion.div>
            </div>

            <Delivery />
        </div>
    );
};

export default Content
